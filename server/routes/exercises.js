const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Exercise = require('../models/Exercise');
const User = require('../models/User');

// @route   POST api/exercises
// @desc    Add a new exercise
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { exerciseType, duration, distance, date } = req.body;
    
    // Simple validation
    if (!exerciseType || !duration) {
      return res.status(400).json({ msg: 'Please provide exercise type and duration' });
    }
    
    // Calculate calories burned (simplified formula)
    // In a real app, this would be more sophisticated based on weight, exercise intensity, etc.
    let caloriesBurned = null;
    
    const user = await User.findById(req.user.id);
    const weight = user.physicalDetails.weight || 70; // Default weight if not available
    
    if (exerciseType === 'running') {
      caloriesBurned = duration * 0.2 * weight; // Simplified calculation
    } else if (exerciseType === 'cycling') {
      caloriesBurned = duration * 0.13 * weight; // Simplified calculation
    } else if (exerciseType === 'swimming') {
      caloriesBurned = duration * 0.25 * weight; // Simplified calculation
    } else if (exerciseType === 'walking') {
      caloriesBurned = duration * 0.08 * weight; // Simplified calculation
    } else {
      caloriesBurned = duration * 0.1 * weight; // Default
    }
    
    const newExercise = new Exercise({
      user: req.user.id,
      exerciseType,
      duration,
      distance: distance || null,
      caloriesBurned: Math.round(caloriesBurned),
      date: date || Date.now()
    });
    
    const exercise = await newExercise.save();
    
    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exercises
// @desc    Get all user exercises
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = { user: req.user.id };
    
    // Date filtering if provided
    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        query.date.$lte = new Date(endDate);
      }
    }
    
    const exercises = await Exercise.find(query).sort({ date: -1 });
    res.json(exercises);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/exercises/:id
// @desc    Get exercise by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ msg: 'Exercise not found' });
    }
    
    // Check if exercise belongs to user
    if (exercise.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Exercise not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/exercises/:id
// @desc    Update an exercise
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { exerciseType, duration, distance, caloriesBurned, date } = req.body;
    
    // Find the exercise
    let exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ msg: 'Exercise not found' });
    }
    
    // Check if exercise belongs to user
    if (exercise.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Update fields if provided
    if (exerciseType) exercise.exerciseType = exerciseType;
    if (duration) exercise.duration = duration;
    if (distance !== undefined) exercise.distance = distance;
    if (caloriesBurned) exercise.caloriesBurned = caloriesBurned;
    if (date) exercise.date = date;
    
    await exercise.save();
    
    res.json(exercise);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Exercise not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/exercises/:id
// @desc    Delete an exercise
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const exercise = await Exercise.findById(req.params.id);
    
    if (!exercise) {
      return res.status(404).json({ msg: 'Exercise not found' });
    }
    
    // Check if exercise belongs to user
    if (exercise.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await exercise.remove();
    
    res.json({ msg: 'Exercise removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Exercise not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;