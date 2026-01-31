/**
@CreatedBy    : Dhingra
@CreatedTime  : August 27 2024
@ModifiedBy   : Dhingra 
@ModifiedTime : August 27 2024
@Description  : This file is contains all the reusable functions for rest service
**/

const mongoose = require('mongoose');
const pino = require('pino')
const pretty = require('pino-pretty')


module.exports = class engine {

    /**
    @CreatedBy    : Dhingra 
    @CreatedTime  : August 27 2024
    @ModifiedBy   : Dhingra 
    @ModifiedTime : August 27 2024
    @Description  : This function retrun console logger object
    **/
    static generateConsoleLogger() {
        return pino(pretty({ colorize: true }))
    }


    /**
    @CreatedBy    : Dhingra 
    @CreatedTime  : August 27 2024
    @ModifiedBy   : Dhingra 
    @ModifiedTime : August 27 2024
    @Description  : This function generates database connection object
    **/

    // static generateDatabaseConnector(databaseUrl) {
    //     mongoose.set('strictQuery', false);
    //     const databaseConnector = mongoose.connect(databaseUrl)
    //         .then(() => {
    //             console.log('Connected to MongoDB Successfully');
    //         })
    //         .catch((error) => {
    //             console.error('Error connecting to MongoDB:', error);
    //         });

    //     return databaseConnector;
    // }

    static generateDatabaseConnector(databaseUrl) {
        mongoose.set('strictQuery', false);
        const databaseConnector = mongoose.connect(databaseUrl)
            .then((connection) => {
                console.log('Connected to MongoDB Successfully');
                return connection;
            })
            .catch((error) => {
                console.error('Error connecting to MongoDB:', error);
            });

        return databaseConnector;
    }



    /**
    @CreatedBy    : Dhingra 
    @CreatedTime  : August 27 2024
    @ModifiedBy   : Dhingra 
    @ModifiedTime : August 27 2024
    @Description  : This function generates service response object for all APIs
    **/

    static generateServiceResponse(output, method, status, originalUrl, message, title) {
        let serviceResponse = {
            outputResponse: output,
            apiResponse: {
                output: output,
                method: method,
                status: status,
                message: message ? message : "Success",
                title: title ? title: "Success!",
                timestamp: new Date().toLocaleString(),
                url: originalUrl
            }
        }

        return serviceResponse;
    }

    /**
    @CreatedBy    : Dhingra 
    @CreatedTime  : August 27 2024
    @ModifiedBy   : Dhingra 
    @ModifiedTime : August 27 2024
    @Description  : This function handles unauthorized response
    **/
    static getUnauthorizedResponse(req) {
        return engine.generateServiceResponse(null, null, req.method, 401, `Unauthorized request of Username: ${req.auth.user} and Password:${req.auth.password}`, req.originalUrl)
    }


}

