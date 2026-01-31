
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
        userID: { type: String},
        userName: { type: String },
        deletedAt: { type: Date }
    },
    {
            _id: false
    }
);


const addressSubSchema = new mongoose.Schema({

    country: {
        type: String,
        required: true,
        trim: true
    },
    state: {type: String, required: true, trim: true},
    city: {type: String, trim: true},
    coordinates: {type: String, trim: true},

},
{
    _id: false
}
)


/********************* Schema Definition **********************/
const venue = new mongoose.Schema({

    venueID: {type: String, unique: true, required: true, trim: true},
    name: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    email:  { type: String,  required: true, unique: true,  trim: true },
    overview: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    imageGallery: [{ type: String,  trim: true, default:[] }],
    location: { type: String, required: true, unique: true, trim: true},
    address: { type: addressSubSchema },
    venueArena: [{type: String, trim: true, sparse: true}],
    exclusiveBenefits: {
      en: { type: String, required: true, trim: true },
      ar: { type: String, required: true, trim: true },
    },
    createdBy: { type: userSubSchema, default:{userID:null,userName:null}},
    deletedBy: { type: deletedBySubSchema, default: { userID: null, userName: null, deletedAt: null } },
    isDeleted: { type: Boolean, default: false },

},{
    timestamps: true,
})


const venueModel = mongoose.model('venue', venue);
module.exports = venueModel;