const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpertSchema = new Schema({
	firstname: { type: String, required: true },
	lastname: { type: String, required: true },
	expertise: { type: String, required: true },
	isActive: { type: Boolean, default: true },
	isDeleted: { type: Boolean, default: false },
});

module.exports = mongoose.model('expert', ExpertSchema);
