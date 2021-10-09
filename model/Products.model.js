const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema(
	{
		title: { type: String, required: [true, `Field 'title' must be filled.`] },
		order: { type: Number },
		mediaId: { type: Schema.Types.ObjectId, ref: 'media' },
		videoId: { type: Schema.Types.ObjectId, ref: 'video' },
		isHomePage: { type: Boolean, default: false },
		content: { type: String, required: [true, `Field 'content' must be filled.`] },
		shortDescription: { type: String, required: [true, `Field 'shortDescription' must be filled.`] },
		buttonText: { type: String, required: [true, `Field 'buttonText' must be filled.`] },
		userId: { type: Schema.Types.ObjectId, ref: 'user' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		isBlog: { type: Boolean, default: false },
		isAboveFooter: { type: Boolean, default: false }, 
	},
	{ timestamps: true } 
);

module.exports = mongoose.model('product', ProductsSchema); 
