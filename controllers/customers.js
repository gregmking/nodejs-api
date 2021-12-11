const Customer = require("../models/Customer");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

// @desc        Get all customers
// @route       GET /api/v1/customers
// @access      Private
exports.getCustomers = asyncHandler(async (req, res, next) => {

  res.status(200).json(res.advancedResults);
});

// @desc        Get single customer
// @route       GET /api/v1/customers/:id
// @access      Private
exports.getCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: customer,
  });
});

// @desc        Create customer
// @route       POST /api/v1/customers
// @access      Private
exports.createCustomer = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.user = req.user.id;

  const customer = await Customer.create(req.body);

  res.status(201).json({
    success: true,
    data: customer,
  });
});

// @desc        Update customer
// @route       PUT /api/v1/customers/:id
// @access      Private
exports.updateCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: customer,
  });
});

// @desc        Delete customer
// @route       DELETE /api/v1/customers/:id
// @access      Private
exports.deleteCustomer = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer) {
    return next(
      new ErrorResponse(`Customer not found with id of ${req.params.id}`, 404)
    );
  }

  customer.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});

// @desc        Get customers within a radius
// @route       GET /api/v1/customers/radius/:zipcode/:distance
// @access      Private
exports.getCustomersInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get lat/lng from geocoder
  const loc = await geocoder.geocode(zipcode);
  const lat = loc[0].latitude;
  const lng = loc[0].longitude;

  // Calculate radius using radians
  // Divide distance by radius of Earth (3,963 mi / 6,378 km)
  const radius = distance / 3963;

  const customers = await Customer.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radius] } },
  });

  res.status(200).json({
    success: true,
    count: customers.length,
    data: customers,
  });
});
