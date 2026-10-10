const Note = require('../models/Note');

// @desc    Create a new note
// @route   POST /api/notes
// @access  Private
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    const note = await Note.create({
      title,
      content,
      author: req.user._id,
    });

    res.status(201).json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all notes (with pagination)
// @route   GET /api/notes
// @access  Private
const getNotes = async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    let query = {};

    // If user is not admin, only fetch their own notes
    if (req.user.role !== 'admin') {
      query.author = req.user._id;
    }

    const notes = await Note.find(query)
      .populate('author', 'name email role')
      .sort({ _id: -1 }) // Utilize the index
      .skip(skip)
      .limit(limit);

    const total = await Note.countDocuments(query);

    res.json({
      success: true,
      count: notes.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: notes,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get note by ID
// @route   GET /api/notes/:id
// @access  Private
const getNoteById = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id).populate('author', 'name email role');

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if the user is authorized to view this note
    if (note.author._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this note' });
    }

    res.json({ success: true, data: note });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a note
// @route   PUT /api/notes/:id
// @access  Private
const updateNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if the user is authorized to update this note
    if (note.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this note' });
    }

    note.title = req.body.title || note.title;
    note.content = req.body.content || note.content;

    const updatedNote = await note.save();

    res.json({ success: true, data: updatedNote });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a note
// @route   DELETE /api/notes/:id
// @access  Private
const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }

    // Check if the user is authorized to delete this note
    if (note.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this note' });
    }

    await note.deleteOne();

    res.json({ success: true, message: 'Note removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
};
