const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema({
  recipient: {
    type: String,
  },

  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

  sentAmount: {
    type: Number,
  },

  receivedAmount: {
    type: Number,
  },

  date: {
    type: Date,
    default: Date.now(),
  },

  txId: {
    type: String,
    required: true,
  },

  isSwap: {
    type: Boolean,
    required: true,
  },

  isPrivate: {
    type: Boolean,
    required: true,
  },

  isVoucher: {
    type: Boolean,
    required: true,
  },

  swappedAmount: {
    type: Number,
  },
});

module.exports = Transaction = mongoose.model('Transaction', TransactionSchema);
