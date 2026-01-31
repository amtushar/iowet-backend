
const venueModel = require('../schemas/venue/venue.schema');
const userModel = require('../schemas/user/user.schema');
const engine = require('../utils/engine.util');
require('dotenv').config();
const endpoints = require('../utils/endpoints.util');
const express = require('express');
const cacheService = require('../utils/redis/cache-service');
const venueFacilityModel = require('../schemas/venueFacility/venuefacility.schema');

const venueService = express.Router();


// This API is used for venue registration or venue creation.
venueService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_VENUE, async (req, res) => {
    const session = await venueModel.startSession();
    try {
        dataBaseConnection = await engine.generateDatabaseConnector(process.env.DATABASE_URL);

        const normalizedLocation = req.body.data.location.trim().toLowerCase();
        const nameEn = req.body.data.name.en.trim();
        const nameAr = req.body.data.name.ar.trim();
        const email = req.body.data.email.trim();

        req.body.data.location = normalizedLocation;

        // Check each field individually to find EXACT conflicts
        const conflicts = {};
        const existingVenues = await venueModel.find({
            $or: [
                { 'name.en': nameEn },
                { 'name.ar': nameAr },
                { email: email },
                { location: normalizedLocation }
            ]
        });

        if (existingVenues.length > 0) {
            // Check which specific fields conflict across all found venues
            for (const venue of existingVenues) {
                if (venue.name.en === nameEn) conflicts.nameEn = true;
                if (venue.name.ar === nameAr) conflicts.nameAr = true;
                if (venue.email === email) conflicts.email = true;
                if (venue.location === normalizedLocation) conflicts.location = true;
            }

            // Build error message
            const fieldMap = { nameEn: "English Name", nameAr: "Arabic Name", email: "Email", location: "Location" };
            const conflictingFields = Object.keys(conflicts).map(key => fieldMap[key]);
          
            const errorMessage = `${conflictingFields.join(', ')} already in use`;
            const stucturedResponse = engine.generateServiceResponse(
                { conflicts },
                req.method,
                409,
                req.originalUrl,
                errorMessage,
                'Venue Registration Failed'
            );
            return res.json(stucturedResponse);
        }


        // Start transaction
        session.startTransaction();

        const output = await venueModel.create(req.body.data);
        // Check if the user is VenueOwner, and update user model accordingly
        if (req.user && req.user.userRole === 'VenueOwner') {
            // Update user document to add new venue ID to `venueIDs` array
            await userModel.updateOne(
                { userID: req.user.userID },
                { $addToSet: { venueIDs: req.body.data.venueID } }, // Using `$addToSet` to avoid duplicates
                { session }
            );
        }

        // Commit transaction if all operations succeed
        await session.commitTransaction();
        session.endSession();
        // await cacheService.delete(`facilityvenues:home:${req.body.data.country}`);
        await cacheService.delete(`${process.env.REDIS_PREFIX}:venues:categories:all:1:${req.body.data.address.country}`);
        await cacheService.delete(`${process.env.REDIS_PREFIX}:latestvenues:home:${req.body.data.address.country}`);
        await cacheService.delete(`${process.env.REDIS_PREFIX}:venuenames:home:${req.body.data.address.country}`);
        const stucturedResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'Venue has been registered successfully!', 'Venue Registration Successful');
        res.json(stucturedResponse);
    }

    catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message, "Error!");
        res.json(stucturedResponse);
    }

})


// An Api for reading venue for venue duplicacy check
venueService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_VENUECHECK, async (req, res) => {
    try {
        engine.generateDatabaseConnector(process.env.DATABASE_URL);

        const output = await venueModel.find(req.body).limit(req.body.limit || 0).sort(req.body.sort || {});
        const stucturedResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'success');
        res.json(stucturedResponse);

    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }
})

