const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ExpertSchema = new Schema(
	{
		firstname: String,
		lastname: String,
		expertise: String,
		mediaId: mongoose.Schema.Types.ObjectId,
		socialMediaId: mongoose.Schema.Types.ObjectId,
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('expert', ExpertSchema);
