const mongoose = require('mongoose');
const User = require('../models/User');
const Post = require('../models/Post');

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
const createPost = async (req, res) => {
  try {
    const { title, content } = req.body;
    const post = await Post.create({
      title,
      content,
      user: req.user._id,
    });
    res.status(201).json({ success: true, data: post });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Scenario 2: User Posts ($lookup)
// @route   GET /api/users/:id/posts
// @access  Public
// @constraint Use a single aggregation pipeline with a $lookup stage.
const getUserPosts = async (req, res) => {
  try {
    const userId = req.params.id;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid User ID' });
    }

    const result = await User.aggregate([
      // Stage 1: Match the specific user by ID
      { $match: { _id: new mongoose.Types.ObjectId(userId) } },
      
      // Stage 2: Lookup posts from the 'posts' collection
      {
        $lookup: {
          from: 'posts', // The collection name in MongoDB (usually pluralized lowercase of model name)
          localField: '_id',
          foreignField: 'user',
          as: 'userPosts' // The new array field containing the user's posts
        }
      },
      
      // Stage 3: Project the required fields (hiding password and unnecessary data)
      {
        $project: {
          password: 0,
          role: 0,
          createdAt: 0,
          updatedAt: 0,
          __v: 0,
          'userPosts.user': 0, // No need to repeat user ID in each post
          'userPosts.__v': 0
        }
      }
    ]);

    if (!result || result.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ success: true, data: result[0] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPost,
  getUserPosts,
};
