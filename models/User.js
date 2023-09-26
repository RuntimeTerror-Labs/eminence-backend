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
  LastName: {
    type: String,
    required: true,
  },
  avatarId: {
    type: String,
    required: true,
  },
  contacts: {
    type: Array,
    required: true,
  },
});

module.exports = User = mongoose.model("user", UserSchema);
