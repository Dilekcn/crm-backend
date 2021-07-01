const mongoose = require('mongoose');

const CompanyProfileModel = require('../model/CompanyProfile.model');
const SocialMedia = require('../model/SocialMedia.model');

exports.getAll = async (req, res) => {
	try {
		const {page = 1, limit} = req.query
		const response = await CompanyProfileModel.find().limit(limit * 1).skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('socialMediaId', 'title link');
			const total = await CompanyProfileModel.find().count()
		const pages = limit === undefined ? 1 : Math.ceil(total / limit)
		res.json({ total:total, pages, response});
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
	}).populate('socialMediaId', 'title link');
};

exports.create = async (req, res) => {
	const newSocialMedia = await req.body.socialMediaId.map((sm) => {
		return new SocialMedia({
			title: sm.title || null,
			link: sm.link || null,
		});
	});

	console.log(req.body.socialMediaId);

	newSocialMedia.map((sm) => sm.save());

	const socialMediaIds = newSocialMedia.map((sm) => sm._id);

	const { name, logo, phones, address, email, isActive, isDeleted } = req.body;

	const companyProfile = await new CompanyProfileModel({
		name,
		logo,
		phones,
		address,
		socialMediaId: socialMediaIds,
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
	await CompanyProfileModel.findById({ _id: req.params.id })
		.then(async (companyprofile) => {
			await companyprofile.socialMediaId.map(async (SMId, index) => {
				await SocialMedia.findByIdAndUpdate(
					{ _id: SMId },
					{
						$set: req.body.socialMediaId[index],
					},
					{ useFindAndModify: false, new: true }
				);
			});

			const { name, logo, phones, address, email } = req.body;

			await CompanyProfileModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					name,
					logo,
					phones,
					address,
					socialMediaId: companyprofile.socialMediaId,
					email,
					isActive: !req.body.isActive ? true : req.body.isActive,
					isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
				}
			)
				.then((companyprofile) =>
					res.json({
						status: true,
						message: 'Company profile is updated successfully',
						companyprofile,
					})
				)
				.catch((err) => res.json({ status: false, message: err }));
		})
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.delete = async (req, res) => {
	await CompanyProfileModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) =>
			res.json({
				status: true,
				message: 'Company profile is deleted successfully',
				data,
			})
		)
		.catch((err) => res.json({ status: false, message: err }));
};
