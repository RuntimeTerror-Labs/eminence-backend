const Chat = require('../models/chatModel');
const User = require('../models/User');

// const accessChat = async (req, res) => {
//   const { user1Id, user2Id } = req.body;

//   // Check if chat already exists between the two users
//   const existingChat = await Chat.findOne({
//     users: { $all: ['65140fc3c5840b1ef086d439', '6521136c79f90384bddff2e8'] },
//   });

//   if (existingChat) {
//     return res.status(200).json({ chat: existingChat });
//   }

//   // Create new chat between the two users
//   const newChat = new Chat({
//     users: ['65140fc3c5840b1ef086d439', '6521136c79f90384bddff2e8'],
//   });

//   await newChat.save();

//   return res.status(201).json({ chat: newChat });
// };

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
      chatName: 'sender',
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

module.exports = { accessChat, fetchChats };
