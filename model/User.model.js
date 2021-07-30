const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema(
	{
		firstname: { type: String, required: [true, `Field 'firstname' must be filled.`]  },
		lastname: { type: String, required: [true, `Field 'lastname' must be filled.`]  },
		email: {type: String, required: true, unique: true, required: [true, `Field 'email' must be filled.`]},
		password: { type: String, required: [true, `Field 'password' must be filled.`] },
		roleId: { type: Schema.Types.ObjectId, ref: 'role' },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		mediaId: { type: Schema.Types.ObjectId, ref: 'media' },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('user', UserSchema);
