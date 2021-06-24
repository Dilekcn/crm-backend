const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanyIntroductionSchema = new Schema(
	{
		title: { type: String, unique: true },
		subTitle: { type: String },
		iconName: { type: String },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		shortDescription: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('companyIntroduction', CompanyIntroductionSchema);
