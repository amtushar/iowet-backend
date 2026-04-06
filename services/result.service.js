const resultModel = require('../schemas/result/result.schema');
const engine = require('../utils/engine.util');
const endpoints = require('../utils/endpoints.util');
const express = require('express');
require('dotenv').config();

const resultService = express.Router();

/********************* CREATE RESULT **********************/

resultService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_RESULT, async (req, res) => {

  try {

    await engine.generateDatabaseConnector(process.env.DATABASE_URL);

    const data = req.body.data;
    console.log('data here --',data);
    // ===== 1. DUPLICATE CHECK =====
    const existingResult = await resultModel.findOne({
      studentID: data.studentID,
      courseID: data.courseID,
      year: data.year,
      session: data.session
    });

    if (existingResult) {
      const structuredResponse = engine.generateServiceResponse(
        null,
        req.method,
        409,
        req.originalUrl,
        "Result already exists for this student in selected session & year",
        "Duplicate Result"
      );
      return res.json(structuredResponse);
    }


    // ===== 2. VALIDATE SUBJECT MARKS =====
    for (let sub of data.subjects) {
    console.log('marks obtain - max marks', sub.marksObtained + "-" + sub.maxMarks);
      if (sub.marksObtained > sub.maxMarks) {
        const structuredResponse = engine.generateServiceResponse(
          null,
          req.method,
          400,
          req.originalUrl,
          `Marks obtained cannot be greater than max marks for ${sub.subjectName}`,
          "Invalid Marks"
        );
        return res.json(structuredResponse);
      }

    }


    // ===== 4. CREATE RESULT =====
    const output = await resultModel.create(data);


    const structuredResponse = engine.generateServiceResponse(
      output,
      req.method,
      200,
      req.originalUrl,
      "Result has been created successfully!",
      "Success"
    );

    res.json(structuredResponse);


  } catch (error) {

    console.log("Error in createResult:", error);

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

// GET RESULT BY ROLLNO + YEAR + COURSE
resultService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_READ_RESULT_BY_ROLL, async (req, res) => {
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

    const structuredResponse = engine.generateServiceResponse(
      result,
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

/********************* UPDATE RESULT **********************/

resultService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_UPDATE_RESULT, async (req, res) => {

  try {

    await engine.generateDatabaseConnector(process.env.DATABASE_URL);

    const data = req.body.data;

    // ===== 1. CHECK RESULT EXISTS =====
    const existingResult = await resultModel.findOne({
      resultID: data.resultID
    });

    if (!existingResult) {
      const structuredResponse = engine.generateServiceResponse(
        null,
        req.method,
        404,
        req.originalUrl,
        "Result not found",
        "Not Found"
      );
      return res.json(structuredResponse);
    }

    // ===== 3. VALIDATE SUBJECT MARKS =====
    for (let sub of data.subjects) {

      if (sub.marksObtained > sub.maxMarks) {
        const structuredResponse = engine.generateServiceResponse(
          null,
          req.method,
          400,
          req.originalUrl,
          `Marks obtained cannot be greater than max marks for ${sub.subjectName}`,
          "Invalid Marks"
        );
        return res.json(structuredResponse);
      }

    }


    // ===== 4. UPDATE RESULT =====
    const output = await resultModel.findOneAndUpdate(
      { resultID: data.resultID },
      {
        $set: {
          courseID: data.courseID,
          courseName: data.courseName,
          studentID: data.studentID,
          year: data.year,
          session: data.session,
          subjects: data.subjects,
          totalMarks: data.totalMarks
        }
      },
      { new: true }
    );


    const structuredResponse = engine.generateServiceResponse(
      output,
      req.method,
      200,
      req.originalUrl,
      "Result has been updated successfully!",
      "Success"
    );

    res.json(structuredResponse);


  } catch (error) {

    console.log("Error in updateResult:", error);

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




module.exports = resultService;
