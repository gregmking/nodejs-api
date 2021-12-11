const express = require("express");
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject
} = require("../controllers/projects");

const Project = require('../models/Project');
const advancedResults = require('../middleware/advancedResults');

const router = express.Router({ mergeParams: true });

const { protect } = require('../middleware/auth');

router.route("/").get(protect, advancedResults(Project, {
  path: 'customer',
  select: 'name status'
}), getProjects).post(protect, createProject);
router.route("/:id").get(protect, getProject).put(protect, updateProject).delete(protect, deleteProject);

module.exports = router;