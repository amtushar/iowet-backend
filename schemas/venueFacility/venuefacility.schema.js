
const mongoose = require('mongoose');


/*** Sub Schema Definition ****/
const userSubSchema = new mongoose.Schema(
    {
        userID: { type: String, required: true, trim: true },
        userName: { type: String, required: true, trim: true },
    },
    {
        _id: false
    }
);

const deletedBySubSchema = new mongoose.Schema(
    {
        userID: { type: String, trim: true },
        userName: { type: String, trim: true },
        deletedAt: { type: Date, trim: true }
    },
    {
        _id: false
    }
);

const timingSubSchema = new mongoose.Schema({

    openingHours: { type: String, required: true, trim: true },
    closingHours: { type: String, required: true, trim: true },

},
    {
        _id: false
    }
)


const venueFacility = new mongoose.Schema({

    venueFacilityID: { type: String, unique: true, required: true, trim: true },
    name: {
        en: { type: String, required: true, trim: true },
        ar: { type: String, required: true, trim: true },
    },
    facilityType: { type: String, required: true, trim: true },
    overview: {
        en: { type: String, required: true, trim: true },
        ar: { type: String, required: true, trim: true },
    },
    imageGallery: [{ type: String, trim: true }],
    timings: { type: timingSubSchema },
    maxCapacity: { type: Number, trim: true },
    // bookedCount: { type: Number, default: 0 },
    exclusiveBenefits: {
        en: { type: String, required: true, trim: true },
        ar: { type: String, required: true, trim: true },
    },
    venueID: { type: String, required: true, trim: true },
    // createdBy: { type: userSubSchema, required: true ,default:{userID:null,userName:null}},
    deletedBy: { type: deletedBySubSchema, default: { userID: null, userName: null, deletedAt: null } },
    isDeleted: { type: Boolean, default: false },

}, {
    timestamps: true,
})


const venueFacilityModel = mongoose.model('venueFacility', venueFacility);
module.exports = venueFacilityModel;
