const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Load the environment variables


/********************* Schema Definition **********************/
const result = new mongoose.Schema({

    resultID: { type: String, unique: true, required: true, trim: true },
    courseID: { type: String, required: true, trim: true },
    courseName: { type: String, required: true, trim: true },
    studentID: { type: String, required: true, trim: true },
    studentName: { type: String, required: true, trim: true },
    guardianName: { type: String, required: true, trim: true },
    year: { type: Number, required: true, enum: [1, 2] },
    session: { type: String, required: true, trim: true },
    subjects: [
        {
            subjectID: { type: String, required: true },
            subjectName: { type: String, required: true }, // store for safety
            examType: { type: String, enum: ["Theory", "Practical"], required: true },
            marksObtained: { type: Number, required: true },
            maxMarks: { type: Number, required: true }
        }
    ],
    totalMarks: { type: Number, required: true }

}, {
    timestamps: true
})


const resultModel = mongoose.model('result', result);


module.exports = resultModel;