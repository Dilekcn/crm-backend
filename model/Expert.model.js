const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpertSchema = new Schema(
	{
		firstname: { type: String, required: [true, `Field 'firstname' must be filled.`] },
		lastname: {type:String, required: [true, `Field 'lastname' must be filled.`]},
		expertise: {type:String, required: [true, `Field 'expertise' must be filled.`]},
		mediaId: { type: Schema.Types.ObjectId, ref: 'media' },
		socialMediaId: [{ type: Schema.Types.ObjectId, ref: 'social', default: [] }],
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false }, 
		content: { type: String },
		alt: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('expert', ExpertSchema);
