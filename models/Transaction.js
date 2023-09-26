const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  pubkey: {
    type: String,
    required: true,
  },
  recipient: {
    type: String,
  },
  amount: {
    type: Number,
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
});

module.exports = Transaction = mongoose.model("Transaction", TransactionSchema);
