const mongoose = require('mongoose');

const DietSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  foodName: {
    type: String,
    required: true,
    trim: true
  },
  calories: {
    type: Number,
    required: true
  },
  mealType: {
    type: String,
    required: true,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  customFood: {
    type: Boolean,
    default: false
  },
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Diet', DietSchema);