
const courseModel = require('../schemas/course/course.schema');
const engine = require('../utils/engine.util');
const endpoints = require('../utils/endpoints.util');
const express = require('express');
require('dotenv').config();
const courseService = express.Router();


// This API is used for user registration or user creation.
courseService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_COURSE, async (req, res) => {

    try {

        dataBaseConnection = await engine.generateDatabaseConnector(process.env.DATABASE_URL);
        let filter = {
            name: req.body.data.name
        }

        const existingCourse = await courseModel.findOne({ name: req.body.data.name });

        if (existingCourse && existingCourse.name === filter.name) {
            const stucturedResponse = engine.generateServiceResponse(null, req.method, 409, req.originalUrl, "name already in use", "name Already Exists");
            return res.json(stucturedResponse);
        }

        const output = await courseModel.create(req.body.data);

        const stucturedResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'Course has been registered successfully!', 'Success');
        res.json(stucturedResponse);
    }

    catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message, "Error!");
        res.json(stucturedResponse);
    }

})


courseService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_READ_COURSES, async (req, res) => {
    try {
        await engine.generateDatabaseConnector(process.env.DATABASE_URL);

        const page = parseInt(req.body.page) || 1;
        const limit = 10;
        const skip = limit * (page - 1);


        // Fetch all matching courses
        const totalCount = await courseModel.countDocuments();

        const output = await courseModel.find().limit(req.body.limit || limit).skip(skip).sort({ "createdAt": -1 });
        const structuredResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'success');
        // Add totalCount to the structured response
        structuredResponse.totalCount = totalCount;
        structuredResponse.totalPages = Math.ceil(totalCount / limit);

        return res.json(structuredResponse);

    } catch (error) {
        console.error('Error in course read API:', error);
        const structuredResponse = await engine.generateServiceResponse(
            null,
            req.method,
            500,
            req.originalUrl,
            error.message,
            "Error!"
        );
        res.json(structuredResponse);
    }
});




module.exports = courseService;