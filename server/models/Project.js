const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  budget: { type: Number, required: true },
  category: { type: String, required: true },
  client: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: { type: String, enum: ['open', 'in-progress', 'completed'], default: 'open' },
  submissions: [{ fileUrl: String, submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, submittedAt: Date }],
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema);