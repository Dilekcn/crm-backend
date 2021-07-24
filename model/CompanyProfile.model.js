const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompanyProfileSchema = new Schema(
	{
		name: { type: String, required: [true, `Field 'name' must be filled.`] },
		logo: { type: Schema.Types.ObjectId, ref: 'media' },
		phones: [{ type: String, required: true }],
		address: String,
		socialMediaId: [{ type: Schema.Types.ObjectId, ref: 'social', default: [] }],
		email: { type: String, required: [true, `Field 'email' must be filled.`] },
		copyright: String,
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('companyprofile', CompanyProfileSchema);
