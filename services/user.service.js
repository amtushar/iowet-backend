
const userModel = require('../schemas/user/user.schema');
const venueModel = require('../schemas/venue/venue.schema')
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

        if (Array.isArray(fields.venueIDs) && fields.venueIDs.length > 0) {
            // Fetch all venues with matching venueIDs
            const venues = await venueModel.find({ venueID: { $in: fields.venueIDs } }, 'venueArena');

            // Combine all venueArena arrays
            const combinedVenueArenaIDs = venues
                .map(venue => venue.venueArena)
                .flat()
                .filter(Boolean); // to remove undefined/nulls

            // Update venueArenaIDs field in the user
            fields.venueArenaIDs = combinedVenueArenaIDs;
        }

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


// An Api for reading multiple users by filter and pagination
userService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_USERS, async (req, res) => {
    try {
        engine.generateDatabaseConnector(process.env.DATABASE_URL);

        let excludeRoles = [];

        if (req.user && req.user.userRole === "SuperAdmin") {
            excludeRoles = ["SuperAdmin"]; // Show BenefitPlusAdmin + VenueOwner
        } else if (req.user && req.user.userRole === "BenefitPlusAdmin") {
            excludeRoles = ["SuperAdmin", "BenefitPlusAdmin"]; // Show only VenueOwner
        } else {
            // For VenueOwner and others, exclude all roles (no one shown)
            excludeRoles = ["SuperAdmin", "BenefitPlusAdmin", "VenueOwner"];
        }

        let filter = req.body.filter || {};
        const page = req.body.page || 1;
        const limit = 10;
        const skip = limit * (page - 1);

        // if (req.body.country) {
        //     filter['country'] = req.body.country;
        // }
        // ✅ FIX: Handle country filter to include BenefitPlus Admin (empty country)

        if (req.body.country) {
            filter['$or'] = [
                { country: req.body.country }, // Specific country users
                { country: "" }, // BenefitPlus Admin (full access to all countries)
                { country: { $exists: false } } // Also handle if country field doesn't exist
            ];
        }

        // Add role filter
        filter.userRole = { $nin: excludeRoles };

        const totalCount = await userModel.countDocuments(filter);

        const output = await userModel.find(filter)
            .limit(req.body.limit || limit)
            .skip(skip)
            .sort({ 'createdAt': -1 });
        const stucturedResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'success');
        // Add totalCount to the structured response
        stucturedResponse.totalCount = totalCount;
        res.json(stucturedResponse);

    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }
})



userService.patch(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_USERS, async (req, res) => {
    try {
        const { filter, fields } = req.body;

        // Initialize database connection
        dataBaseConnection = await engine.generateDatabaseConnector(process.env.DATABASE_URL);

        // Fetch current user
        const currentUser = await userModel.findOne(filter);
        if (!currentUser) {
            const structuredResponse = engine.generateServiceResponse(null, req.method, 404, req.originalUrl, 'User not found.', 'User not found');
            return res.json(structuredResponse);
        }

        // Validate contact number (if changed)
        if (fields.contact && fields.contact !== currentUser.contact) {
            const existingContact = await userModel.findOne({ contact: fields.contact });
            if (existingContact) {
                const structuredResponse = engine.generateServiceResponse(null, req.method, 400, req.originalUrl, 'This number is already registered!', 'Contact Number In Use');
                return res.json(structuredResponse);
            }
        }

        // Merge venueIDs (if provided)
        if (Array.isArray(fields.venueIDs) && fields.venueIDs.length > 0) {
            // Merge and remove duplicates
            const existingVenueIDs = currentUser.venueIDs || [];
            const mergedVenueIDs = Array.from(new Set([...existingVenueIDs, ...fields.venueIDs]));

            // Fetch corresponding venueArena IDs
            const venues = await venueModel.find({ venueID: { $in: mergedVenueIDs } }, 'venueArena');

            const combinedVenueArenaIDs = venues
                .map(venue => venue.venueArena)
                .flat()
                .filter(Boolean); // removes nulls/undefined

            // Update fields to write to DB
            fields.venueIDs = mergedVenueIDs;
            fields.venueArenaIDs = combinedVenueArenaIDs;

        }
        else {
            if (!fields.venueIDs || (Array.isArray(fields.venueIDs)) && fields.venueIDs.length === 0) {
                delete fields.venueIDs;
                delete fields.venueArenaIDs;
            }
        }

        // Update the user with merged fields
        const output = await userModel.updateOne(filter, fields);
        const structuredResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'User has been updated successfully!', 'Update Successful');
        res.json(structuredResponse);

    } catch (error) {
        const structuredResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message, "Error!");
        res.json(structuredResponse);
    }
});


// This Api deletes multiple users based on filter
userService.delete(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_USERS, async (req, res) => {
    try {
        dataBaseConnection = engine.generateDatabaseConnector(process.env.DATABASE_URL);

        const output = await userModel.deleteMany(req.body.filter);
        const stucturedResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'success');
        res.json(stucturedResponse);

    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }
})



module.exports = userService;