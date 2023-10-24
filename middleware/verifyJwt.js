const jwt = require('jsonwebtoken');

require('dotenv').config();


function verifyJWT(req, res, next) {
    const authorizationHeader = req.headers.authorization;

    if (!authorizationHeader) {
        return res.status(401).json({ msg: 'NO authorizationHeader' });
    }

    const [bearer, token] = authorizationHeader.split(" ");

    if (!token) {
        return res.status(401).json({ msg: 'No Token' });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_SECRET_TOKEN);
        req.user = decoded;
        console.log(decoded);

        next();
    } catch (error) {
        return res.status(500).json({ msg: 'error 500' });
    }
}

module.exports = verifyJWT;