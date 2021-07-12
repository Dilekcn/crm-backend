const GoogleMapsModel = require('../model/GoogleMaps.model');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await GoogleMapsModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await GoogleMapsModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (err) {
		res.json({ status: 404, message: err });
	}
};

exports.createGoogleMaps = (req, res) => {
	const newGoogleMaps = new GoogleMapsModel({
		address: req.body.address,
		lat: req.body.lat,
		lng: req.body.lng,
		infoText: req.body.infoText,
		markerName: req.body.markerName,
	});

	newGoogleMaps
		.save()
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.updateGoogleMapsById = (req, res) => {
	const id = req.params.id;
	GoogleMapsModel.findByIdAndUpdate({ _id: id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeGoogleMapsById = (req, res) => {
	const id = req.params.id;
	GoogleMapsModel.findByIdAndDelete({ _id: id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};
