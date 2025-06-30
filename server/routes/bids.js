const express = require('express');
const router = express.Router();
const Bid = require('../models/Bid');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');

// Create a bid
router.post('/:projectId', authMiddleware, async (req, res) => {
  if (req.user.role !== 'freelancer') return res.status(403).json({ message: 'Access denied' });
  const { amount, timeline, portfolioLink, message } = req.body;
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    const bid = new Bid({ project: req.params.projectId, freelancer: req.user.id, amount, timeline, portfolioLink, message });
    await bid.save();
    // Notify client
    await new Notification({
      user: project.client,
      type: 'bid_placed',
      message: `New bid placed on your project: ${project.title}`,
      project: project._id,
    }).save();
    res.status(201).json(bid);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Accept a bid
router.patch('/:id/accept', authMiddleware, async (req, res) => {
  if (req.user.role !== 'client') return res.status(403).json({ message: 'Access denied' });
  try {
    const bid = await Bid.findById(req.params.id).populate('project');
    if (!bid) return res.status(404).json({ message: 'Bid not found' });
    if (bid.project.client.toString() !== req.user.id) return res.status(403).json({ message: 'Not authorized' });
    bid.status = 'accepted';
    await bid.save();
    // Notify freelancer
    await new Notification({
      user: bid.freelancer,
      type: 'bid_accepted',
      message: `Your bid on ${bid.project.title} was accepted`,
      project: bid.project._id,
    }).save();
    res.json(bid);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;