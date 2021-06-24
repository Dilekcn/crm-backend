const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IconBoxSchema = new Schema(
	{
		contentName: String,
		routeName: String,
		title: { type: String },
		content: { type: String },
		author: { type: String },
		iconName: { type: String },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('iconBox', IconBoxSchema);
