const mongoose = require('mongoose');

const GoalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    required: true,
    enum: ['weight', 'exercise', 'diet', 'custom']
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String
  },
  targetValue: {
    type: Number,
    required: function() {
      return this.type !== 'custom';
    }
  },
  currentValue: {
    type: Number,
    default: 0
  },
  targetDate: {
    type: Date,
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  isGroupGoal: {
    type: Boolean,
    default: false
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Goal', GoalSchema);