
const venueFacilityModel = require('../schemas/venueFacility/venuefacility.schema');
const venueModel = require('../schemas/venue/venue.schema');
const engine = require('../utils/engine.util');
const endpoints = require('../utils/endpoints.util');
const express = require('express');
const userModel = require('../schemas/user/user.schema');
const cacheService = require('../utils/redis/cache-service')
require('dotenv').config();
const venueFacilityService = express.Router();




// // This API is using the mongoDB transaction for venue facility registration and venue updation with added facility.
venueFacilityService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_FACILITY, async (req, res) => {
    const session = await venueFacilityModel.startSession();
    session.startTransaction();

    try {
        dataBaseConnection = await engine.generateDatabaseConnector(process.env.DATABASE_URL);

        const facilitiesToCreate = req.body.data.facilities;
        const venueID = req.body.data.venueID;
        const venueName = req.body.data.venueName;
        
        // Quick safety check - though frontend should have already prevented duplicates
        for (const facility of facilitiesToCreate) {
            const existingFacility = await venueFacilityModel.findOne({
                'name.en': facility.name.en,
                facilityType: facility.facilityType,
                venueID: venueID
            }).session(session);

            if (existingFacility) {
                await session.abortTransaction();
                session.endSession();
                
                const output = engine.generateServiceResponse(
                    existingFacility, 
                    req.method, 
                    409, 
                    req.originalUrl,
                    `${facility.name.en} facility already exists`,
                    'Facility Already Exists'
                );
                return res.json(output);
            }
        }

        // Step 2: Create Facilities if no duplicates
        const facilityOutput = await venueFacilityModel.insertMany(facilitiesToCreate, { session });

        // Step 3: Find and Update Venue with created facilities
        const venueUpdate = await venueModel.findOneAndUpdate(
            { 'name.en': venueName },
            { $push: { venueArena: { $each: facilityOutput.map(facility => facility.venueFacilityID) } } },
            { session }
        );

        if (!venueUpdate) {
            throw new Error("Venue not found for update");
        }

        // Step 4: Find venue owners to update
        const venueOwnerUsers = await userModel.find(
            {
                userRole: "VenueOwner",
                venueIDs: { $in: [venueID] }
            },
            null,
            { session }
        );

        if (venueOwnerUsers.length > 0) {
            // Attempt to update those users
            const userUpdateResult = await userModel.updateMany(
                {
                    userRole: "VenueOwner",
                    venueIDs: { $in: [venueID] }
                },
                {
                    $addToSet: {
                        venueArenaIDs: { $each: facilityOutput.map(f => f.venueFacilityID) }
                    }
                },
                { session }
            );
        } else {
            console.log('Venue owners not found for venue:', venueID);
        }

        const venueDoc = await venueModel.findOne({venueID})
        const country = venueDoc.address.country;
        const allFacilityTypes = new Set();

        let cacheKey = `${process.env.REDIS_PREFIX}:venues:categories:all:1:${country}`;

        await cacheService.delete(cacheKey);

        for (const facility of facilitiesToCreate) {
            allFacilityTypes.add(facility.facilityType);
        }

        for (const facility of allFacilityTypes) {
            cacheKey = `${process.env.REDIS_PREFIX}:venues:categories:${facility}:1:${country}`;
            await cacheService.delete(cacheKey);
        }

        // Commit transaction if all operations succeed
        await session.commitTransaction();
        session.endSession();

        // Send success response
        const structuredResponse = engine.generateServiceResponse(
            { facilityOutput, venueUpdate }, 
            req.method, 
            200, 
            req.originalUrl, 
            'Facilities have been registered successfully!', 
            'Facility Registration Successful'
        );
        res.json(structuredResponse);

    } catch (error) {
        await session.abortTransaction();
        session.endSession();

        // Send error response
        const structuredResponse = engine.generateServiceResponse(
            null, 
            req.method, 
            500, 
            req.originalUrl, 
            error.message
        );
        res.json(structuredResponse);
    }
});
// checking whether facility exists or not
venueFacilityService.get(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_FACILITY_CHECK, async (req, res) => {
    try {
        const { facilityName, facilityType, venueID } = req.query;
        const existingFacility = await venueFacilityModel.findOne({
            'name.en': facilityName,
            facilityType: facilityType,
            venueID: venueID
        });
        res.json({ exists: !!existingFacility });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// An Api for reading multiple venue facilities by query params - currently not in use***
venueFacilityService.get(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_VENUE_FACILITY_SEARCH, async (req, res) => {
    try {

        engine.generateDatabaseConnector(process.env.DATABASE_URL);
        const query = req.query.query;
        // Fetch only venueID and name fields
        const venues = await venueFacilityModel.find(
            { name: { $regex: query, $options: 'i' } },  // Search by name using regex
            { venueFacilityID: 1, name: 1, _id: 0 }  // Only project (include) venueID and name
        );

        // Directly return the filtered response
        res.json({ data: venues });


    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }
})




// An Api for reading data of venuefacilities within the venue
venueFacilityService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_VENUE_FACILITIES, async (req, res) => {
    try {
        engine.generateDatabaseConnector(process.env.DATABASE_URL);

        const query = { venueFacilityID: { $in: req.body.facilityids } }; // Query to match any ID in facilityids array
        const output = await venueFacilityModel.find(query).select('-isDeleted -_id -createdAt -updatedAt -deletedBy -venueFacilityID -imageGallery -overview -__v').limit(req.body.limit || 0).sort(req.body.sort || {});
        const stucturedResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'success');
        res.json(stucturedResponse);

    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }
})




// An Api for reading multiple facilities by filter and pagination
venueFacilityService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_FACILITIES, async (req, res) => {
    try {
        engine.generateDatabaseConnector(process.env.DATABASE_URL);


        // Initialize filter with facilityType
        const filter = {};
        if (req.body.facilityType) {
            filter['facilityType'] = req.body.facilityType;
        }

        if (req.body.facilityids) {
            filter['venueFacilityID'] = { $in: req.body.facilityids };
        }


        if (req.user && req.user.userRole === 'VenueOwner') {
            const venueOwner = await userModel.findOne({ userID: req.user.userID }, 'venueArenaIDs');

            if (venueOwner && venueOwner.venueArenaIDs.length > 0) {
                // Add an additional filter for venueIDs
                filter['venueFacilityID'] = { $in: venueOwner.venueArenaIDs };
            } else {
                // If no venueArenaIDs found, return empty response for VenueOwner
                return res.json(engine.generateServiceResponse([], req.method, 200, req.originalUrl, 'No Venue facilities available.'));
            }
        }


        const output = await venueFacilityModel.find(filter).limit(req.body.limit || 0).sort({ 'createdAt': -1 });
        const stucturedResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'success');
        res.json(stucturedResponse);

    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }
})


