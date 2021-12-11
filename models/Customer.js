const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const CustomerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter a customer name"],
    unique: true,
    trim: true,
    maxlength: [120, "Name cannot be more than 120 characters"],
  },
  slug: String,
  description: {
    type: String,
    maxlength: [500, "Description cannot be longer than 500 characters"],
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      "Please use a valid URL with HTTP or HTTPS",
    ],
  },
  email: {
    type: String,
    required: [true, "Please enter a valid customer email"],
    match: [
      /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/,
      "Please use a valid email address",
    ],
  },
  phone: {
    type: String,
    maxlength: [20, "Phone number cannot be longer than 20 characters"],
  },
  address: {
    type: String,
    required: [true, "Please add a valid customer address"],
  },
  location: {
    // GeoJSON point
    type: {
      type: String,
      enum: ["Point"],
      required: false,
    },
    coordinates: {
      type: [Number],
      required: false,
      index: "2dsphere",
    },
    formattedAddress: String,
    street: String,
    city: String,
    state: String,
    zipcode: String,
    country: String,
  },
  status: {
    type: String,
    required: [true, "Please add a customer status"],
    enum: ["Contacted", "Signed", "Current", "Renewal", "Expired"],
  },
  photo: {
    type: String,
    default: "no-photo.jpg",
  },
  contractDate: {
    type: Date,
  },
  renewalDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
},{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Create customer slug from name
CustomerSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// Geocode and create location field
CustomerSchema.pre(
  "save",
  async function (next) {
    const loc = await geocoder.geocode(this.address);
    this.location = {
      type: "Point",
      coordinates: [loc[0].longitude, loc[0].latitude],
      formattedAddress: loc[0].formattedAddress,
      street: loc[0].streetName,
      city: loc[0].city,
      state: loc[0].stateCode,
      zipcode: loc[0].zipcode,
      country: loc[0].countryCode,
    };

    // Do not save submitted address in DB
    this.address = undefined;
    next();
  }
);

// Cascade delete projects when customer is deleted
CustomerSchema.pre('remove', async function (next) {
  await this.model('Project').deleteMany({ customer: this._id });
  next();
});

// Reverse populate with virtuals
CustomerSchema.virtual("projects", {
  ref: "Project",
  localField: "_id",
  foreignField: "customer",
  justOne: false,
});

module.exports = mongoose.model("Customer", CustomerSchema);
