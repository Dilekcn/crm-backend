const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompanyProfileSchema = new Schema(
	{
		logo: { type: String },
		phones: { type: Array },
		address: { type: String },
		socialMediaId: [{ type: Schema.Types.ObjectId, ref: 'social' }],
		email: { type: String },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('companyprofile', CompanyProfileSchema);
