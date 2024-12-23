const controler = require('../Controllers/course.controller');
const courseSchema = require('../middlewares/course.schema')


const express = require('express');
const verifyToken = require('../middlewares/verifyToken');
const userRoles = require('../utils/userRoles');
const allowedTo = require('../middlewares/allowedTo');

const router = express.Router();


router.route('/').get(controler.getCourses)
                 .post(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), courseSchema(), controler.postCourses);

router.route('/:id').get(controler.getCourse)
                   .patch(allowedTo(userRoles.ADMIN, userRoles.MANGER),  controler.updateCourse)
                   .delete(verifyToken, allowedTo(userRoles.ADMIN, userRoles.MANGER), controler.deleteCourse)

module.exports = router;