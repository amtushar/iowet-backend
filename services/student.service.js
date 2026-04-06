const studentModel = require('../schemas/student/student.schema');
const engine = require('../utils/engine.util');
const endpoints = require('../utils/endpoints.util');
const express = require('express');
require('dotenv').config();

const studentService = express.Router();

// CREATE STUDENT API
studentService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_STUDENT, async (req, res) => {

  try {

    await engine.generateDatabaseConnector(process.env.DATABASE_URL);

    // ---------- DUPLICATE CHECKS ----------

    // 1. Check roll number duplicacy
    const existingRoll = await studentModel.findOne({
      rollno: { $regex: `^${req.body.data.rollno}$`, $options: "i" }
    });

    if (existingRoll) {
      const structuredResponse = engine.generateServiceResponse(
        null,
        req.method,
        409,
        req.originalUrl,
        "Roll Number already in use",
        "Duplicate Roll Number"
      );
      return res.json(structuredResponse);
    }

    // ---------- CREATE STUDENT ----------
    const output = await studentModel.create(req.body.data);

    const structuredResponse = engine.generateServiceResponse(
      output,
      req.method,
      200,
      req.originalUrl,
      "Student has been registered successfully!",
      "Success"
    );

    res.json(structuredResponse);

  } catch (error) {

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

// READ STUDENTS WITH PAGINATION
studentService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_READ_STUDENTS, async (req, res) => {

  try {

    await engine.generateDatabaseConnector(process.env.DATABASE_URL);

    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10;
    const skip = limit * (page - 1);

    // Total students count
    const totalCount = await studentModel.countDocuments();

    // Fetch students
    const output = await studentModel
      .find()
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const structuredResponse = engine.generateServiceResponse(
      output,
      req.method,
      200,
      req.originalUrl,
      "success"
    );

    structuredResponse.totalCount = totalCount;
    structuredResponse.totalPages = Math.ceil(totalCount / limit);

    return res.json(structuredResponse);

  } catch (error) {

    console.error('Error in read students API:', error);

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

// READ STUDENT BY ROLL NUMBER
studentService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_READ_STUDENT_BY_ROLL, async (req, res) => {

  try {

    await engine.generateDatabaseConnector(process.env.DATABASE_URL);

    const { rollno } = req.body;

    if (!rollno) {
      const structuredResponse = engine.generateServiceResponse(
        null,
        req.method,
        400,
        req.originalUrl,
        "rollno is required",
        "Validation Error"
      );
      return res.json(structuredResponse);
    }

    // Fetch only required fields
    const output = await studentModel.findOne(
      { rollno: rollno },
      {
        _id: 0,
        studentID: 1,
        name: 1,
        courseID: 1,
        courseName: 1,
        guardianName: 1,
        year: 1,
        session: 1
      }
    );

    if (!output) {
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

    const structuredResponse = engine.generateServiceResponse(
      output,
      req.method,
      200,
      req.originalUrl,
      "Student fetched successfully!"
    );

    res.json(structuredResponse);

  } catch (error) {

    console.error("Error in getStudentByRoll:", error);

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


/********************* UPDATE STUDENT **********************/

studentService.post(
  endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_UPDATE_STUDENT,
  async (req, res) => {

    try {

      await engine.generateDatabaseConnector(process.env.DATABASE_URL);

      const { studentID, studentData } = req.body;

      // ===== 1. CHECK STUDENT EXISTS =====
      const existingStudent = await studentModel.findOne({ studentID });

      if (!existingStudent) {
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

      // ===== 3. UPDATE STUDENT =====
      const output = await studentModel.updateOne(
        { studentID: studentID },
        {
          $set: {
            name: studentData.name,
            guardianName: studentData.guardianName,
            courseID: studentData.courseID,
            courseName: studentData.courseName,   // if you send it
            rollno: studentData.rollno,
            dob: studentData.dob,
            year: studentData.year,
            session: studentData.session
          }
        }
      );


      const structuredResponse = engine.generateServiceResponse(
        output,
        req.method,
        200,
        req.originalUrl,
        "Student updated successfully!",
        "Success"
      );

      res.json(structuredResponse);

    } catch (error) {

      console.error("Error in updateStudent:", error);

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


module.exports = studentService;
