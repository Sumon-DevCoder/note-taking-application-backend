const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// CRITICAL REQUIREMENT: Strict indexing via schema.index
// Index on user field to support the $lookup stage in Aggregation Scenario 2
// Without this, the lookup would cause a full collection scan on the Posts collection.
postSchema.index({ user: 1 });

module.exports = mongoose.model('Post', postSchema);
