const User = require("../models/User");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Gallery = require("../models/Galley");
const { sendMail } = require("./emailController");
const { createCanvas, loadImage } = require('canvas');
const qr = require('qrcode');
const fs = require('fs');

const jwtSecret = process.env.JWT_SECRET;
const register = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const {
      name,
      email,
      password,
      phoneNumber,
      whatsappNumber,
      age,
      date_of_birth,
      block,
      constituency,
      union,
      addaar,
      pan_card,
    } = req.body;

    // // Step 2: Validate User Input
    // if (!name || !email || !password || !phoneNumber || !whatsappNumber || !age || !date_of_birth || !block || !constituency || !union ) {
    //   return res.status(400).json({ error: "Please provide all required fields." });
    // }

    // // Validate email format
    // const emailRegex = /^\S+@\S+\.\S+$/;
    // if (!emailRegex.test(email)) {
    //   return res.status(400).json({ error: "Invalid email format." });
    // }
    console.log(req.body)

    // Validate password strength (add your own criteria)
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long." });
    }

    // Step 3: Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);
    //find age from date o birth 
    const newAge = new Date().getFullYear() - new Date(date_of_birth).getFullYear();
    // Step 4: Create User
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      whatsappNumber: whatsappNumber || phoneNumber,
      age: newAge,
      date_of_birth,
      block,
      constituency,
      union,
      addaar,
      pan_card,
    });
    const savedUser = await newUser.save();

    // Step 5: Generate JWT
    const token = jwt.sign({ userId: savedUser._id }, jwtSecret, {
      expiresIn: "1h",
    });

    // Step 6: Send Response
    res.json({
      token,
      user: { id: savedUser._id, name: savedUser.name },
    });
  } catch (error) {
    console.error("Error registering user:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


const login = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const { email, password } = req.body;

    // Step 2: Validate User Input
    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "Please provide both email and password." });
    }

    // Step 3: Find User by Email
    const user = await User.findOne({ email });

    // Step 4: Verify User and Password
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    // Step 5: Generate JWT
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });

    // Step 6: Send Response
    res.json({ token, user: { id: user._id, name: user.name } });
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const protected = async (req, res) => {
  try {
    if (req.user) {
      res.status(200).json({ message: "You are authorized" });
    } else {
      res.status(401).json({ message: "You are not authorized" });
    }
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const details = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const update = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phoneNumber,
      whatsappNumber,
      age,
      date_of_birth,
      block,
      constituency,
      union, // Change "Union" to "union" if needed
      addaar,
      pan_card,
    } = req.body;

    const user = await User.findById(req.user.userId);

    // If fields exist, update them
    if (name) {
      user.name = name;
    }
    if (email) {
      user.email = email;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // Update additional fields
    if (phoneNumber) {
      user.phoneNumber = phoneNumber;
    }
    if (whatsappNumber) {
      user.whatsappNumber = whatsappNumber;
    }
    if (age) {
      user.age = age;
    }
    if (date_of_birth) {
      user.date_of_birth = date_of_birth;
    }
    if (block) {
      user.block = block;
    }
    if (constituency) {
      user.constituency = constituency;
    }
    if (union) {
      user.union = union;
    }
    if (addaar) {
      user.addaar = addaar;
    }
    if (pan_card) {
      user.pan_card = pan_card;
    }

    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during update:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findOneAndDelete(req.user.userId);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const sendOTP = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const { email } = req.body;

    // Step 2: Validate User Input
    if (!email) {
      return res.status(400).json({ error: 'Please provide email.' });
    }

    // Step 3: Find User by Email
    const user = await User.findOne({ email: email });

    // Step 4: Check if the user is already verified
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (user.verified) {
      return res.status(400).json({ error: 'User already verified' });
    }

    // Step 5: Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Step 6: Send OTP to email
    sendMail(
      email,
      'OTP Verification',
      `Your OTP is: ${otp}`,
      `<h1>Your OTP is: ${otp}</h1>`
    )
      .then(async (result) => {
        console.log(result);

        // Step 7: Save OTP to the database
        user.otp = otp;
        await user.save();

        // Step 8: Send Response
        res.status(200).json({ message: 'OTP sent successfully' });
      })
      .catch((error) => {
        console.error('Error sending OTP:', error.message);
        res.status(400).json({ message: 'OTP failed' });
      });
  } catch (error) {
    console.error('Error during OTP generation:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
const verifyOTP = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const { email, otp } = req.body;

    // Step 2: Validate User Input
    if (!email || !otp) {
      return res
        .status(400)
        .json({ error: 'Please provide both email and OTP.' });
    }

    // Step 3: Find User by Email
    const user = await User.findOne({ email: email });

    // Step 4: Verify User and OTP
    if (!user && otp !== user.otp) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
   
    // Step 5: Update verified field
    user.verified = true;
    await user.save();
    //send jwt token 
    const token = jwt.sign({ userId: user._id }, jwtSecret, {
      expiresIn: "1h",
    });
    // Step 6: Send Response
    res.status(200).json({ message: 'OTP verified successfully' ,token:token});
  } catch (error) {
    console.error('Error during OTP verification:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.status(200).json(gallery);
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
const addLikeToImage = async (req, res) => {
  try {
    const { imageId } = req.body;
    const user = await User.findById(req.user.userId);
    if (user.gallery_likes.includes(imageId)) {
      return res.status(400).json({ error: "Already liked" });
    }
    user.gallery_likes.push(imageId);
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const removeLikeFromImage = async (req, res) => {
  try {
    const { imageId } = req.body;
    const user = await User.findById(req.user.userId);
    if (!user.gallery_likes.includes(imageId)) {
      return res.status(400).json({ error: "Not liked" });
    }
    user.gallery_likes = user.gallery_likes.filter(
      (image) => image !== imageId
    );
    await user.save();
    res.status(200).json(user);
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const getGalleryLikes = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId);
    const gallery = await Gallery.find();
    const gallery_likes = gallery.filter((image) =>
      user.gallery_likes.includes(image._id)
    );
    res.status(200).json(gallery_likes);
  } catch (error) {
    console.error("Error during login:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
const resetPassword = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const { password } = req.body;

    // Step 2: Validate User Input
    if (!password) {
      return res
        .status(400)
        .json({ error: 'Please provide password.' });
    }

    // Step 3: Find User by Email
    const user = await User.findById(req.user.userId);

    // Step 4: Verify User and Password
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Step 5: Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 6: Update password
    user.password = hashedPassword;
    await user.save();

    // Step 7: Send Response
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error during password reset:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
const forgotPassword = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const { email } = req.body;

    // Step 2: Validate User Input
    if (!email) {
      return res.status(400).json({ error: 'Please provide email.' });
    }

    // Step 3: Find User by Email
    const user = await User.findOne({ email: email });

    // Step 4: Check if the user is already verified
    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    // Step 5: Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000);

    // Step 6: Send OTP to email
    sendMail(
      email,
      'OTP Verification',
      `Your OTP is: ${otp}`,
      `<h1>Your OTP is: ${otp}</h1>`
    )
      .then(async (result) => {
        console.log(result);

        // Step 7: Save OTP to the database
        user.forgot_otp = otp;
        await user.save();

        // Step 8: Send Response
        res.status(200).json({ message: 'OTP sent successfully' });
      })
      .catch((error) => {
        console.error('Error sending OTP:', error.message);
        res.status(400).json({ message: 'OTP failed' });
      });
  } catch (error) {
    console.error('Error during OTP generation:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
const verifyForgotPasswordOTP = async (req, res) => {
  try {
    // Step 1: Receive User Data
    const { email, otp } = req.body;

    // Step 2: Validate User Input
    if (!email || !otp) {
      return res
        .status(400)
        .json({ error: 'Please provide both email and OTP.' });
    }

    // Step 3: Find User by Email
    const user = await User.findOne({ email: email });

    // Step 4: Verify User and OTP
    if (!user && otp !== user.forgot_otp) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
       // Step 5: Generate JWT
       const token = jwt.sign({ userId: user._id }, jwtSecret, {
        expiresIn: "1h",
      });
    // Step 5: Send Response
    res.status(200).json({token:token});
  } catch (error) {
    console.error('Error during OTP verification:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
const createIdCard = async (req, res) => {
  try {
    // Assuming you have a User model defined using Mongoose
    const user = await User.findById(req.user.userId);

    // Get the profile image from the request
    const profileImage = req.file;

    // Create a canvas for the ID card
    const canvas = createCanvas(400, 250); // Increased height for QR code and white background
    const ctx = canvas.getContext('2d');

    // Draw white background
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load the user's profile image
    const image = await loadImage(profileImage.path);
    ctx.drawImage(image, 10, 10, 80, 80);

    // Draw text fields on the canvas
    ctx.font = '16px Arial';
    ctx.fillStyle = 'black'; // Text color
    ctx.fillText(`Name: ${user.name}`, 100, 30);
    ctx.fillText(`Email: ${user.email}`, 100, 60);
    ctx.fillText(`Phone: ${user.phoneNumber}`, 100, 90);
    ctx.fillText(`DOB: ${user.date_of_birth}`, 100, 120);

    // Generate QR code with user ID
    const qrCodeDataUrl = await qr.toDataURL(user._id.toString());
    const qrCodeImage = await loadImage(qrCodeDataUrl);
    ctx.drawImage(qrCodeImage, 10, 150, 80, 80); // Adjusted position for QR code

    // Convert the canvas to a buffer
    const buffer = canvas.toBuffer();

    // Set the response headers for image download
    res.set({
      'Content-Type': 'image/png',
      'Content-Disposition': 'attachment; filename=id-card.png',
    });

    // Send the buffer as the response
    res.status(200).send(buffer);
  } catch (error) {
    console.error("Error during ID card generation:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
module.exports = {
  register,
  login,
  protected,
  details,
  update,
  deleteUser,
  getGallery,
  sendOTP,
  verifyOTP,
  addLikeToImage,
  removeLikeFromImage,
  getGalleryLikes,
  resetPassword,
  forgotPassword,
  verifyForgotPasswordOTP,
  createIdCard
};
