
const engine = require('../utils/engine.util');
const endpoints = require('../utils/endpoints.util');
const express = require('express');
require('dotenv').config();
const userProfileService = express.Router();



// An Api for re capturing logged in user
userProfileService.get(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_CURRENT_USER, async (req, res) => {

    try {
        dataBaseConnection = await engine.generateDatabaseConnector(process.env.DATABASE_URL);
        const user = req.user;
        const stucturedResponse = engine.generateServiceResponse(user, req.method, 200, req.originalUrl, 'user');
        res.json(stucturedResponse);


    } catch (error) {

        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);

    }

})

module.exports = userProfileService