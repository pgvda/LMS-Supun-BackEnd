require('dotenv').config();

module.exports = {
    port:process.env.PORT || 4000,
    secretKey: process.env.JWT_SECRET,
    mongoDbUrl: process.env.MONGO_URL
}