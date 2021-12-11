const mongoose = require("mongoose");
const slugify = require("slugify");

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please enter a project title"],
    trim: true,
    maxlength: [120, "Project title cannot be longer than 120 characters"],
  },
  slug: String,
  description: {
    type: String,
    maxlength: [500, "Description cannot be longer than 500 characters"],
  },
  status: {
    type: String,
    required: [true, "Please add a project status"],
    enum: ["Drafted", "In Progress", "Completed"],
  },
  startDate: {
    type: Date,
  },
  endDate: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  customer: {
    type: mongoose.Schema.ObjectId,
    ref: "Customer",
    required: true,
  },
});

// Create customer slug from name
ProjectSchema.pre("save", function (next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

module.exports = mongoose.model("Project", ProjectSchema);
