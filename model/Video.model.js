const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VideoSchema = new Schema(
	{
		url: {type:String, required: [true, `Field 'url' must be filled.`]},
		title: String,
		alt: String,
		mediaKey: String,
		isHomePage: { type: Boolean, default: false },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('video', VideoSchema);
