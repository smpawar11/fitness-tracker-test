const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  realName: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
  },
  password: {
    type: String,
    required: true
  },
  physicalDetails: {
    height: { type: Number }, // in cm
    weight: { type: Number }, // in kg
    age: { type: Number },
    gender: { type: String, enum: ['male', 'female', 'other'] }
  },
  weightHistory: [{
    weight: { type: Number },
    date: { type: Date, default: Date.now }
  }],
  goals: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Goal'
  }],
  groups: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check if password matches
UserSchema.methods.comparePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

// Calculate BMI
UserSchema.methods.calculateBMI = function() {
  if (!this.physicalDetails.height || !this.physicalDetails.weight) return null;
  
  // Height in meters (convert from cm)
  const heightInM = this.physicalDetails.height / 100;
  return this.physicalDetails.weight / (heightInM * heightInM);
};

module.exports = mongoose.model('User', UserSchema);