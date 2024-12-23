const express = require('express');
const router = express.Router();
const controller = require('../Controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken');


const multer  = require('multer');
const appError = require('../utils/AppError');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        const ext = file.mimetype.split('/')[1];
        const fileName = `${file.originalname}-${Date.now()}.${ext}`;
        cb(null, fileName);
    }
});
const fileFilter = (req,file,cb) => {
    const imageType = file.mimetype.split('/')[0];
    if (imageType !== 'image') {
       return cb( appError.create('Only images are allowed', 400), false );
    } else {
      return cb(null, true);
    }
} 
const upload = multer({ storage: storage,
                         fileFilter });


// get all users
router.route('/').get(verifyToken, controller.getAllUsers);


// register
router.route('/register').post( upload.single('avatar'), controller.register);


// login
router.route('/login').post(controller.login);


module.exports = router;
