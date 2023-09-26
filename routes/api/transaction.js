const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../../models/User");
const Transaction = require("../../models/Transaction");

router.post("/create/send", auth, async (req, res) => {
  const pubkey = req.pubkey;

  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: "Please provide a pubkey" });
  }

  const { txId, recipient, amount, type, swappedAmount } = req.body;

  // Check for txId
  if (!txId) {
    return res.status(400).json({ error: "Please provide a txId" });
  }

  // Check for amount
  if (!amount) {
    return res.status(400).json({ error: "Please provide an amount" });
  }

  try {
    if (await Transaction.findOne({ txId })) {
      return res.status(400).json({ error: "Transaction already exists" });
    }

    let isSwap = false;
    let isPrivate = false;
    let isVoucher = false;

    if (type === "swap") {
      isSwap = true;

      if (!swappedAmount) {
        return res
          .status(400)
          .json({ error: "Please provide a swappedAmount" });
      }
    }

    if (type === "private") {
      isPrivate = true;
    }

    if (type === "voucher") {
      isVoucher = true;
    }

    const newTransaction = new Transaction({
      txId,
      sender: pubkey,
      recipient,
      amount,
      isSwap,
      isPrivate,
      isVoucher,
      swappedAmount,
    });

    const transaction = await newTransaction.save();

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/get", auth, async (req, res) => {
  const pubkey = req.pubkey;

  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: "Please provide a pubkey" });
  }

  try {
    const transactions = await Transaction.find({
      $or: [{ sender: pubkey }, { recipient: pubkey }],
    });

    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.get("/get/:id", async (req, res) => {
  const txId = req.params.id;

  // Check for txId
  if (!txId) {
    return res.status(400).json({ error: "Please provide a txId" });
  }

  try {
    const transaction = await Transaction.findOne({ txId });

    if (!transaction) {
      return res.status(400).json({ error: "Transaction does not exist" });
    }

    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
