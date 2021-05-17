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

exports.createExpert = async (req, res) => {
	const { firstname, lastname, expertise, isActive, isDeleted } = req.body;
	const newExpert = await new ExpertModel({
		firstname,
		lastname,
		expertise,
		isActive,
		isDeleted,
	});
	newExpert
		.save()
		.then((response) =>
			res.json({
				status: true,
				message: 'Added new expert successfully.',
				response,
			}),
		)
		.catch((error) => res.json({ status: false, message: error }));
};

exports.getSingleExpert = async (req, res) => {
	await ExpertModel.findById({ _id: req.params.expertid }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getExpertsByFirstname = async (req, res) => {
	await ExpertModel.find({ firstname: req.params.firstname }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getExpertsByLastname = async (req, res) => {
	await ExpertModel.find({ lastname: req.params.lastname }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getExpertsByExpertise = async (req, res) => {
	await ExpertModel.find({ expertise: req.params.expertise }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};
