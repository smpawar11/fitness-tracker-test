const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const auth = require('../middleware/auth');
require('dotenv').config();

// @route   POST api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', async (req, res) => {
  console.log('Server: Registration request received:', {
    username: req.body.username,
    email: req.body.email
  });
  
  try {
    const { username, realName, email, password, physicalDetails } = req.body;
    
    // Check if username already exists
    let user = await User.findOne({ username });
    if (user) {
      console.log('Server: Registration failed - username already exists:', username);
      return res.status(400).json({ msg: 'Username already exists' });
    }
    
    // Check if email already exists
    user = await User.findOne({ email });
    if (user) {
      console.log('Server: Registration failed - email already exists:', email);
      return res.status(400).json({ msg: 'Email already exists' });
    }
    
    // Create a new user
    user = new User({
      username,
      realName,
      email,
      password,
      physicalDetails
    });
    
    // Add initial weight to weight history if provided
    if (physicalDetails && physicalDetails.weight) {
      user.weightHistory = [{ weight: physicalDetails.weight }];
    }
    
    await user.save();
    console.log('Server: User registered successfully:', username);
    
    // Create token payload
    const payload = {
      user: {
        id: user.id
      }
    };
    
    // Generate token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'healthtrackersecret123',
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        console.log('Server: JWT token generated for new user');
        res.status(201).json({ token });
      }
    );
  } catch (err) {
    console.error('Server: Registration error:', err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
  console.log('Server: Login attempt for username:', req.body.username);
  
  const { username, password } = req.body;

  try {
    // Check if user exists
    let user = await User.findOne({ username });
    if (!user) {
      console.log('Server: Login failed - user not found:', username);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Server: Login failed - incorrect password for user:', username);
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Create token payload
    const payload = {
      user: {
        id: user.id
      }
    };

    // Generate token
    jwt.sign(
      payload,
      process.env.JWT_SECRET || 'healthtrackersecret123',
      { expiresIn: '5h' },
      (err, token) => {
        if (err) throw err;
        console.log('Server: Login successful for user:', username);
        res.json({ token });
      }
    );
  } catch (err) {
    console.error('Server: Login error:', err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/auth
// @desc    Get logged in user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    console.log('Server: Fetching user data for ID:', req.user.id);
    const user = await User.findById(req.user.id).select('-password');
    if (user) {
      console.log('Server: User data retrieved successfully for:', user.username);
    } else {
      console.log('Server: User not found for ID:', req.user.id);
    }
    res.json(user);
  } catch (err) {
    console.error('Server: Error fetching user data:', err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;