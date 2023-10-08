const express = require('express');
const router = express.Router();

const auth = require('../../middleware/auth');

const { accessChat, fetchChats } = require('../../controllers/chatControllers');

router.route('/').get(auth, fetchChats);
router.route('/').post(auth, accessChat);

module.exports = router;
