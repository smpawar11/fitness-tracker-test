const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Diet = require('../models/Diet');

// @route   POST api/diet
// @desc    Add a new diet entry
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { foodName, calories, mealType, customFood, date } = req.body;
    
    // Simple validation
    if (!foodName || !calories || !mealType) {
      return res.status(400).json({ msg: 'Please provide food name, calories, and meal type' });
    }
    
    const newDiet = new Diet({
      user: req.user.id,
      foodName,
      calories,
      mealType,
      customFood: customFood || false,
      date: date || Date.now()
    });
    
    const diet = await newDiet.save();
    
    res.json(diet);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/diet
// @desc    Get all user diet entries
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { startDate, endDate, mealType } = req.query;
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
    
    // Filter by meal type if provided
    if (mealType) {
      query.mealType = mealType;
    }
    
    const diets = await Diet.find(query).sort({ date: -1 });
    res.json(diets);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/diet/summary
// @desc    Get daily calorie summary
// @access  Private
router.get('/summary', auth, async (req, res) => {
  try {
    const { date } = req.query;
    
    if (!date) {
      return res.status(400).json({ msg: 'Please provide a date' });
    }
    
    // Set date range for the specified day
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    
    const endDate = new Date(date);
    endDate.setHours(23, 59, 59, 999);
    
    // Get all diet entries for the day
    const diets = await Diet.find({
      user: req.user.id,
      date: {
        $gte: startDate,
        $lte: endDate
      }
    });
    
    // Calculate totals
    let totalCalories = 0;
    const mealSummary = {
      breakfast: { count: 0, calories: 0 },
      lunch: { count: 0, calories: 0 },
      dinner: { count: 0, calories: 0 },
      snack: { count: 0, calories: 0 }
    };
    
    diets.forEach(diet => {
      totalCalories += diet.calories;
      mealSummary[diet.mealType].count += 1;
      mealSummary[diet.mealType].calories += diet.calories;
    });
    
    res.json({
      totalCalories,
      mealSummary,
      entryCount: diets.length
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/diet/:id
// @desc    Get diet entry by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const diet = await Diet.findById(req.params.id);
    
    if (!diet) {
      return res.status(404).json({ msg: 'Diet entry not found' });
    }
    
    // Check if diet entry belongs to user
    if (diet.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    res.json(diet);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Diet entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/diet/:id
// @desc    Update a diet entry
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { foodName, calories, mealType, customFood, date } = req.body;
    
    // Find the diet entry
    let diet = await Diet.findById(req.params.id);
    
    if (!diet) {
      return res.status(404).json({ msg: 'Diet entry not found' });
    }
    
    // Check if diet entry belongs to user
    if (diet.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    // Update fields if provided
    if (foodName) diet.foodName = foodName;
    if (calories) diet.calories = calories;
    if (mealType) diet.mealType = mealType;
    if (customFood !== undefined) diet.customFood = customFood;
    if (date) diet.date = date;
    
    await diet.save();
    
    res.json(diet);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Diet entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/diet/:id
// @desc    Delete a diet entry
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const diet = await Diet.findById(req.params.id);
    
    if (!diet) {
      return res.status(404).json({ msg: 'Diet entry not found' });
    }
    
    // Check if diet entry belongs to user
    if (diet.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    await diet.remove();
    
    res.json({ msg: 'Diet entry removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Diet entry not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;