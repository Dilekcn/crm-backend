const GoogleMapsModel = require('../model/GoogleMaps.model');

exports.getAll = async (req, res) => {

	try {
		const {page = 1, limit} = req.query
		const response = await GoogleMapsModel.find().limit(limit * 1).skip((page - 1) * limit)
		.sort({ createdAt: -1 })
		res.json(res.json(data))
	} catch (err) {
		res.json({ message: err, status: false })
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
		.then((data) => res.json({ status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.updateFooterById = (req, res) => {
	const id = req.params.id;
	GoogleMapsModel.findByIdAndUpdate({ _id: id })
		.then((data) => res.json({ status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};

exports.removeFooterById = (req, res) => {
	const id = req.params.id;
	GoogleMapsModel.findByIdAndDelete({ _id: id })
		.then((data) => res.json({ status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};
