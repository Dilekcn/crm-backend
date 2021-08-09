const GoogleMapsModel = require('../model/GoogleMaps.model');
const mongoose = require('mongoose');

exports.getAll = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await GoogleMapsModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await GoogleMapsModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (err) {
		next({ status: 404, message: err });
	}
};

exports.getSingleGoogleMapById = async (req, res, next) => {
	if (mongoose.isValidObjectId(req.params.id)) {
		await GoogleMapsModel.findById({ _id: req.params.id })
			.then(async (isExist) => {
				if (isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Google Maps Model.',
					});
				} else {
					await GoogleMapsModel.findById(
						{ _id: req.params.id },
						(err, data) => {
							if (err) {
								next({ status: 404, message: err });
							} else {
								res.json({ status: 200, data });
							}
						}
					);
				}
			})
			.catch((err) => next({ status: 500, message: err }));
	} else {
		next({ status: 400, message: 'Object Id is not valid.' });
	}
};

exports.createGoogleMaps = (req, res, next) => {
	const newGoogleMaps = new GoogleMapsModel({
		address: req.body.address,
		lat: req.body.lat,
		lng: req.body.lng,
		infoText: req.body.infoText,
		markerName: req.body.markerName,
		iframesrc: req.body.iframesrc,
	});

	newGoogleMaps
		.save()
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => next({ status: 400, message: err }));
};

exports.updateGoogleMapsById = async (req, res, next) => {
	if (mongoose.isValidObjectId(req.params.id)) {
		await GoogleMapsModel.findById({ _id: req.params.id })
			.then(async (isExist) => {
				if (isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Google Maps Model.',
					});
				} else {
					const id = req.params.id;
					GoogleMapsModel.findByIdAndUpdate({ _id: id }, { $set: req.body })
						.then((data) => res.json({ status: 200, data }))
						.catch((err) => next({ status: 404, message: err }));
				}
			})
			.catch((err) => next({ status: 500, message: err }));
	} else {
		next({ status: 400, message: 'Object Id is not valid.' });
	}
};

exports.removeGoogleMapsById = async (req, res, next) => {
	if (mongoose.isValidObjectId(req.params.id)) {
		await GoogleMapsModel.findById({ _id: req.params.id })
			.then(async (isExist) => {
				if (isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Google Maps Model.',
					});
				} else {
					const id = req.params.id;
					GoogleMapsModel.findByIdAndDelete({ _id: id })
						.then((data) => res.json({ status: 200, data }))
						.catch((err) => next({ status: 404, message: err }));
				}
			})
			.catch((err) => next({ status: 500, message: err }));
	} else {
		next({ status: 400, message: 'Object Id is not valid.' });
	}
};
