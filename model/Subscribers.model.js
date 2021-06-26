const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubscribersModel = new Schema(
	{
		email: { type: String, unique: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('subscribers', SubscribersModel);
