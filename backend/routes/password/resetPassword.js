
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const userInfo = require('../../models/UserInfo').UserInfo;
const { body, validationResult } = require('express-validator');
const generateOTP = require('./generateotp');
router.use(express.json());
const storedOTPs = {};

function cleanUpExpiredOTPs() {
  const now = Date.now();
  for (const email in storedOTPs) {
    if (storedOTPs[email].createdAt + 30 * 60 * 1000 < now) { // 30 minutes in milliseconds
      delete storedOTPs[email];
    }
  }
}
// Clean up expired OTPs every 30 minutes (1800000 milliseconds)
setInterval(cleanUpExpiredOTPs, 1800000);

// Modified /forgotpassword route
router.post('/forgotpassword', body('email').custom((value) => {
  // Check if the email ends with "@gmail.com"
  if (!value.endsWith('@gmail.com')) {
    throw new Error('Email must end with @gmail.com');
  }
  return true; // Return true if validation passes
}), async (req, res) => {
  let success = false;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success, errors: errors.array() });
  }
  try {
    const { email } = req.body;
    console.log(email)
    
      // Check if the user with the provided email exists in your database
      const user = await userInfo.findOne({ email });
      if (!user) {
        return res.status(400).json({ success: false, message: "User with this email does not exist" });
      }
      // Generate the reset password OTP
      generateOTP(email, 'Reset')
        .then(response => {
          // Store the OTP in your database or data structure
          const otp = response.otp
          storedOTPs[email] = otp; // Uncomment this line if you have 'storedOTPs' defined
          return res.status(200).json({ success: true, message: 'OTP sent successfully', otp });
        })
        .catch(error => {
          console.error('Error generating OTP:', error);
          return res.status(500).json({ success: false, message: 'Error generating OTP' });
        });
    
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error occurred" });
  }
});


router.post('/resetpassword', body('password', 'password should have a minimum length of 5').isLength({ min: 5 }), async (req, res) => {
  try {
    const { newPassword, otp } = req.body;
    console.log(newPassword,otp)
    const email = Object.keys(storedOTPs).find((key) => storedOTPs[key] === otp);
    // Verify the reset password OTP
    const storedOTP = storedOTPs[email];
    if (!storedOTP || storedOTP !== otp) {
      // OTP is incorrect or not found
      return res.status(400).json({ success: false, message: "Invalid OTP." });
    }
    // Update the user's password in the database
    console.log("hello")
    const user = await userInfo.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, message: "User with this email does not exist" });
    }
    console.log("hi")
    // Hash the new password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
    // Update the user's password with the hashed password
    user.password = hashedPassword;
    console.log(2)
    // Reset the verification status (if needed)
    console.log(user.save())
    await user.save();
    console.log(3)
    // Optionally, you can delete the OTP from the storedOTPs object after successful password reset
    delete storedOTPs[email];
    // Optionally, you can generate a new auth token and send it back to the client
console.log(2);
    return res.status(200).json({ success: true, message: "Password reset successful", });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Internal server error occurred" });
  }
});

module.exports = router;
