const jwt = require('jsonwebtoken');
const httpStatus = require('../utils/httpStatusText');
const appError = require('../utils/AppError');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['Authorization'] || req.headers['authorization'];
    if (!authHeader) {
        const error = appError.create('Token not provided', 401, httpStatus.UNAUTHORIZED);
        return next(error);
    }
     const token = authHeader.split(' ')[1];

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
        if (err) {
            const error = appError.create(err, 403, httpStatus.FORBIDDEN);
            return next(error);
        }
        req.currentUser = user;      
        next();
    })

    
        
}

module.exports = verifyToken;