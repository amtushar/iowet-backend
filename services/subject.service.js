
const subjectModel = require('../schemas/subject/subject.schema');
const engine = require('../utils/engine.util');
const endpoints = require('../utils/endpoints.util');
const express = require('express');
require('dotenv').config();
const subjectService = express.Router();

// Create a new subject
subjectService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_SUBJECT, async (req, res) => {
  try {
    await engine.generateDatabaseConnector(process.env.DATABASE_URL);

   const filter = { name: { $regex: `^${req.body.data.name}$`, $options: 'i' } };

    // Check if subjectID already exists
    const existingSubject = await subjectModel.findOne(filter);
    if (existingSubject) {
      const structuredResponse = engine.generateServiceResponse(
        null,
        req.method,
        409,
        req.originalUrl,
        'Subject Name already in use',
        'Subject Already Exists'
      );
      return res.json(structuredResponse);
    }

    const output = await subjectModel.create(req.body.data);

    const structuredResponse = engine.generateServiceResponse(
      output,
      req.method,
      200,
      req.originalUrl,
      'Subject has been created successfully!',
      'Success'
    );

    res.json(structuredResponse);

  } catch (error) {
    const structuredResponse = engine.generateServiceResponse(
      null,
      req.method,
      500,
      req.originalUrl,
      error.message,
      'Error!'
    );
    res.json(structuredResponse);
  }
});


subjectService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_READ_SUBJECTS, async (req, res) => {
  try {
    await engine.generateDatabaseConnector(process.env.DATABASE_URL);

    const page = parseInt(req.body.page) || 1;
    const limit = parseInt(req.body.limit) || 10; // allow optional limit from frontend
    const skip = limit * (page - 1);

    // Fetch total count
    const totalCount = await subjectModel.countDocuments();

    // Fetch paginated subjects
    const output = await subjectModel.find()
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const structuredResponse = engine.generateServiceResponse(
      output,
      req.method,
      200,
      req.originalUrl,
      'Subjects fetched successfully!'
    );

    // Add pagination info
    structuredResponse.totalCount = totalCount;
    structuredResponse.totalPages = Math.ceil(totalCount / limit);

    res.json(structuredResponse);

  } catch (error) {
    console.error('Error in readSubjects API:', error);
    const structuredResponse = await engine.generateServiceResponse(
      null,
      req.method,
      500,
      req.originalUrl,
      error.message,
      'Error!'
    );
    res.json(structuredResponse);
  }
});

// READ SUBJECTS BY COURSE ID
subjectService.post(endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_READ_SUBJECT_BY_COURSE, async (req, res) => {

  try {

    await engine.generateDatabaseConnector(process.env.DATABASE_URL);

    const { courseID, year } = req.body;

    if (!courseID) {
      const structuredResponse = engine.generateServiceResponse(
        null,
        req.method,
        400,
        req.originalUrl,
        "courseID is required",
        "Validation Error"
      );
      return res.json(structuredResponse);
    }

    // Fetch all subjects of this course
    const output = await subjectModel.find({ courseID, year })
      .sort({ _id: 1 });   // nice ordered list

    const structuredResponse = engine.generateServiceResponse(
      output,
      req.method,
      200,
      req.originalUrl,
      "Subjects fetched successfully!"
    );

    res.json(structuredResponse);

  } catch (error) {

    console.error("Error in readSubjectByCourse:", error);

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

/********************* UPDATE SUBJECT **********************/

subjectService.post(
  endpoints.ENDPOINT_API_VERSION + endpoints.ENDPOINT_UPDATE_SUBJECT,
  async (req, res) => {

  try {

    await engine.generateDatabaseConnector(process.env.DATABASE_URL);

    const { subjectID, subjectData } = req.body;


    // ===== 1. CHECK SUBJECT EXISTS =====
    const existingSubject = await subjectModel.findOne({ subjectID });

    if (!existingSubject) {
      const structuredResponse = engine.generateServiceResponse(
        null,
        req.method,
        404,
        req.originalUrl,
        "Subject not found",
        "Not Found"
      );
      return res.json(structuredResponse);
    }


    // ===== 2. DUPLICATE NAME CHECK (CASE INSENSITIVE, EXCEPT SELF) =====

    const duplicateCheck = await subjectModel.findOne({
      name: { $regex: `^${subjectData.name}$`, $options: "i" },
      subjectID: { $ne: subjectID }
    });

    if (duplicateCheck) {
      const structuredResponse = engine.generateServiceResponse(
        null,
        req.method,
        409,
        req.originalUrl,
        "Subject name already in use",
        "Duplicate Subject"
      );
      return res.json(structuredResponse);
    }


    // ===== 3. UPDATE SUBJECT =====

    const output = await subjectModel.updateOne(
      { subjectID: subjectID },
      {
        $set: {
          name: subjectData.name,
          courseID: subjectData.courseID,
          courseName: subjectData.courseName,
          examType: subjectData.examType,
          maxMarks: subjectData.maxMarks,
          year: subjectData.year
        }
      }
    );


    const structuredResponse = engine.generateServiceResponse(
      output,
      req.method,
      200,
      req.originalUrl,
      "Subject updated successfully!",
      "Success"
    );

    res.json(structuredResponse);

  } catch (error) {

    console.error("Error in updateSubject:", error);

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


module.exports = subjectService;