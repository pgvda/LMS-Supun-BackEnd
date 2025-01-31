const jwt = require("jsonwebtoken");
const config = require('../config/config');

const authenticateToken = (req, res, next) => {
    try {
        const requestPath = req.originalUrl;

        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; 
        
        if (token == null) {
            
            if (!req.isAuthenticated) {
                return res.status(401).json({ message: "Token required" });
            }
        } else {
            jwt.verify(token, config.secretKey, (err, user) => {
                if (err) {
                    return res.sendStatus(403); 
                }
        
                req.user = user;
                next();
            });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error.message });
    }
}

module.exports = authenticateToken;
