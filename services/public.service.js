const resultModel = require('../schemas/result/result.schema');
const courseModel = require('../schemas/course/course.schema');
const engine = require('../utils/engine.util');
const endpoints = require('../utils/endpoints.util');
const express = require('express');
require('dotenv').config();

const publicService = express.Router();


publicService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_READ_PUBLIC_COURSES, async (req, res) => {
  try {
    await engine.generateDatabaseConnector(process.env.DATABASE_URL);

    const output = await courseModel.find().sort({ "createdAt": -1 });
    const structuredResponse = engine.generateServiceResponse(output, req.method, 200, req.originalUrl, 'success');
    // Add totalCount to the structured response
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


// GET RESULT BY ROLLNO + YEAR + COURSE
publicService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_READ_PUBLIC_RESULT, async (req, res) => {
  try {
    await engine.generateDatabaseConnector(process.env.DATABASE_URL);

    const { rollno, year, courseID } = req.body;

    if (!rollno || !year || !courseID) {
      const structuredResponse = engine.generateServiceResponse(
        null,
        req.method,
        400,
        req.originalUrl,
        "rollno, year, and courseID are required",
        "Missing Parameters"
      );
      return res.json(structuredResponse);
    }

    // Find studentID from rollno
    const studentModel = require('../schemas/student/student.schema');
    const student = await studentModel.findOne({ rollno: rollno.trim() });
    if (!student) {
      const structuredResponse = engine.generateServiceResponse(
        null,
        req.method,
        404,
        req.originalUrl,
        "Student not found",
        "Not Found"
      );
      return res.json(structuredResponse);
    }

    // Find result
    const result = await resultModel.findOne({
      studentID: student.studentID,
      courseID: courseID.trim(),
      year: year
    });

    if (!result) {
      const structuredResponse = engine.generateServiceResponse(
        null,
        req.method,
        404,
        req.originalUrl,
        "Result not found for the given student and course",
        "Not Found"
      );
      return res.json(structuredResponse);
    }

    let resultObj = result.toObject();

    resultObj.studentName = student.name;
    resultObj.guardianName = student.guardianName;


    const structuredResponse = engine.generateServiceResponse(
      resultObj,
      req.method,
      200,
      req.originalUrl,
      "Result fetched successfully",
      "Success"
    );
    res.json(structuredResponse);

  } catch (error) {
    console.error("Error in getResultByRoll API:", error);
    const structuredResponse = engine.generateServiceResponse(
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

module.exports = publicService;