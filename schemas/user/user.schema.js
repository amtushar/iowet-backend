

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv');
dotenv.config(); // Load the environment variables

/********************* Sub Schema Definition **********************/
const userSubSchema = new mongoose.Schema(
  {
    userID: { type: String, required: true, trim: true },
    userName: { type: String, required: true, trim: true },
  },
  {
    _id: false,
  }
);

const deletedBySubSchema = new mongoose.Schema(
  {
    userID: { type: String },
    userName: { type: String },
    deletedAt: { type: Date },
  },
  {
    _id: false,
  }
);



const USER_ROLES = {
  BENEFITPLUS_ADMIN: "BenefitPlusAdmin",
  VENUE_OWNER: "VenueOwner"
};


/********************* Schema Definition **********************/
const user = new mongoose.Schema({

  userID: { type: String, unique: true, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true },
  password: { type: String, required: true, trim: true },
  contact: { type: String, required: true, unique: true, trim: true },
  venueIDs: [{ type: String, trim: true, default: null }],
  venueArenaIDs: [{ type: String, trim: true, default: null }],
  userRole: { type: String, enum: Object.values(USER_ROLES), required: true },
  country: {
    type: String,
    trim: true,
    default: ""
  },
  emailToken: { type: String, default: '' },
  isVerified: { type: Boolean, default: false },
  createdBy: { type: userSubSchema, required: true },
  deletedBy: {
    type: deletedBySubSchema,
    default: { userID: null, userName: null, deletedAt: null },
  },
  isDeleted: { type: Boolean, default: false },

}, {
  timestamps: true
})

user.methods.generateAccessToken = (userID) => {
  return jwt.sign({
    _id: userID,
  }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY
  })
}
const userModel = mongoose.model('user', user);


module.exports = userModel;