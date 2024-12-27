const appError = require("../utils/AppError");
const httpStatus = require("../utils/httpStatusText");

module.exports = (...role) => {
  return (req, res, next) => {
    if (!role.includes(req.currentUser.role)) {
      const error = appError.create(
        "This role is not authorized",
        401,
        httpStatus.UNAUTHORIZED
      );
      return next(error);
    }
    next();
  };
};