venueService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_VENUES, async (req, res) => {
    try {
        engine.generateDatabaseConnector(process.env.DATABASE_URL);
        console.log("req.body", req.body)
        // Extract page, country, and filter settings from the request body
        const page = req.body.page || 1;
        // const limit = 12;
        const limit = req.body.limit || 9; // Default limit is 12 if not provided
        const skip = limit * (page - 1);


        const filter = req.body.filter || {};
        if (req.body.country) {
            filter['address.country'] = req.body.country;
        }


        // Check if user is `VenueOwner` and adjust filter accordingly
        if (req.user && req.user.userRole === 'VenueOwner') {
            // Only show venues assigned to this VenueOwner
            const venueIDs = req.user.venueIDs || [];
            if (venueIDs.length === 0) {
                // Return empty response if no assigned venues
                const structuredResponse = engine.generateServiceResponse([], req.method, 200, req.originalUrl, 'No assigned venues found.');
                structuredResponse.totalCount = 0;
                return res.json(structuredResponse);
            }

            filter.venueID = { $in: venueIDs };
        }


        // Get total count based on filtered criteria
        const totalCount = await venueModel.countDocuments(filter);

        // Fetch the filtered and paginated data
        const output = await venueModel
            .find(filter)
            .limit(limit)
            .skip(skip)
            .sort({ 'createdAt': -1 });

        const structuredResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'success');
        structuredResponse.totalCount = totalCount;
        res.json(structuredResponse);

    } catch (error) {
        const structuredResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(structuredResponse);
    }
});



// Reading Venue Name on Facility Card by Venue ID
venueService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_VENUE_NAME, async (req, res) => {
    try {
        engine.generateDatabaseConnector(process.env.DATABASE_URL);

        const { filter } = req.body;

        const venues = await venueModel.find(filter).select('name -_id');

        const response = engine.generateServiceResponse(venues, req.method, 200, req.originalUrl, 'success');
        response.totalCount = venues.length;

        return res.json(response);
    } catch (error) {
        const errorResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        return res.json(errorResponse);
    }
});



// An Api for reading prev accessed venues
venueService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_VENUES_ACCESS, async (req, res) => {
    try {

        engine.generateDatabaseConnector(process.env.DATABASE_URL);

        const filter = req.body.filter || {};

        // Get total count based on filtered criteria
        const totalCount = await venueModel.countDocuments(filter);

        const { email } = req.body;

        if (!email) {
            // If the email is not provided, send an error response
            return res.status(400).json({
                success: false,
                message: 'Email is required.'
            });
        }


        // Fetch the user based on email to get their associated venueIDs
        const user = await userModel.findOne({ email: email });

        if (!user || !user.venueIDs || user.venueIDs.length === 0) {
            // If no user found or no venues are accessed, return an appropriate response
            const structuredResponse = engine.generateServiceResponse([], req.method, 404, req.originalUrl, 'No venues found for this user.');
            return res.json(structuredResponse);
        }

        // Get the venueIDs from the user's profile
        const venueIDs = user.venueIDs;

        // Fetch venues based on the venueIDs, only returning venueName and venueID
        const output = await venueModel.find({ venueID: { $in: venueIDs } })
            .select('name venueID -_id');

        const structuredResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'success');
        structuredResponse.totalCount = totalCount;
        res.json(structuredResponse);

    } catch (error) {
        const structuredResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(structuredResponse);
    }
});


// An Api for reading venues by filtering already accessed venue

venueService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_VENUES_EXISTING_FILTER, async (req, res) => {
    try {
        engine.generateDatabaseConnector(process.env.DATABASE_URL);
        const { query, venueIDs } = req.body;


        // Construct the filter object
        const filter = {
            name: { $regex: query, $options: 'i' },  // Case-insensitive partial match on `name`
            venueID: { $nin: venueIDs || [] }    // Exclude the `venueID`s in `prevVenueIDs`
        };

        // Find venues that match the filter criteria
        const venues = await venueModel.find(
            filter,  // Use the constructed filter object
            { venueID: 1, name: 1, _id: 0 }  // Projection to include only certain fields
        );
        res.json({ data: venues });

    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }

})


venueService.get(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_VENUE_SEARCH, async (req, res) => {
    try {

        engine.generateDatabaseConnector(process.env.DATABASE_URL);

        const { query, country } = req.query;
        const filter = {};

        // Check if user is `VenueOwner` and adjust filter accordingly
        if (req.user && req.user.userRole === 'VenueOwner') {
            const VenueOwner = await userModel.findOne({ userID: req.user.userID }, 'venueIDs');
            if (VenueOwner && VenueOwner.venueIDs && VenueOwner.venueIDs.length > 0) {
                filter['venueID'] = { $in: VenueOwner.venueIDs }; // Only allow venues related to the VenueOwner
            } else {
                return res.json(engine.generateServiceResponse([], req.method, 200, req.originalUrl, 'No venues available for this user.'));
            }
        }

        // If query (venue name) is provided, add it to the filter
        if (query) {
            filter['name.en'] = { $regex: query, $options: 'i' }; // Case-insensitive search for venue name
        }

        // If country is provided, add it to the filter
        if (country) {
            filter['address.country'] = { $regex: country, $options: 'i' }; // Case-insensitive search for country
        }

        // Now, fetch venues that match both `name` and `country` filters
        const venues = await venueModel.find(
            filter,  // Apply both name and country filters
            { venueID: 1, name: 1, venueArena: 1, _id: 0 }  // Select only relevant fields
        );


        // If no venues are found that match the filters, return an empty array with a message
        if (venues.length === 0) {
            return res.json(engine.generateServiceResponse([], req.method, 200, req.originalUrl, 'No venues match the search criteria.'));
        }

        // Return the filtered venues
        res.json({ data: venues });

    } catch (error) {
        const structuredResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(structuredResponse);
    }
});


