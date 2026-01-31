const userModel = require('../schemas/user/user.schema');
const engine = require('../utils/engine.util');
const endpoints = require('../utils/endpoints.util');
const express = require('express');
require('dotenv').config();
const userEmailTokenService = express.Router();


userEmailTokenService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_USER_VERIFICATION_CHECK, async (req, res) => {

    try {
        dataBaseConnection = await engine.generateDatabaseConnector(process.env.DATABASE_URL);
        const output = await userModel.findOne({ emailToken: req.body.emailToken });
        const stucturedResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, "success");
        res.json(stucturedResponse);

    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }
})


userEmailTokenService.patch(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_USER_VERIFICATION_UPDATE, async (req, res) => {
    try {
        dataBaseConnection = await engine.generateDatabaseConnector(process.env.DATABASE_URL);
        const output = await userModel.updateMany(req.body.filter, req.body.fields);
        const stucturedResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'success');
        res.json(stucturedResponse);

    } catch (error) {
        const stucturedResponse = engine.generateServiceResponse(null, req.method, 500, req.originalUrl, error.message);
        res.json(stucturedResponse);
    }
})


module.exports = userEmailTokenService;