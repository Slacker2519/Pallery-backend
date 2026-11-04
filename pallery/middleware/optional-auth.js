const jwt = require("jsonwebtoken");

const optionalAuth = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
        try {
            const payload = jwt.verify(authHeader.split(" ")[1], process.env.JWT_SECRET);
            req.user = { id: payload.id, name: payload.name };
        } catch (error) {
            // invalid or expired token: treat as a visitor
        }
    }
    next();
};

module.exports = optionalAuth;