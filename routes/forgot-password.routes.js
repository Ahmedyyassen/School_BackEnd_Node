const express = require('express');
const router = express.Router();
const controller = require('../Controllers/forgot-password.controller')


router.route('/forgot-password').get( controller.forgotPassword )
                                .post( controller.sendForgotPasswordLink)


router.route('/reset-password/:userId/:token').get( controller.getResetPasswordView )
                                            .post( controller.resetPassword)

module.exports = router;