const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  quantity: { type: Number, required: true },
  bookingDate: { type: Date, default: Date.now },
  qrCode: { type: String } // For storing ticket QR code (bonus feature)
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);