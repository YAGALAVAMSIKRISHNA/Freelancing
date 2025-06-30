const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const authMiddleware = require('../middleware/auth');

// Get all projects
router.get('/', authMiddleware, async (req, res) => {
  try {
    const projects = await Project.find().populate('client', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get client’s projects
router.get('/my-projects', authMiddleware, async (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({ message: 'Access denied' });
  try {
    const projects = await Project.find({ client: req.user.id }).populate('client', 'name email');
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create a project
router.post('/', authMiddleware, async (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({ message: 'Access denied' });
  const { title, description, budget, category } = req.body;
  try {
    const project = new Project({ title, description, budget, category, client: req.user.id });
    await project.save();
    res.status(201).json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Submit project deliverable
router.post('/:id/submit', authMiddleware, async (req, res) => {
  if (req.user.role !== 'freelancer') return res.status(403).json({ message: 'Access denied' });
  const { fileUrl } = req.body;
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    project.submissions.push({ fileUrl, submittedBy: req.user.id, submittedAt: new Date() });
    await project.save();
    res.json(project);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;