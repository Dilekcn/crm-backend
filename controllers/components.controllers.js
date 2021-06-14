const mongoose = require('mongoose');
const ComponentModel = require('../model/Component');

exports.getAllComponents = async (req, res) => {
	try {
		const response = await ComponentModel.find();
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};
