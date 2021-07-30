const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessagesSchema = new Schema(
	{
		firstname: { type: String },
		lastname: { type: String },
		subject: { type: String },
		content: { type: String, required: [true, `Field 'content' must be filled.`]  },
		email: { type: String, required: [true, `Field 'email' must be filled.`]  },
		phoneNumber: String,
		isActive: { type: Boolean, default: true },
		isRead: { type: Boolean, default: false },
		isDeleted: { type: Boolean, default: false },
		isReplied: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('message', MessagesSchema);
