const mongoose = require('mongoose');
const crypto = require('crypto');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  goals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  }],
  inviteCode: {
    type: String,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique invite code before saving
GroupSchema.pre('save', function(next) {
  if (!this.inviteCode) {
    // Generate a random 6-character invite code
    this.inviteCode = crypto.randomBytes(3).toString('hex');
  }
  next();
});

module.exports = mongoose.model('Group', GroupSchema);