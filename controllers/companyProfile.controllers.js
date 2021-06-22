const mongoose = require('mongoose');

const CompanyProfileModel = require('../model/CompanyProfile.model');
const SocialMedia = require('../model/SocialMedia.model');

exports.getAll = async (req, res) => {
	try {
		const response = await CompanyProfileModel.find()
			.sort({ createdAt: -1 })
			.populate('socialMediaId', 'title link');
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
	const newSocialMedia = await req.body.socialMediaId.map((sm) => {
		return new SocialMedia({
			title: sm.title || null,
			link: sm.link || null,
		});
	});

	newSocialMedia.map((sm) => sm.save());

	const socialMediaIds = newSocialMedia.map((sm) => sm._id);

	//for Single ObjectId
	// const newSocialMediaId = await new SocialMediaId({
	// 	title: req.body.title || null,
	// 	link: req.body.link || null,
	// });

	// newSocialMediaId.save(newSocialMediaId);

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
	await CompanyProfileModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{ $set: req.body },
		{ useFindAndModify: false, new: true }
	)
		.then(async (companyprofile) => {
			await companyprofile.socialMediaId.map((socialMediaId, index) => {
				console.log(companyprofile.socialMediaId);
				console.log(socialMediaId);
				return SocialMedia.findByIdAndUpdate(
					socialMediaId,
					{
						$set: {
							title: req.body.socialMediaId[index].title,
							link: req.body.socialMediaId[index].link,
						},
					},
					{ useFindAndModify: false, new: true }
				).then((newSocialMediaId) => {
					res.send(newSocialMediaId);
				});
			});
		})
		.then((companyprofile) =>
			res.json({
				status: true,
				message: 'Updated company profile successfully',
				companyprofile,
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
