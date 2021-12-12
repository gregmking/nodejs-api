const express = require("express");
const {
  getUsers,
  getUser
} = require("../controllers/users");

const User = require('../models/User');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router();

const { protect } = require('../middleware/auth');

router.route("/").get(protect, advancedResults(User), getUsers);
router
  .route("/:userId")
  .get(protect, getUser);

module.exports = router;