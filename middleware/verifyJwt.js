const jwt = require('jsonwebtoken');

require('dotenv').config();


 function verifyJWT(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    const [bearer, token] = authorizationHeader.split(" ");

    if (!token) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded; // Store the decoded user in the request object for later use
        console.log(decoded);

        next(); // Continue to the next middleware or route
    } catch (error) {
        return res.status(401).json({ msg: 'Unauthorized' });
    }
}

module.exports = verifyJWT;