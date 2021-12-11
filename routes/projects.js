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

router.route("/").get(advancedResults(Project, {
  path: 'customer',
  select: 'name status'
}), getProjects).post(createProject);
router.route("/:id").get(getProject).put(updateProject).delete(deleteProject);

module.exports = router;