/**
@Description  : This file is the entry point for RestService
**/

const express = require('express');
const cors = require('cors');
const endpoints = require('./utils/endpoints.util.js')
const engine = require("./utils/engine.util.js")
const messages = require('./utils/messages.util.js')
require('dotenv').config();
const cookieParser = require('cookie-parser');

/******** admin portal Services or Controllers *********/
const userService = require("./services/user.service.js");
const userAuth = require('./middleware/authentication.js');
const userProfileService = require('./services/userprofile.service.js');
const userLoginService = require('./services/userlogin.service.js');
const courseService = require('./services/course.service.js');
const subjectService = require('./services/subject.service.js');
const studentService = require('./services/student.service.js');
const resultService = require('./services/result.service.js');
const publicService = require('./services/public.service.js');

const restService = express();
const consoleLogger = engine.generateConsoleLogger();
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin) {
            // No Origin means it's likely from a mobile app (Expo APK or other native apps)
            return callback(null, true);  // ✅ Use `true`, NOT `'*'`
        }
        const allowedOrigins = [
            'http://localhost:3000',
            'http://13.205.250.66',
            'https://iowet.in',
            'https://www.iowet.in'

        ];

        if (allowedOrigins.includes(origin)) {
            callback(null, origin);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true  // ✅ Allows sending cookies/auth tokens
};


restService.use(cookieParser());
restService.use(cors(corsOptions));
restService.use(express.json());


// admin portal
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_USER_LOGIN, userLoginService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_PUBLIC, publicService);
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_COURSE, userAuth, courseService); // courses service
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_SUBJECT, userAuth, subjectService); // subjects service
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_STUDENT, userAuth, studentService); // students service
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_RESULT, userAuth, resultService); // students service
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_USER_PROFILE, userAuth, userProfileService); // for again capturing current logged in user after reload in redux state being called in the layout in frontend
restService.use(endpoints.ENDPOINT_BASE_URL + endpoints.ENDPOINT_GROUP_USER, userAuth, userService);

// Starting the Rest-Service Based on the security configuration
restService.listen(process.env.REST_SERVICE_PORT, process.env.HOST || '0.0.0.0');
consoleLogger.info(messages.REST_SERVICE_RUNNING_MESSAGE + process.env.REST_SERVICE_HOST + ":" + process.env.REST_SERVICE_PORT);