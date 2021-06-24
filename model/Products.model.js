const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema(
	{
		title: { type: String },
		order: { type: Number },
		coverImageId: Schema.Types.ObjectId,
		isHomePage: { type: Boolean, default: false },
		content: { type: String },
		shortDescription: { type: String },
		buttonText: { type: String },
		userId: Schema.Types.ObjectId,
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		isBlog: { type: Boolean, default: false },
		isAboveFooter: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('product', ProductsSchema);
