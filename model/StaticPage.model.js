const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StaticPageSchema = new Schema(
	{
		name: { type: String, unique: true },
		content: String,
		mediaId: { type: Schema.Types.ObjectId, ref: 'media' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('staticPage', StaticPageSchema);
