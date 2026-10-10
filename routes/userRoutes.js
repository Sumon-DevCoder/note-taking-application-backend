const express = require('express');
const router = express.Router();
const { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser, 
  getUsersByInterests 
} = require('../controllers/userController');
const { protect, admin } = require('../middlewares/authMiddleware');
const { getUserPosts } = require('../controllers/postController');

// Scenario 1: Aggregation for interests (Admin only)
router.get('/stats/interests', protect, admin, getUsersByInterests);

// Scenario 2: Aggregation for user posts with $lookup (Public or protected based on your need, making it public for easy testing)
router.get('/:id/posts', getUserPosts);

// Standard CRUD operations (Admin only)
router.route('/')
  .get(protect, admin, getUsers);

router.route('/:id')
  .get(protect, admin, getUserById)
  .put(protect, admin, updateUser)
  .delete(protect, admin, deleteUser);

module.exports = router;
