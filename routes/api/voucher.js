const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
require('dotenv').config();
const jwt = require('jsonwebtoken');

const User = require('../../models/User');
const Voucher = require('../../models/Voucher');

//Route: POST api/voucher/create
//Description: Create voucher
//Access: Private
router.post('/create', auth, async (req, res) => {
  const pubkey = req.pubkey;

  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: 'Please provide a pubkey' });
  }

  const user = await User.findOne({ pubkey });

  // Check for user
  if (!user) {
    return res.status(400).json({ error: 'User does not exist' });
  }

  const { voucherId, amount, cardColor, message } = req.body;

  // Check for voucherId
  if (!voucherId) {
    return res.status(400).json({ error: 'Please provide a voucherId' });
  }

  // Check for voucherAmount
  if (!amount) {
    return res.status(400).json({ error: 'Please provide a voucherAmount' });
  }

  // Check for cardColor
  if (!cardColor) {
    return res.status(400).json({ error: 'Please provide a cardColor' });
  }

  try {
    if (await Voucher.findOne({ voucherId })) {
      return res.status(400).json({ error: 'Voucher already exists' });
    }

    const newVoucher = new Voucher({
      pubkey,
      voucherId,
      amount,
      cardColor,
      isClaimed: false,
      message,
    });

    const voucher = await newVoucher.save();

    res.json(voucher);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Route: GET api/voucher/get
//Description: Get vouchers
//Access: Private
router.get('/get', auth, async (req, res) => {
  const pubkey = req.pubkey;

  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: 'Please provide a pubkey' });
  }

  try {
    const vouchers = await Voucher.find({ pubkey });

    res.json(vouchers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Route: GET api/voucher/get/:id
//Description: Get voucher
//Access: Public
router.get('/get/:id', async (req, res) => {
  const voucherId = req.params.id;

  // Check for voucherId
  if (!voucherId) {
    return res.status(400).json({ error: 'Please provide a voucherId' });
  }

  try {
    const voucher = await Voucher.findOne({ voucherId });

    if (!voucher) {
      return res.status(400).json({ error: 'Voucher does not exist' });
    }

    res.json(voucher);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

//Route: POST api/voucher/claim/:id
//Description: Claim voucher
//Access: Private
router.post('/claim/:id', auth, async (req, res) => {
  const pubkey = req.pubkey;

  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: 'Please provide a pubkey' });
  }

  const voucherId = req.params.id;

  // Check for voucherId
  if (!voucherId) {
    return res.status(400).json({ error: 'Please provide a voucherId' });
  }

  try {
    const voucher = await Voucher.findOne({ voucherId });

    if (!voucher) {
      return res.status(400).json({ error: 'Voucher does not exist' });
    }

    if (voucher.isClaimed) {
      return res.status(400).json({ error: 'Voucher already claimed' });
    }

    voucher.isClaimed = true;

    const updatedVoucher = await voucher.save();

    res.json(updatedVoucher);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

module.exports = router;
