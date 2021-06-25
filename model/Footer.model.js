const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FooterSchema = new Schema(
	{
		logo: { type: String },
		address: { type: String },
		email: { type: String },
		phone: { type: String },
		socialMediaLinks: [{ type: Schema.Types.ObjectId, ref: 'social' }],
		copyright: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('footer', FooterSchema);
