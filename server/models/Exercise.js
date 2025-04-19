const mongoose = require('mongoose');

const ExerciseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exerciseType: {
    type: String,
    required: true,
    trim: true
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  distance: {
    type: Number, // in km if applicable
    default: null
  },
  caloriesBurned: {
    type: Number,
    default: null
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Exercise', ExerciseSchema);