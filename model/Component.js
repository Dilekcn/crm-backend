const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ComponentsSchema = new Schema(
	{
		name: { type: String, required: true, unique: true },
		componentId: { type: Schema.Types.ObjectId, required: true },
		description: { type: String },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('component', ComponentsSchema);
