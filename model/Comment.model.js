const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentsSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'user' },
		title: { type: String, required: [true, `Field 'title' must be filled.`]  },
		content: { type: String, required: [true, `Field 'content' must be filled.`]  },
		isActive: { type: Boolean, default: true },
		reasonToBlock:{ type: String, default: '' },
		isDeleted: { type: Boolean, default: false }, 
	},
	{ timestamps: true }
);

module.exports = mongoose.model('comment', CommentsSchema);
