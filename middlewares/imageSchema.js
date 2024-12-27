const appError = require("../utils/AppError");
const httpStatus = require("../utils/httpStatusText");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const ext = file.mimetype.split("/")[1];
    const fileName = `${file.originalname}-${Date.now()}.${ext}`;
    cb(null, fileName);
  },
});
const fileFilter = (req, file, cb) => {
  const image = file.mimetype.split("/")[0];
  if (image == "image") {
    return cb(null, true);
  } else {
    const error = appError.create(
      "Only images are allowed",
      400,
      httpStatus.ERROR
    );
    return cb(error, false);
  }
};
const upload = multer({ storage: storage, fileFilter });

module.exports = upload;
