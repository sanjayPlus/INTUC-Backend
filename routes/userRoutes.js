const express = require('express');
const router = express.Router();

const userController = require('../controllers/userController');
const userAuth = require('../middleware/userAuth');

router.get('/protected', userAuth, userController.protected);
router.get('/details', userAuth, userController.details);
router.get('/gallery', userController.getGallery);
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


//update
router.put('/update', userAuth, userController.update);

//delete

router.delete('/delete', userAuth, userController.deleteUser);

module.exports = router;