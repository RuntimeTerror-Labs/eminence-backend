const mongoose = require('mongoose');

const ChatSchema = new mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
    },

    // users: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'User',
    //   },
    // ],
    users: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = Chat = mongoose.model('Chat', ChatSchema);
