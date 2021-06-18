const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		firstname: { type: String, required: true },
		lastname: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		roleId: mongoose.Schema.Types.ObjectId, 
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false }
	},
	{ timestamps: true },
);

module.exports = mongoose.model('user', UserSchema);
