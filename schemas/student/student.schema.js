const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Load the environment variables


/********************* Schema Definition **********************/
const student = new mongoose.Schema({

  studentID: { type: String, unique: true, required: true, trim: true },
  courseID: { type: String, required: true, trim: true },
  courseName: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  guardianName: { type: String, required: true, trim: true },
  rollno: { type: String, required: true, unique: true, trim: true},
  dob: { type: Date, required: true },
  year: { type: Number, required: true, enum: [1, 2]},
  session: { type: String, required: true, trim: true }
}, {
  timestamps: true
})


const studentModel = mongoose.model('student', student);


module.exports = studentModel;