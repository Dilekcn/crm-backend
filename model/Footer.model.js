const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FooterSchema = new Schema(
	{
		logo: { type: Schema.Types.ObjectId, ref: 'media' },
		address: { type: String },
		email: { type: String },
		phone: { type: String },
		socialMediaId: [{ type: Schema.Types.ObjectId, ref: 'social' }],
		copyright: { type: String },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('footer', FooterSchema);
