const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const adminAuth = require("../middleware/adminAuth");
const multer = require("multer");
const GalleryStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // destination is used to specify the path of the directory in which the files have to be stored
      cb(null, "./public/galleryImage");
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
  const galleryImage = multer({
    storage: GalleryStorage,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB in bytes
    },
  });
const AdStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // destination is used to specify the path of the directory in which the files have to be stored
      cb(null, "./public/ADImage");
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
  const ADImage = multer({
    storage: AdStorage,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB in bytes
    },
  });
const OneStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // destination is used to specify the path of the directory in which the files have to be stored
      cb(null, "./public/OneImage");
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
  const OneImage = multer({
    storage: OneStorage,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB in bytes
    },
  });
const eventStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // destination is used to specify the path of the directory in which the files have to be stored
      cb(null, "./public/eventImage");
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
  const eventImage = multer({
    storage: eventStorage,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB in bytes
    },
  });
  const sloganStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // destination is used to specify the path of the directory in which the files have to be stored
      cb(null, "./public/sloganImage");
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
  const sloganImage = multer({
    storage: sloganStorage,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB in bytes
    },
  });
  const carouselStorage = multer.diskStorage({
    destination: function (req, file, cb) {
      // destination is used to specify the path of the directory in which the files have to be stored
      cb(null, "./public/carouselImage");
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
  const carouselImage = multer({
    storage: carouselStorage,
    limits: {
      fileSize: 20 * 1024 * 1024, // 20MB in bytes
    },
  });
router.post('/login',adminController.adminLogin);
// router.post('/register',adminController.adminRegister);
router.get('/user/:id',adminAuth,adminController.getUser);
router.get('/users',adminAuth,adminController.getAllUsers);    
router.get("/calendar-events/:date",adminController.getCalendarEvents)
router.get('/slogan',adminController.getSlogan);
router.get('/protected', adminAuth, adminController.protected);
router.get('/ad',adminController.getAd);
router.get('/mandalam',adminController.getMandalam);
router.get('/events',adminController.getEvents);
router.get('/feedback',adminAuth,adminController.getFeedBack);
router.get('/carousel',adminController.getCarousel);



router.post('/gallery',galleryImage.single('image'),adminAuth,adminController.addGallery);
router.post('/ad',ADImage.single('image'),adminAuth,adminController.addAd);
router.post('/calendar-event',adminAuth,adminController.addCalendarEvent)
router.post('/slogan',sloganImage.single('image'),adminController.addSlogan);
router.post('/one-signal',OneImage.single('image'),adminAuth,adminController.sendNotification)
router.post('/mandalam',adminController.addMandalam);
router.post('/event',eventImage.single('image'),adminAuth,adminController.addEvent);
router.post('/carousel',carouselImage.single('image'),adminAuth,adminController.addCarousel);



router.delete('/user/:id',adminAuth,adminController.deleteUser);
router.delete('/deleteImage/:id',adminAuth,adminController.deleteImage);
router.delete('/slogan/:id',adminAuth,adminController.deleteSlogan);
router.delete("/calendar-event/:id",adminAuth,adminController.deleteCalendarEvent);
router.delete("/ad/:id",adminAuth,adminController.deleteAd);
router.delete('/mandalam/:id',adminController.deleteMandalam);
router.delete('/event/:id',adminAuth,adminController.deleteEvent);
router.delete('/carousel/:id',adminAuth,adminController.deleteCarousel);

module.exports = router;
