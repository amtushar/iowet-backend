const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Load the environment variables


/********************* Schema Definition **********************/
const subject = new mongoose.Schema({

  subjectID: { type: String, unique: true, required: true, trim: true },
  courseID: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  examType: { type: String, required: true, enum: ["Theory", "Practical"]},
  maxMarks: { type: Number, required: true },
  year: { type: Number, required: true, enum: [1, 2]},

}, {
  timestamps: true
})


const subjectModel = mongoose.model('subject', subject);


module.exports = subjectModel;