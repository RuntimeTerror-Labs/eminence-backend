const mongoose = require('mongoose');

const VoucherSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },

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

  message: {
    type: String,
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

module.exports = Voucher = mongoose.model('voucher', VoucherSchema);
