const jwt = require("jsonwebtoken");

/* const encodeJWT = async (payload) =>
  jwt.sign(payload, process.env.APP_SECRET, { expiresIn: "24h" }); */

const encodeJWT = async (payload) => {
  try {
    return jwt.sign(payload, process.env.APP_SECRET, { expiresIn: "24h" });
  } catch (error) {
    console.error("Error generating token:", error);
    throw new Error("Token generation failed");
  }
};

/* const decodeJWT = async (token) => jwt.verify(token, process.env.APP_SECRET); */

const decodeJWT = async (token) => {
  try {
    return jwt.verify(token, process.env.APP_SECRET);
  } catch (error) {
    console.error("Error verifying token:", error);
    throw new Error("Token verification failed");
  }
};
module.exports = { encodeJWT, decodeJWT };
