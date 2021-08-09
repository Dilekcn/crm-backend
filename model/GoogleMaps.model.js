const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GoogleMapsSchema = new Schema(
	{
		address: { type: String, required: [true, `Field 'address' must be filled.`] },
		lat: { type: Number, required: [true, `Field 'lat' must be filled.`] },
		lng: { type: Number, required: [true, `Field 'lng' must be filled.`] },
		infoText: { type: String },
		markerName: { type: String },
		iframesrc: String,
	},
	{ timestamps: true }
);

module.exports = mongoose.model('googlemap', GoogleMapsSchema);
