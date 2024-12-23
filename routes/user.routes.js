const express = require('express');
const router = express.Router();
const controller = require('../Controllers/user.controller');
const verifyToken = require('../middlewares/verifyToken');

const userRoles = require('../utils/userRoles');
const allowedTo = require('../middlewares/allowedTo');

const upload = require('../middlewares/imageSchema')


// get all users
router.route('/').get(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), controller.getAllUsers);


// register
router.route('/register').post( upload.single('avatar'), controller.register);


// login
router.route('/login').post(controller.login);


module.exports = router;
