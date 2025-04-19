const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Goal = require('../models/Goal');
const User = require('../models/User');
const Group = require('../models/Group');

// @route   POST api/goals
// @desc    Create a new goal
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { type, title, description, targetValue, targetDate, isGroupGoal, groupId } = req.body;
    
    // Simple validation
    if (!type || !title || !targetDate) {
      return res.status(400).json({ msg: 'Please provide goal type, title, and target date' });
    }
    
    // If it's a group goal, verify user is a member of the group
    if (isGroupGoal && groupId) {
      const group = await Group.findById(groupId);
      
      if (!group) {
        return res.status(404).json({ msg: 'Group not found' });
      }
      
      // Check if user is in group
      if (!group.members.includes(req.user.id) && group.admin.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized - not a member of this group' });
      }
    }
    
    const newGoal = new Goal({
      user: req.user.id,
      type,
      title,
      description: description || '',
      targetValue: targetValue || 0,
      targetDate,
      isGroupGoal: isGroupGoal || false,
      groupId: isGroupGoal ? groupId : null
    });
    
    const goal = await newGoal.save();
    
    // Add goal to user's goals array
    const user = await User.findById(req.user.id);
    user.goals.push(goal._id);
    await user.save();
    
    // If it's a group goal, add to group's goals array
    if (isGroupGoal && groupId) {
      const group = await Group.findById(groupId);
      group.goals.push(goal._id);
      await group.save();
    }
    
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/goals
// @desc    Get all user goals
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { type, completed } = req.query;
    let query = { user: req.user.id };
    
    // Filter by type if provided
    if (type) {
      query.type = type;
    }
    
    // Filter by completion status if provided
    if (completed !== undefined) {
      query.completed = completed === 'true';
    }
    
    const goals = await Goal.find(query).sort({ targetDate: 1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/goals/group/:groupId
// @desc    Get all goals for a specific group
// @access  Private
router.get('/group/:groupId', auth, async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    
    if (!group) {
      return res.status(404).json({ msg: 'Group not found' });
    }
    
    // Check if user is a member of the group
    if (!group.members.includes(req.user.id) && group.admin.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized - not a member of this group' });
    }
    
    const goals = await Goal.find({ groupId: req.params.groupId }).sort({ targetDate: 1 });
    res.json(goals);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Group not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   GET api/goals/:id
// @desc    Get goal by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    
    // Check if goal belongs to user or is a group goal the user is a member of
    if (!goal.isGroupGoal && goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    if (goal.isGroupGoal) {
      const group = await Group.findById(goal.groupId);
      if (!group.members.includes(req.user.id) && group.admin.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
    }
    
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/goals/:id
// @desc    Update a goal
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, description, targetValue, currentValue, targetDate, completed } = req.body;
    
    // Find the goal
    let goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    
    // Check if goal belongs to user or if user is admin of group (for group goals)
    if (!goal.isGroupGoal && goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    if (goal.isGroupGoal) {
      const group = await Group.findById(goal.groupId);
      if (group.admin.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized - only group admin can update group goals' });
      }
    }
    
    // Update fields if provided
    if (title) goal.title = title;
    if (description !== undefined) goal.description = description;
    if (targetValue !== undefined) goal.targetValue = targetValue;
    if (currentValue !== undefined) goal.currentValue = currentValue;
    if (targetDate) goal.targetDate = targetDate;
    if (completed !== undefined) goal.completed = completed;
    
    // Auto-set completed status based on current and target values
    if (goal.type !== 'custom' && goal.currentValue >= goal.targetValue) {
      goal.completed = true;
    }
    
    await goal.save();
    
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/goals/:id/progress
// @desc    Update goal progress (current value)
// @access  Private
router.put('/:id/progress', auth, async (req, res) => {
  try {
    const { currentValue } = req.body;
    
    if (currentValue === undefined) {
      return res.status(400).json({ msg: 'Current value is required' });
    }
    
    // Find the goal
    let goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    
    // Check if goal belongs to user or is a group goal the user is a member of
    if (!goal.isGroupGoal && goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    if (goal.isGroupGoal) {
      const group = await Group.findById(goal.groupId);
      if (!group.members.includes(req.user.id) && group.admin.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized' });
      }
    }
    
    goal.currentValue = currentValue;
    
    // Auto-set completed status based on current and target values
    if (goal.type !== 'custom' && goal.currentValue >= goal.targetValue) {
      goal.completed = true;
    }
    
    await goal.save();
    
    res.json(goal);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE api/goals/:id
// @desc    Delete a goal
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const goal = await Goal.findById(req.params.id);
    
    if (!goal) {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    
    // Check if goal belongs to user or if user is admin of group (for group goals)
    if (!goal.isGroupGoal && goal.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'Not authorized' });
    }
    
    if (goal.isGroupGoal) {
      const group = await Group.findById(goal.groupId);
      if (group.admin.toString() !== req.user.id) {
        return res.status(401).json({ msg: 'Not authorized - only group admin can delete group goals' });
      }
    }
    
    await goal.remove();
    
    // Remove goal from user's goals array
    const user = await User.findById(req.user.id);
    user.goals = user.goals.filter(g => g.toString() !== req.params.id);
    await user.save();
    
    // If it's a group goal, remove from group's goals array
    if (goal.isGroupGoal && goal.groupId) {
      const group = await Group.findById(goal.groupId);
      if (group) {
        group.goals = group.goals.filter(g => g.toString() !== req.params.id);
        await group.save();
      }
    }
    
    res.json({ msg: 'Goal removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Goal not found' });
    }
    res.status(500).send('Server Error');
  }
});

module.exports = router;