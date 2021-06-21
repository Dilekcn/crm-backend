const mongoose = require('mongoose');

const CompanyProfileModel = require('../model/CompanyProfile.model');
const SocialMediaId = require('../model/SocialMedia.model');

exports.getAll = async (req, res) => {
	try {
		const response = await CompanyProfileModel.find().populate(
			'socialMediaId',
			'title link'
		);
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
	const sm = req.body.sm;

	const smArray = await sm.map((sm, index) => {
		return (index = new SocialMediaId({
			title: sm[0] || null,
			link: sm[1] || null,
		}));
	});

	smArray.map((sm) => sm.save());

	console.log(sm);
	console.log(smArray);
	console.log(smArray.map((sm) => sm._id));

	const smIDs = smArray.map((sm) => sm._id);

	// const newSocialMediaId = await new SocialMediaId({
	// 	title: req.body.title || null,
	// 	link: req.body.link || null,
	// });

	const { logo, phones, address, email, isActive, isDeleted } = req.body;

	// newSocialMediaId.save(newSocialMediaId);

	const companyProfile = await new CompanyProfileModel({
		logo,
		phones,
		address,
		socialMediaId: smIDs,
		email,
		isActive,
		isDeleted,
	});

	companyProfile
		.save()
		.then((response) =>
			res.json({
				status: true,
				message: 'Added a new company profile successfully.',
				response,
			})
		)
		.catch((error) => res.json({ status: false, message: error }));
	console.log(companyProfile);
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
