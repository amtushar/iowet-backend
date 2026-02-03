
const userModel = require('../schemas/user/user.schema');
const engine = require('../utils/engine.util');
const endpoints = require('../utils/endpoints.util');
const express = require('express');
require('dotenv').config();
const userService = express.Router();

const bcrypt = require('bcrypt');
const SALT_ROUNDS = 10;

// This API is used for user registration or user creation.

userService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_USER, async (req, res) => {

    try {

        dataBaseConnection = await engine.generateDatabaseConnector(process.env.DATABASE_URL);
        let filter = {
            email: req.body.data.email,
            contact: req.body.data.contact
        }

        let fields = {
            venueIDs: req.body.data.venueIDs
        }

        const existingUser = await userModel.findOne({
            $or: [
                { email: req.body.data.email },
                { contact: req.body.data.contact }
            ]
        });

        if (existingUser && existingUser.email === filter.email) {
            const stucturedResponse = engine.generateServiceResponse(null, req.method, 409, req.originalUrl, "Email already in use", "Email Already Exists");
            return res.json(stucturedResponse);
        }

        else if (existingUser && existingUser.contact === filter.contact) {
            const stucturedResponse = engine.generateServiceResponse(null, req.method, 409, req.originalUrl, "Contact number already in use", "Contact Already Exists");
            return res.json(stucturedResponse);
        }

        // Hash the password using bcrypt
        const hashedPassword = await bcrypt.hash(req.body.data.password, SALT_ROUNDS);

        // Create user data with hashed password
        const newUser = {
            ...req.body.data,
            password: hashedPassword
        };
        const output = await userModel.create(newUser);

        // Update user details
        await userModel.updateOne(filter, fields);
        const stucturedResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'User has been registered successfully!', 'Success');
        res.json(stucturedResponse);
    }

    catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message, "Error!");
        res.json(stucturedResponse);
    }

})




module.exports = userService;