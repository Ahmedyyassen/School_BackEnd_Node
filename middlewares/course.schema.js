const { body } = require('express-validator')

const courseSchema = () => {
    return [
        body('name').notEmpty().withMessage('this feild is required').isLength({ min: 3, max: 50 }),
        body('price').notEmpty().withMessage('this feild is required').isNumeric().withMessage('must be a number'),
    ]
}

module.exports = courseSchema;