const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RolesSchema = new Schema(
	{
		name: { type: String, unique: [true, `Field 'name' must be unique.`], required: [true, `Field 'name' must be filled.`] },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('role', RolesSchema);
