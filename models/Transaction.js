const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  recipient: {
    type: String,
  },

  sender: {
    type: String,
  },

  amount: {
    type: Number,
    required: true,
  },

  currency: {
    type: String,
    required: true,
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

module.exports = Transaction = mongoose.model("Transaction", TransactionSchema);
