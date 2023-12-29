const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const userAuth = require('../middleware/userAuth');
const multer = require("multer");

const CardStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // destination is used to specify the path of the directory in which the files have to be stored
      cb(null, "./public/cardImage");
    },
    filename: function (req, file, cb) {
      // It is the filename that is given to the saved file.
      const uniqueSuffix =Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
      console.log(`${uniqueSuffix}-${file.originalname}`);
      // console.log(file);
    },
  });
  
  // Configure storage engine instead of dest object.
  const CardImage = multer({
    storage: CardStorage,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB in bytes
    },
  });
  const ProfileStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // destination is used to specify the path of the directory in which the files have to be stored
      cb(null, "./public/profileImage");
    },
    filename: function (req, file, cb) {
      // It is the filename that is given to the saved file.
      const uniqueSuffix =Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}-${file.originalname}`);
      console.log(`${uniqueSuffix}-${file.originalname}`);
      // console.log(file);
    },
  });
  
  // Configure storage engine instead of dest object.
  const ProfileImage = multer({
    storage: ProfileStorage,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB in bytes
    },
  });

//get

router.get('/protected', userAuth, userController.protected);
router.get('/details', userAuth, userController.details);
router.get('/gallery', userController.getGallery);
router.get('/auto-login',userAuth,userController.autoLogin);

//get liked image list
router.get('/gallery-likes',userAuth,userController.getGalleryLikes);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/sendOTP',userController.sendOTP);
router.post('/verifyOTP',userController.verifyOTP);
router.post('/resetPassword',userAuth,userController.resetPassword);
router.post('/forgotPassword',userController.forgotPassword);
router.post('/verifyForgotOTP',userController.verifyForgotPasswordOTP);
router.post('/add-like-to-image',userAuth,userController.addLikeToImage);
router.post('/remove-like-from-image',userAuth,userController.removeLikeFromImage);
router.post('/create-id-card',CardImage.single('profileImage'),userAuth,userController.createIdCard);
router.post('/feedback',userAuth,userController.AddFeedBack);
router.post('/google-login',userController.googleLogin);
router.post('/add-vote',userAuth,userController.addVote);
router.post('/email-login',userController.emailLogin);
router.post('/profile-image',ProfileImage.single('profileImage'),userAuth,userController.updateProfileImage);
//update
router.put('/update', userAuth, userController.update);

//delete

router.delete('/delete', userAuth, userController.deleteUser);


module.exports = router;