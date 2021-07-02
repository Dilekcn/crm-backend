const GoogleMapsModel = require('../model/GoogleMaps.model');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await GoogleMapsModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await GoogleMapsModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (err) {
		res.json({ status: 404, message: err });
	}
};

exports.createFooter = (req, res) => {
	const newFooter = new GoogleMapsModel({
		address: req.body.address,
		lat: req.body.lat,
		lng: req.body.lng,
		infoText: req.body.infoText,
		markerName: req.body.markerName,
	});

	newFooter
		.save()
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.updateFooterById = (req, res) => {
	const id = req.params.id;
	GoogleMapsModel.findByIdAndUpdate({ _id: id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeFooterById = (req, res) => {
	const id = req.params.id;
	GoogleMapsModel.findByIdAndDelete({ _id: id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};
