require('dotenv').config();
const jwt = require("jsonwebtoken");

module.exports = async (paylod) => {
  const token = jwt.sign(
    paylod,
    process.env.JWT_SECRET_KEY,
    { expiresIn: "10m", }
  );
  return token;
};

        // generate JWT token       (payload,  secretKey)
        // to generate random key run ==> node. then ==> require('crypto').randomBytes(32).toString('hex')
