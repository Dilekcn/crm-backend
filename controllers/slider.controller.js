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