//This Api updates multiple venues based on filter
venueService.patch(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_VENUES, async (req, res) => {
    try {
        dataBaseConnection = await engine.generateDatabaseConnector(process.env.DATABASE_URL);

        const { filter, fields } = req.body;
        const duplicateConditions = [];

        if (fields.name.en) {
            duplicateConditions.push({
                'name.en': { $regex: `^${fields.name.en.trim()}$`, $options: 'i' },
            })
        }

        if (fields.name.ar) {
            duplicateConditions.push({
                'name.ar': { $regex: `^${fields.name.ar.trim()}$`, $options: 'i' }
            })
        }

        if (fields.email) {
            duplicateConditions.push({
                'email': { $regex: `^${fields.email.trim()}$` }
            })
        }


        if (fields.location) {

            duplicateConditions.push({
                location: fields.location.trim()
            });
        }

        const existingVenue = await venueModel.findOne({
            $or: duplicateConditions,
            venueID: { $ne: filter.venueID }
        })



        if (existingVenue) {
            let conflictField;

            if (existingVenue.name.en?.toLowerCase() === fields.name.en?.toLowerCase().trim()) {
                conflictField = "English name";
            }
            else if (existingVenue.name.ar?.toLowerCase() === fields.name.ar?.toLowerCase().trim()) {
                conflictField = "Arabic name";
            }
            else if (existingVenue.email?.toLowerCase() === fields.email?.toLowerCase().trim()) {
                conflictField = "email";
            }
            else if (existingVenue.location?.toLowerCase() === fields.location?.toLowerCase().trim()) {
                conflictField = "location";
            }

            const structuredResponse = engine.generateServiceResponse(
                null,
                req.method,
                409, // Conflict
                req.originalUrl,
                `A venue with the same ${conflictField} already exists!`,
                "Duplicate Venue"
            );
            return res.json(structuredResponse);
        }

        const output = await venueModel.updateMany(
            filter,
            { $set: fields },
            { runValidators: true }
        )

        const facilityTypes = await venueFacilityModel.distinct("facilityType", { venueID: filter.venueID });

        if (output.modifiedCount === 0) {
            const structuredResponse = engine.generateServiceResponse(
                null,
                req.method,
                404,
                req.originalUrl,
                "No venues found",
                "Not Found"
            );
            return res.json(structuredResponse);
        }

        for (const facility of facilityTypes) {
            const cacheKey = `${process.env.REDIS_PREFIX}:venues:categories:${facility}:1:${fields.country}`;
            await cacheService.delete(cacheKey);
        }
        await cacheService.delete(`${process.env.REDIS_PREFIX}:venuenames:home:${fields.country}`);
        await cacheService.delete(`${process.env.REDIS_PREFIX}:latestvenues:home:${fields.country}`);
        await cacheService.delete(`${process.env.REDIS_PREFIX}:venues:categories:all:1:${fields.country}`);
        await cacheService.delete(`${process.env.REDIS_PREFIX}:homeSearchVenue:${filter.venueID}`);
        const structuredResponse = engine.generateServiceResponse(
            output,
            req.method,
            200,
            req.originalUrl,
            'Venue updated successfully!',
            'Update Successful'
        );
        res.json(structuredResponse);

    } catch (error) {
        const structuredResponse = engine.generateServiceResponse(
            null,
            req.method,
            error.statusCode || 500,
            req.originalUrl,
            error.message,
            "Error!"
        );
        res.json(structuredResponse);
    }
});

// This Api deletes multiple users based on filter
venueService.delete(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_VENUES, async (req, res) => {
    try {
        dataBaseConnection = engine.generateDatabaseConnector(process.env.DATABASE_URL);

        const output = await venueModel.deleteMany(req.body.filter);
        const stucturedResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'success');
        res.json(stucturedResponse);

    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }
})



module.exports = venueService; 