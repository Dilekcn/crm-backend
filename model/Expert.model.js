const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpertSchema = new Schema(
	{
		firstname: { type: String },
		lastname: String,
		expertise: String,
		mediaId: { type: Schema.Types.ObjectId, ref: 'media' },
		socialMediaId: [{ type: Schema.Types.ObjectId, ref: 'social',default:[] }],
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		alt: { type: String },
	}, 
	{ timestamps: true }
);

module.exports = mongoose.model('expert', ExpertSchema);
