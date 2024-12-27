require('dotenv').config()
const jwt = require("jsonwebtoken");

module.exports = async (paylod, secretKey) => {
  const token = jwt.sign(
    paylod,
    secretKey,
    { expiresIn: "10m", }
  );
  return token;
};

        // generate JWT token       (payload,  secretKey)
        // to generate random key run ==> node. then ==> require('crypto').randomBytes(32).toString('hex')
