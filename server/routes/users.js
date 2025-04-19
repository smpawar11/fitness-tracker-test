const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// @route   GET api/users/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/weight
// @desc    Update user weight
// @access  Private
router.put('/weight', auth, async (req, res) => {
  try {
    const { weight } = req.body;
    
    if (!weight) {
      return res.status(400).json({ msg: 'Weight is required' });
    }
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update physical details
    user.physicalDetails.weight = weight;
    
    // Add to weight history
    user.weightHistory.push({
      weight,
      date: Date.now()
    });
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/users/profile
// @desc    Update user profile details
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { realName, email, physicalDetails } = req.body;
    
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    
    // Update fields if provided
    if (realName) user.realName = realName;
    if (email) user.email = email;
    
    // Update physical details if provided
    if (physicalDetails) {
      if (physicalDetails.height) user.physicalDetails.height = physicalDetails.height;
      if (physicalDetails.age) user.physicalDetails.age = physicalDetails.age;
      if (physicalDetails.gender) user.physicalDetails.gender = physicalDetails.gender;
      
      // Handle weight separately to track history
      if (physicalDetails.weight && physicalDetails.weight !== user.physicalDetails.weight) {
        user.physicalDetails.weight = physicalDetails.weight;
        user.weightHistory.push({
          weight: physicalDetails.weight,
          date: Date.now()
        });
      }
    }
    
    await user.save();
    
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

module.exports = router;