const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Project = require('../models/Project');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');

// Get messages for a project
router.get('/:projectId', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (![project.client.toString(), ...await Bid.find({ project: req.params.projectId, status: 'accepted' }).select('freelancer')].includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const messages = await Message.find({ project: req.params.projectId }).populate('sender', 'name');
    res.json(messages);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Send a message
router.post('/:projectId', authMiddleware, async (req, res) => {
  const { content } = req.body;
  try {
    const project = await Project.findById(req.params.projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });
    if (![project.client.toString(), ...await Bid.find({ project: req.params.projectId, status: 'accepted' }).select('freelancer')].includes(req.user.id)) {
      return res.status(403).json({ message: 'Access denied' });
    }
    const message = new Message({ project: req.params.projectId, sender: req.user.id, content });
    await message.save();
    // Notify other party
    const recipientId = project.client.toString() === req.user.id
      ? (await Bid.findOne({ project: req.params.projectId, status: 'accepted' }))?.freelancer
      : project.client;
    if (recipientId) {
      await new Notification({
        user: recipientId,
        type: 'new_message',
        message: `New message in project: ${project.title}`,
        project: project._id,
      }).save();
    }
    res.status(201).json(message);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;