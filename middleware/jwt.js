"use strict";

const jwt = require('jsonwebtoken');
require("dotenv").config();

exports.generateJwtToken = async data => {
    try {
        const createToken = await jwt.sign(data, process.env.JWT_SECRET_KEY);
        return createToken;
    } catch (err) {
        throw err;
    }
}

exports.verifyJwtToken = async (req, res, next) => {
    try {
        const verifyToken = req.headers.authorization;
        const decode = jwt.verify(verifyToken, process.env.JWT_SECRET_KEY);
        req.tokenData = decode;
        next();
    } catch (err) {
        res.status(401).json({ error: 'Invalid token' });
    }
}