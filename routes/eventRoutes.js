const express = require('express');
const { getEvents, getEventById, createEvent, updateEvent, deleteEvent } = require('../controllers/eventsController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getEvents); // Get all events (optional filters for category & date)
router.get('/:id', getEventById); // Get a single event by ID
router.post('/', protect, admin, createEvent); // Create a new event (Admin only)
router.put('/:id', protect, admin, updateEvent); // Update an event (Admin only)
router.delete('/:id', protect, admin, deleteEvent); // Delete an event (Admin only)

module.exports = router;