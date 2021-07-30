const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionsSchema = new Schema(
	{
		secTitle: { type: String, required: [true, `Field 'secTitle' must be filled.`] },
		isActive: { type: Boolean, default: true },
		secType: { type: String, required: [true, `Field 'secType' must be filled.`]  },
	},
	{ timestamps: true }
); 

module.exports = mongoose.model('section', SectionsSchema);
