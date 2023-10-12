const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['text', 'payment', 'confirm'],
      default: 'text',
    },

    sender: {
      type: String,
      ref: 'User',
    },

    content: {
      type: String,
      trim: true,
    },

    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Chat',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = Message = mongoose.model('Message', MessageSchema);
