const express = require('express');
const router = express.Router();
const userInfo = require('../models/UserInfo').UserInfo;
const fetchuser = require('../middleware/fetchUser');
const isAdmin = require('../middleware/isAdmin');

router.get('/getuser/:userid', async (req, res) => {
  try {
    const userId = req.params.userid;
    // console.log(userId); // Logging the userId instead of urn
    const user = await userInfo.findOne({ _id: userId }); // Finding user by _id instead of userId
    // console.log(user);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    return res.status(200).json({ success: true, data: user });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});

router.get('/getallusers', fetchuser, isAdmin, async (req, res) => {
  try {
    // Fetch all users
    const users = await userInfo.find({}).select('-password');

    // Return the list of users
    return res.status(200).json({ success: true, data: users });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ success: false, message: 'Internal server error occurred' });
  }
});

module.exports = router;