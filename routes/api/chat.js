const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');

const {
  accessChat,
  fetchChats,
  deleteChat,
} = require('../../controllers/chatControllers');

router.route('/').get(auth, fetchChats);
router.route('/').post(auth, accessChat);
router.route('/:chatId').delete(auth, deleteChat);

module.exports = router;
