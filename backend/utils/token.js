const jwt = require("jsonwebtoken");

const createNewToken = (payload) => {
    if (!process.env.JWT_SECRET) {
        throw new Error('JWT_SECRET is not defined in environment variables');
    }
    return jwt.sign({ userId: payload }, process.env.JWT_SECRET, { expiresIn: '10d' });
}

module.exports = { createNewToken }