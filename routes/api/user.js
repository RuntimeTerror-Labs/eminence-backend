const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../../models/User");

//Route: POST api/user/create
//Description: Create user
//Access: Private
router.post("/create", auth, async (req, res) => {
  const { chatPubkey, firstName, lastName, avatarId, cardColor } = req.body;

  const pubkey = req.pubkey;
  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: "Please provide a pubkey" });
  }

  // Check for chatPubkey
  if (!chatPubkey) {
    return res.status(400).json({ error: "Please provide a chatPubkey" });
  }

  // Check for firstName
  if (!firstName) {
    return res.status(400).json({ error: "Please provide a firstName" });
  }

  // Check for lastName
  if (!lastName) {
    return res.status(400).json({ error: "Please provide a lastName" });
  }

  // Check for avatarId
  if (!avatarId) {
    return res.status(400).json({ error: "Please provide an avatarId" });
  }

  // Check for cardColor
  if (!cardColor) {
    return res.status(400).json({ error: "Please provide a cardColor" });
  }

  const contacts = [];

  try {
    if (await User.findOne({ pubkey })) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({
      pubkey,
      chatPubkey,
      firstName,
      lastName,
      avatarId,
      contacts,
      cardColor,
    });

    const user = await newUser.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Route: POST api/user/add/:pubkey
//Description: Add contact
//Access: Private
router.post("/add/:pubkey", auth, async (req, res) => {
  const pubkey = req.pubkey;

  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: "Please provide a pubkey" });
  }

  const contactPubkey = req.params.pubkey;

  // Check for contactPubkey
  if (!contactPubkey) {
    return res.status(400).json({ error: "Please provide a contactPubkey" });
  }

  try {
    const user = await User.findOne({ pubkey });

    const contactUser = await User.findOne({ pubkey: contactPubkey });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    if (!contactUser) {
      return res.status(400).json({ error: "Contact does not exist" });
    }

    if (user.contacts.includes(contactPubkey)) {
      return res.status(400).json({ error: "Contact already exists" });
    }

    user.contacts.push(contactPubkey);

    contactUser.contacts.push(pubkey);

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Route: POST api/user/remove/:pubkey
//Description: Remove contact
//Access: Private
router.delete("/remove/:pubkey", auth, async (req, res) => {
  const pubkey = req.pubkey;

  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: "Please provide a pubkey" });
  }

  const contactPubkey = req.params.pubkey;

  // Check for contactPubkey
  if (!contactPubkey) {
    return res.status(400).json({ error: "Please provide a contactPubkey" });
  }

  try {
    const user = await User.findOne({ pubkey });

    const contactUser = await User.findOne({ pubkey: contactPubkey });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    if (!contactUser) {
      return res.status(400).json({ error: "Contact does not exist" });
    }

    if (!user.contacts.includes(contactPubkey)) {
      return res.status(400).json({ error: "Contact does not exist" });
    }

    user.contacts = user.contacts.filter(
      (contact) => contact !== contactPubkey
    );

    await user.save();

    contactUser.contacts = contactUser.contacts.filter(
      (contact) => contact !== pubkey
    );

    await contactUser.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Route: GET api/user/contacts
//Description: Get contacts
//Access: Private
router.get("/contacts", auth, async (req, res) => {
  const pubkey = req.pubkey;

  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: "Please provide a pubkey" });
  }

  try {
    const user = await User.findOne({ pubkey });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const contacts = user.contacts;

    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Route: GET api/user/info
//Description: Get user info
//Access: Private
router.get("/info", auth, async (req, res) => {
  const pubkey = req.pubkey;

  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: "Please provide a pubkey" });
  }

  try {
    const user = await User.findOne({ pubkey });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Route: GET api/user/info/:pubkey
//Description: Get user info
//Access: Public
router.get("/info/:pubkey", async (req, res) => {
  const pubkey = req.params.pubkey;

  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: "Please provide a pubkey" });
  }

  try {
    const user = await User.findOne({ pubkey });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    const { chatPubkey, firstName, lastName, avatarId, cardColor } = user;

    res.json({ pubkey, chatPubkey, firstName, lastName, avatarId, cardColor });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Route: GET api/user/info/:name
//Description: Get user info
//Access: Public
router.get("/:name", auth, async (req, res) => {
  const name = req.params.name;
  const pubkey = req.pubkey;

  // Check for name
  if (!name) {
    return res.status(400).json({ error: "Please provide a name" });
  }

  try {
    const users = await User.find(
      {
        $or: [
          { firstName: { $regex: `^${name}`, $options: "i" } },
          { lastName: { $regex: `^${name}`, $options: "i" } },
        ],
      },
      { firstName: 1, lastName: 1, avatarId: 1, pubkey: 1, _id: 1 }
    );

    if (!users || users.length === 0) {
      return res.status(400).json({ error: "No users found" });
    }

    const filterUser = users.filter((user) => user.pubkey !== pubkey);

    res.json(filterUser);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Route: POST api/user/update
//Description: Update user
//Access: Private
router.post("/update", auth, async (req, res) => {
  const pubkey = req.pubkey;

  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: "Please provide a pubkey" });
  }

  const { firstName, lastName, avatarId } = req.body;

  // Check for firstName
  if (!firstName) {
    return res.status(400).json({ error: "Please provide a firstName" });
  }

  // Check for lastName
  if (!lastName) {
    return res.status(400).json({ error: "Please provide a lastName" });
  }

  // Check for avatarId
  if (!avatarId) {
    return res.status(400).json({ error: "Please provide an avatarId" });
  }

  try {
    const user = await User.findOne({ pubkey });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    user.firstName = firstName;
    user.lastName = lastName;
    user.avatarId = avatarId;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

//Route: POST api/user/cardcolor
//Description: Update cardColor
//Access: Private
router.post("/update/cardcolor", auth, async (req, res) => {
  const pubkey = req.pubkey;

  // Check for pubkey
  if (!pubkey) {
    return res.status(400).json({ error: "Please provide a pubkey" });
  }

  const { cardColor } = req.body;

  // Check for cardColor
  if (!cardColor) {
    return res.status(400).json({ error: "Please provide a cardColor" });
  }

  try {
    const user = await User.findOne({ pubkey });

    if (!user) {
      return res.status(400).json({ error: "User does not exist" });
    }

    user.cardColor = cardColor;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
