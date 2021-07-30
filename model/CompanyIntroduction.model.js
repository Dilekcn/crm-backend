const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanyIntroductionSchema = new Schema(
	{
		title: { type: String, required: [true, `Field 'title' must be filled.`]},
		subTitle: { type: String },
		iconName: { type: String },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		shortDescription: { type: String, required: [true, `Field 'shortDescription' must be filled.`] },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('companyIntroduction', CompanyIntroductionSchema);
