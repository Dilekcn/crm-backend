const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogsSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'user' },
		title: { type: String, required: true },
		content: { type: String},
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false }, 
	},
	{ timestamps: true }
); 

module.exports = mongoose.model('blog', BlogsSchema); 