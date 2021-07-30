const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaticPageSchema = new Schema(
	{
		name: { type: String, unique: true, required: [true, `Field 'name' must be filled.`] },
		content: {type:String, required: [true, `Field 'content' must be filled.`]},
		mediaId: { type: Schema.Types.ObjectId, ref: 'media' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		alt: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('staticPage', StaticPageSchema);
