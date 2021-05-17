const mongoose = require('mongoose');
const ExpertModel = require('../model/Expert.model');

exports.getAllExperts = async (req, res) => {
	try {
		const response = await ExpertModel.find();
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};
