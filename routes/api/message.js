const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');
const {
  sendMessage,
  fetchMessages,
} = require('../../controllers/messageControllers');

router.route('/').post(auth, sendMessage);
router.route('/:chatId').get(auth, fetchMessages);

module.exports = router;
