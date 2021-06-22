const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComponentSchema = new Schema(
	{
		title: { type: String},
		subtitle: { type: String},
		isActive: { type: Boolean, default: true },
		isHomePage: { type: Boolean, default: false },
        isDeleted: { type: Boolean, default: false },
        
	},
	{ timestamps: true },
);

module.exports = mongoose.model('component', ComponentSchema); 