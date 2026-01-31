const userModel = require('../schemas/user/user.schema');
const engine = require('../utils/engine.util');
const endpoints = require('../utils/endpoints.util');
const express = require('express');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const userLoginService = express.Router();

const bcrypt = require('bcrypt');


userLoginService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_USERS_LOGIN_TOKEN, async (req, res) => {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.json({ authenticated: false, reason: "notokenhere", token: req.cookies.token });
        }
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp && decoded.exp < currentTime) {
            return res.json({ authenticated: false, reason: 'token_expired' });
        }
        const user = await userModel.findOne({ userID: decoded._id });
        if (user) {
            return res.json({ authenticated: true, user: user });
        } else {
            return res.json({ authenticated: false, reason: 'nouser' });
        }
    } catch (error) {
        return res.json({ authenticated: false });
    }
});


userLoginService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_USERS_LOGIN, async (req, res) => {

    try {
        const email = req.body.email;
        const getPassword = req.body.password;

        // Validate input
        if (!email || !getPassword) {
            const structuredResponse = engine.generateServiceResponse(null, req.method, 400, req.originalUrl, 'Email and password are required');
            return res.status(400).json(structuredResponse);
        }

        // Connect to the database
        await engine.generateDatabaseConnector(process.env.DATABASE_URL);

        // Find user by email
        const user = await userModel.findOne({ email });

        if (!user || !user.userID) {
            const structuredResponse = engine.generateServiceResponse(null, req.method, 401, req.originalUrl, 'User Not Found!');
            return res.json(structuredResponse);
        }

        const isUserVerified = user.isVerified;
        if (!isUserVerified) {
            const structuredResponse = engine.generateServiceResponse(null, req.method, 401, req.originalUrl, 'User Not Verified!');
            return res.json(structuredResponse);
        }

        // Compare passwords
        const isPasswordMatch = await bcrypt.compare(getPassword, user.password);
        if (!isPasswordMatch) {
            const structuredResponse = engine.generateServiceResponse(null, req.method, 401, req.originalUrl, 'Password Not Matched!');
            return res.json(structuredResponse);
        }

        // Generate access token
        const accessToken = user.generateAccessToken(user.userID);

        // Remove sensitive fields before sending response
        const { password, isDeleted, isVerified, _id, createdAt, createdBy, deletedBy, updatedAt, __v, ...userData } = user.toObject();

        // Structured success response
        const structuredResponse = engine.generateServiceResponse(userData, req.method, 200, req.originalUrl, 'success');

        // Set the access token in a secure cookie 
        const isProduction = process.env.NODE_ENV === 'production';

        res.cookie('accessToken', accessToken, {
            maxAge: 60 * 60 * 24 * 7 * 1000,
            httpOnly: true,
            secure: isProduction, // ? This will be true in production
            sameSite: isProduction ? 'None' : 'Lax', // ? None in production
            domain: isProduction ? '.uatbenefitplus.com' : undefined // ? Domain in production
        }).json(structuredResponse);


    } catch (error) {
        const structuredResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.status(500).json(structuredResponse);
    }
});


// An Api for user Logout
userLoginService.get(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_USERS_LOGOUT, async (req, res) => {

    try {

        res.clearCookie('accessToken');
        const stucturedResponse = engine.generateServiceResponse(true, req.method, 200, req.originalUrl, 'logout successful');
        res.json(stucturedResponse);

    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }

})

module.exports = userLoginService; 
