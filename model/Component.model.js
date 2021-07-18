const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComponentsSchema = new Schema(
	{
		secTitle: { type: String, required: true },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false }, 
	},
	{ timestamps: true }
);

module.exports = mongoose.model('component', ComponentsSchema);