//This Api updates multiple venues based on filter
venueFacilityService.patch(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_FACILITIES, async (req, res) => {
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

        const existingVenue = await venueFacilityModel.findOne({
            $or: duplicateConditions,
            venueFacilityID: { $ne: filter.venueFacilityID }
        })


        if (existingVenue) {
            let conflictField;

            if (existingVenue.name.en?.toLowerCase() === fields.name.en?.toLowerCase().trim()) {
                conflictField = "English name";
            }
            else if (existingVenue.name.ar?.toLowerCase() === fields.name.ar?.toLowerCase().trim()) {
                conflictField = "Arabic name";
            }

            const structuredResponse = engine.generateServiceResponse(
                null,
                req.method,
                409, // Conflict
                req.originalUrl,
                `A facility with the same ${conflictField} already exists!`,
                "Duplicate Facility"
            );
            return res.json(structuredResponse);
        }

        const output = await venueFacilityModel.updateMany(
            filter,
            { $set: fields },
            { runValidators: true }
        )

        if (output.modifiedCount === 0) {
            const structuredResponse = engine.generateServiceResponse(
                null,
                req.method,
                404,
                req.originalUrl,
               "No facilities found",
                "Not Found"
            );
            return res.json(structuredResponse);
        }

        const structuredResponse = engine.generateServiceResponse(
            output,
            req.method,
            200,
            req.originalUrl,
            'Facility updated successfully!',
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
venueFacilityService.delete(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_FACILITIES, async (req, res) => {
    try {
        dataBaseConnection = engine.generateDatabaseConnector(process.env.DATABASE_URL);

        const output = await venueFacilityModel.deleteMany(req.body.filter);
        const stucturedResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'success');
        res.json(stucturedResponse);

    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }
})


// An Api for reading facilities under the venue by serach query and venueID in query params In Add Class
venueFacilityService.get(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_VENUE_FACILITY_CLASS_SEARCH, async (req, res) => {
    try {

        engine.generateDatabaseConnector(process.env.DATABASE_URL);
        const query = req.query.query;
        const venueID = req.query.venueID;
        const getFacilities = await venueFacilityModel.find(
            { 'name.en': { $regex: query, $options: 'i' }, venueID: venueID },
            { venueFacilityID: 1, name: 1, _id: 0 }
        );

        // Directly return the filtered response
        res.json({ data: getFacilities });


    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }
})



module.exports = venueFacilityService;