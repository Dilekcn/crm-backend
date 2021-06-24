const mongoose = require('mongoose');
const CompanyIntroductionModel = require('../model/CompanyIntroduction.model');

exports.getAll = async (req, res) => {
	try {
		const response = await CompanyIntroductionModel.find();
		res.json(response);
		CompanyIntroductionModel;
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.createIntroduction = async (req, res) => {
	const { title, subTitle, iconName, shortDescription, isActive, isDeleted } = req.body;

	const newIntroduction = await new CompanyIntroductionModel({
		title,
		subTitle,
		iconName,
		shortDescription,
		isActive,
		isDeleted,
	});
	newIntroduction
		.save()
		.then((response) =>
			res.json({
				status: true,
				message: 'Added new company introductions successfully.',
				response,
			})
		)
		.catch((error) => res.json({ status: false, message: error }));
};

exports.getSingleIntroduction = async (req, res) => {
	await CompanyIntroductionModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getSingleIntroductionByTitle = async (req, res) => {
	await CompanyIntroductionModel.findOne({ title: req.params.title }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.updateIntroductions = async (req, res) => {
	await CompanyIntroductionModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{ $set: req.body }
	)
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.removeIntroduction = async (req, res) => {
	await CompanyIntroductionModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
