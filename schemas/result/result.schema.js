const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Load the environment variables


/********************* Schema Definition **********************/
const subject = new mongoose.Schema({

    resultID: { type: String, unique: true, required: true, trim: true },
    courseID: { type: String, required: true, trim: true },
    courseName: { type: String, required: true, trim: true },
    studentID: { type: String, required: true, trim: true },
    year: { type: Number, required: true, enum: [1, 2] },
    session: { type: String, required: true, trim: true },
    subjects: [
        {
            subjectID: { type: String, required: true },
            subjectName: { type: String, required: true }, // store for safety
            examType: { type: String, enum: ["THEORY", "PRACTICAL"], required: true },
            marksObtained: { type: Number, required: true },
            maxMarks: { type: Number, required: true }
        }
    ],
    totalMarks: { type: Number, required: true },
    resultStatus: {
        type: String,
        enum: ["PASS", "FAIL"],
        required: true
    }

}, {
    timestamps: true
})


const subjectModel = mongoose.model('subject', subject);


module.exports = subjectModel;