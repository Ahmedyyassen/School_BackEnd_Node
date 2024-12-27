const { validationResult } = require('express-validator');
const courseModel = require('../models/course.model');
const httpStatus = require('../utils/httpStatusText');
const asyncWrapper = require('../middlewares/asyncWrapper');
const appError = require('../utils/AppError')
const getCourses = asyncWrapper( async (req, res) => {
        const query = req.query;
        const limit = query.limit || 10;
        const page = req.query.page || 1;
        const skip = (page -1)*limit;
        const courses = await courseModel.find({},{"__v": false }).limit(limit).skip(skip);
        res.status(200).json({status: httpStatus.SUCCESS , data: {courses}});
});
                    // 1
const getCourse = asyncWrapper(
        async (req, res, next) => {
            const course = await courseModel.findById(req.params.id, {"__v": false });
            if(!course) {
                const error = appError.create('Course not found',404,httpStatus.FAIL )
                return next(error);
            }
            return res.status(200).json({status: httpStatus.SUCCESS , data: {course}});
    }
)

const postCourses = asyncWrapper( async (req, res, next) => {
         const errors = validationResult(req);
         if (!errors.isEmpty()) {
            const error = appError.create(errors.array(),400,httpStatus.FAIL);
             return next(error);
         }
             const course = new courseModeerrorl(req.body);
             await course.save();
             res.status(201).json({ status: httpStatus.SUCCESS, data: {course}} );
})


const updateCourse = asyncWrapper( async (req, res) => {
        const courseId = req.params.id
        const updatedCourse = await courseModel.updateOne({_id: courseId}, {$set: {...req.body}});
        res.status(200).json({status: httpStatus.SUCCESS, data: {updatedCourse}});
})

const deleteCourse = asyncWrapper( async (req, res,next) => {
        const course = await courseModel.findByIdAndDelete(req.params.id);
        if(!course){
            const error = appError.create('Course not found',404, httpStatus.FAIL )
            return next(error);
        }
       res.status(200).json({status: httpStatus.SUCCESS, data: null});
})

module.exports = {getCourses, postCourses, getCourse, updateCourse, deleteCourse};