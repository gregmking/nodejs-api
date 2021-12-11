const Project = require("../models/Project");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Customer = require("../models/Customer");

// @desc        Get all projects
// @route       GET /api/v1/projects
// @route       GET /api/v1/customers/:customerId/projects
// @access      Private
exports.getProjects = asyncHandler(async (req, res, next) => {
  if (req.params.customerId) {
    const projects = await Project.find({ customer: req.params.customerId });

    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } else {
    res.status(200).json(advancedResults);
  }
});

// @desc        Get single project
// @route       GET /api/v1/projects/:id
// @access      Private
exports.getProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id).populate({
    path: "customer",
    select: "name status",
  });

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc        Create project
// @route       POST /api/v1/customers/:customerId/projects
// @access      Private
exports.createProject = asyncHandler(async (req, res, next) => {
  req.body.customer = req.params.customerId;

  const customer = await Customer.findById(req.params.customerId);

  if (!customer) {
    return next(
      new ErrorResponse(
        `No customer found with id of ${req.params.customerId}`
      ),
      404
    );
  }

  const project = await Project.create(req.body);

  res.status(201).json({
    success: true,
    data: project,
  });
});

// @desc        Update project
// @route       PUT /api/v1/projects/:id
// @access      Private
exports.updateProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: project,
  });
});

// @desc        Delete project
// @route       DELETE /api/v1/projects/:id
// @access      Private
exports.deleteProject = asyncHandler(async (req, res, next) => {
  const project = await Project.findById(req.params.id);

  if (!project) {
    return next(
      new ErrorResponse(`Project not found with id of ${req.params.id}`, 404)
    );
  }

  await project.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});
