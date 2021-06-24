const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MenusSchema = new Schema(
	{
		parentId: { type: Number },
		text: { type: String },
		link: { type: String },
		iconClassName: { type: String },
		order: { type: Number },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('menu', MenusSchema);
