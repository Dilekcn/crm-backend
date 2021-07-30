const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SliderSchema = new Schema(
	{
		title: { type: String, unique: true, required: [true, `Field 'title' must be filled.`]  },
		subtitle: { type: String },
		url: { type: String },
		buttonText: { type: String },
		order: { type: Number },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		mediaId: { type: Schema.Types.ObjectId, ref: 'media' },
		isVideo: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('slider', SliderSchema);
