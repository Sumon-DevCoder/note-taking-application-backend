const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

// CRITICAL REQUIREMENT: Strict indexing via schema.index
// Compound index on author and _id. 
// Optimized for a User listing their own notes sorted by latest (pagination/sorting).
noteSchema.index({ author: 1, _id: -1 });

module.exports = mongoose.model('Note', noteSchema);
