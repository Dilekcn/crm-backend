const mongoose = require('mongoose');
const SliderModel = require('../model/Slider.model');

exports.getAll = async (req, res) => {
	try {
		const response = await SliderModel.find();
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const {
		title,
		subtitle,
		url,
		buttonText,
		order,
		isActive,
		isDeleted,
		mediaId,
		isVideo,
	} = req.body;

	const newSlide = await new SliderModel({
		title,
		subtitle,
		url,
		buttonText,
		order,
		isActive,
		isDeleted,
		mediaId,
		isVideo,
	});
	newSlide
		.save()
		.then((response) =>
			res.json({
				status: true,
				message: 'Added new slide successfully.',
				response,
			}),
		)
		.catch((error) => res.json({ status: false, message: error }));
};
