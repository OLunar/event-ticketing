const Booking = require('../models/Booking');
const Event = require('../models/Event');
const QRCode = require('qrcode');

// Create a booking (User only)
exports.createBooking = async (req, res) => {
  try {
    const { event: eventId, quantity } = req.body;
    const event = await Event.findById(eventId);

    if (!event) return res.status(404).json({ error: 'Event not found' });
    if (event.bookedSeats + quantity > event.seatCapacity) {
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    // Generate QR code (Bonus)
    const qrCodeData = await QRCode.toDataURL(`${req.user.id}-${eventId}-${Date.now()}`);

    const booking = await Booking.create({
      user: req.user.id,
      event: eventId,
      quantity,
      qrCode: qrCodeData,
    });

    // Update event bookedSeats
    event.bookedSeats += quantity;
    await event.save();

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Error booking event' });
  }
};

// Get all bookings for the logged-in user
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.id }).populate('event', 'title date venue');
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bookings' });
  }
};

// Get a specific booking (Only for logged-in user)
exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('event', 'title date venue');
    if (!booking || booking.user.toString() !== req.user.id) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(booking);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching booking details' });
  }
};

// Validate a ticket via QR code (Bonus)
exports.validateTicket = async (req, res) => {
  try {
    const qrParam = req.params.qr;
    const booking = await Booking.findOne({ qrCode: qrParam }).populate('event', 'title date venue');

    if (!booking) return res.status(404).json({ error: 'Invalid QR Code' });

    res.json({ message: 'Ticket is valid', booking });
  } catch (error) {
    res.status(500).json({ error: 'Error validating ticket' });
  }
};