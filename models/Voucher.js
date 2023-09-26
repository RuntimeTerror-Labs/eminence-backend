const mongoose = require("mongoose");

const VoucherSchema = new mongoose.Schema({
  pubkey: {
    type: String,
    required: true,
  },
  voucherId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  isClaimed: {
    type: Boolean,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  cardColor: {
    type: String,
    required: true,
  },
});

module.exports = Voucher = mongoose.model("voucher", VoucherSchema);
