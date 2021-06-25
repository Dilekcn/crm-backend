const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompanyProfileSchema = new Schema(
	{
		name: String,
		logo: String,
		phones: Array,
		address: String,
		socialMediaId: [{ type: Schema.Types.ObjectId, ref: 'social' }],
		email: String,
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('companyprofile', CompanyProfileSchema);