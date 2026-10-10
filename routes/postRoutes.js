const express = require('express');
const router = express.Router();
const { createPost } = require('../controllers/postController');
const { protect } = require('../middlewares/authMiddleware');

// Create post for testing the lookup
router.post('/', protect, createPost);

module.exports = router;
