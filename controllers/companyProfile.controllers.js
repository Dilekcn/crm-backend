const mongoose = require('mongoose');

const CompanyProfileModel = require('../model/CompanyProfile');

exports.getAll = async (req, res) => {
	try {
		const response = await CompanyProfileModel.find();
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.getSingle = async (req, res) => {
	await CompanyProfileModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err, status: false });
		} else {
			res.json({ data, status: true });
		}
	});
};

exports.create = async (req, res) => {
	const { logo, phones, address, socialMediaId, email, isActive, isDeleted } = req.body;

	const companyProfile = await new CompanyProfileModel({
		logo,
		phones,
		address,
		socialMediaId,
		email,
		isActive,
		isDeleted,
	});

	companyProfile
		.save()
		.then((response) =>
			res.json({
				status: true,
				message: 'Added new company profile successfully.',
				response,
			})
		)
		.catch((error) => res.json({ status: false, message: error }));
};

exports.update = async (req, res) => {
	await CompanyProfileModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{ $set: req.body }
	)
		.then((data) =>
			res.json({
				status: true,
				message: 'Updated company profile successfully',
				data,
			})
		)
		.catch((err) => res.json({ status: false, message: err }));
};

exports.delete = async (req, res) => {
	await CompanyProfileModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) =>
			res.json({
				status: true,
				message: 'Deleted company profile successfully',
				data,
			})
		)
		.catch((err) => res.json({ status: false, message: err }));
};
