const express = require("express");
const {
  getCustomers,
  getCustomersInRadius,
  getCustomer,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} = require("../controllers/customers");

const Customer = require('../models/Customer');
const advancedResults = require('../middleware/advancedResults');

// Include other resource routers
const projectRouter = require('./projects');

const router = express.Router();

// Re-route into other resource routers
router.use('/:customerId/projects', projectRouter);

const { protect } = require('../middleware/auth');

router.route("/").get(protect, advancedResults(Customer, 'projects'), getCustomers).post(protect, createCustomer);
router.route('/radius/:zipcode/:distance').get(protect, getCustomersInRadius);
router
  .route("/:id")
  .get(protect, getCustomer)
  .put(protect, updateCustomer)
  .delete(protect, deleteCustomer);

module.exports = router;