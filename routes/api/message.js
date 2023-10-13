const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const {
  sendMessage,
  fetchMessages,
  deleteMessages,
} = require('../../controllers/messageControllers');

router.route('/:chatId').get(auth, fetchMessages);
router.route('/').post(auth, sendMessage);
router.route('/:chatId').delete(auth, deleteMessages);

module.exports = router;
