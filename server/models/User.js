const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['freelancer', 'client', 'admin'], required: true },
  name: { type: String, required: true },
  skills: [{ type: String }],
  portfolio: [{ title: String, description: String, link: String }],
  reviews: [{ rating: Number, comment: String, reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } }],
  approved: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);