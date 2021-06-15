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
	const { firstname, lastname, expertise, mediaId, socialMediaLinks, isActive, isDeleted } = req.body;
	const newExpert = await new ExpertModel({
		firstname,
		lastname,
		expertise,
		mediaId,
		socialMediaLinks,
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
			})
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

exports.updateExpert = async (req, res) => {
	await ExpertModel.findByIdAndUpdate({ _id: req.params.expertid }, { $set: req.body })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.removeExpert = async (req, res) => {
	await ExpertModel.findByIdAndDelete({ _id: req.params.expertid })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
