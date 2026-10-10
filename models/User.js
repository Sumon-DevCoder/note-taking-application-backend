const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  interests: {
    type: [String],
    default: []
  }
}, { timestamps: true });

// CRITICAL REQUIREMENT: Strict indexing via schema.index
// 1. Index on email for fast authentication / login lookups (and unique constraint)
userSchema.index({ email: 1 }, { unique: true });

// 2. Index on role to optimize Admin queries (e.g., list all users, filter by role)
userSchema.index({ role: 1 });

// 3. Index on interests to optimize Aggregation Scenario 1 (Group by Interests)
userSchema.index({ interests: 1 });

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to match password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
