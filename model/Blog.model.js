const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BlogsSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'user', required: [true, `Field 'name' must be filled.`] },
		title: { type: String, required: [true, `Field 'name' must be filled.`] },
		content: { type: String, required: [true, `Field 'name' must be filled.`]},
		mediaId: { type: Schema.Types.ObjectId, ref: 'media' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('blog', BlogsSchema);
