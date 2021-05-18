const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SliderSchema = new Schema(
	{
		title: { type: String, required: true, unique: true },
		subtitle: { type: String, required: true },
		url: { type: String, required: true },
		buttonText: { type: String, required: true },
		order: { type: Number, required: true }, 
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		mediaId: { type: String, required: true },
		isVideo: { type: Boolean, required: true },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('slider', SliderSchema);
