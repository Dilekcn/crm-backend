const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscribersModel = new Schema(
	{
		email: { type: String, unique: true, required: [true, `Field 'email' must be filled.`] },
		name: String,
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('subscribers', SubscribersModel);
