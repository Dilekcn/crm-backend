const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolesSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true },
);

module.exports = mongoose.model('role', RolesSchema);
