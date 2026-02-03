const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Load the environment variables


/********************* Schema Definition **********************/
const course = new mongoose.Schema({

  courseID: { type: String, unique: true, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  duration: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true }
}, {
  timestamps: true
})


const courseModel = mongoose.model('course', course);


module.exports = courseModel;