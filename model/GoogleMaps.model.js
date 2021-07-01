const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoogleMapsSchema = new Schema(
	{
		address: { type: String },
		lat: { type: Number },
		lng: { type: Number },
		infoText: { type: String },
		markerName: { type: String },
	},
	{ timestamps: true }
);

module.exports = mongoose.model('googlemap', GoogleMapsSchema);
