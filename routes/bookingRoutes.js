const express = require('express');
const { getUserBookings, getBookingById, createBooking, validateTicket } = require('../controllers/bookingsController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getUserBookings); // Get all bookings for logged-in user
router.get('/:id', protect, getBookingById); // Get a specific booking (User only)
router.post('/', protect, createBooking); // Book tickets for an event (User only)
router.get('/validate/:qr', validateTicket); // Validate a ticket using QR code (Bonus)

module.exports = router;