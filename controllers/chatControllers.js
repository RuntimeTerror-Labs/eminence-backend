const Chat = require('../models/chatModel');
const User = require('../models/User');

const accessChat = async (req, res) => {
  const { userId } = req.body;
  const currentUser = req.pubkey;

  if (!userId) {
    console.log('UserId param not sent with request');
    return res.sendStatus(400);
  }

  var isChat = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: currentUser } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      users: [currentUser, userId],
    };

    try {
      const createdChat = await Chat.create(chatData);
      const FullChat = await Chat.findOne({ _id: createdChat._id });

      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
};

const fetchChats = async (req, res) => {
  const currentUser = req.pubkey;

  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: currentUser } },
    });

    res.status(200).json(chats);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
};

const deleteChat = async (req, res) => {
  const { chatId } = req.params;

  try {
    const chat = await Chat.findByIdAndDelete(chatId);

    if (!chat) {
      return res.status(404).json({ error: 'Chat not found' });
    }

    res.status(200).json({ message: 'Chat deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { accessChat, fetchChats, deleteChat };
