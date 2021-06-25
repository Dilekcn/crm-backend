const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		roleId: { type: Schema.Types.ObjectId, ref: 'role' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		mediaId: { type: Schema.Types.ObjectId, ref: 'media' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('user', UserSchema);
