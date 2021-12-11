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

router.route("/").get(advancedResults(Customer, 'projects'), getCustomers).post(createCustomer);
router.route('/radius/:zipcode/:distance').get(getCustomersInRadius);
router
  .route("/:id")
  .get(getCustomer)
  .put(updateCustomer)
  .delete(deleteCustomer);

module.exports = router;