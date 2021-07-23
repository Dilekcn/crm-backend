const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionsSchema = new Schema(
	{
		secTitle: { type: String, required: true },
		isActive: { type: Boolean, default: true },
		secType: { type: String, required: true },
	},
	{ timestamps: true }
); 

module.exports = mongoose.model('section', SectionsSchema);
