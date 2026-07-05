const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
    required: true
  },
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  returnDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['Issued', 'Returned'],
    default: 'Issued'
  }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
