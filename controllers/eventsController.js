const Event = require('../models/Event');
const Booking = require('../models/Booking');

// Get all events with optional filtering by category and date
exports.getEvents = async (req, res) => {
  try {
    let query = {};
    const { category, date } = req.query;

    if (category) query.category = category;
    if (date) query.date = new Date(date);

    const events = await Event.find(query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching events' });
  }
};

// Get a single event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    res.json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching event details' });
  }
};

// Create a new event (Admin only)
exports.createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ error: 'Error creating event' });
  }
};

// Update an event (Admin only)
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    if (req.body.seatCapacity < event.bookedSeats) {
      return res.status(400).json({ error: 'seatCapacity cannot be less than bookedSeats' });
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedEvent);
  } catch (error) {
    res.status(500).json({ error: 'Error updating event' });
  }
};

// Delete an event (Admin only)
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ error: 'Event not found' });

    const hasBookings = await Booking.find({ event: event._id });
    if (hasBookings.length > 0) {
      return res.status(400).json({ error: 'Cannot delete event with existing bookings' });
    }

    await event.remove();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error deleting event' });
  }
};