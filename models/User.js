const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  pubkey: {
    type: String,
    required: true,
  },

  chatPubkey: {
    type: String,
    required: true,
  },

  firstName: {
    type: String,
    required: true,
  },

  lastName: {
    type: String,
    required: true,
  },

  avatarId: {
    type: String,
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

  contacts: {
    type: Array,
    required: true,
  },
});

module.exports = User = mongoose.model("User", UserSchema);
