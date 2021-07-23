const CompanyProfileModel = require('../model/CompanyProfile.model');
const SocialMedia = require('../model/SocialMedia.model');
const mongoose = require('mongoose')

exports.getAll = async (req, res,next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await CompanyProfileModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('socialMediaId', 'title link');
		const total = await CompanyProfileModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		next({ status: 404, message: error });
	}
};

exports.getSingle = async (req, res, next) => {
	await CompanyProfileModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			next({ message: err, status: 404 });
		} else {
			res.json({ data, status: 200 });
		}
	}).populate('socialMediaId', 'title link');
};

exports.create = async (req, res, next) => {
	const newSocialMedia = await req.body.socialMediaId.map((sm) => {
		return new SocialMedia({
			title: sm.title || null,
			link: sm.link || null,
		});
	});

	newSocialMedia.map((sm) => sm.save());

	const socialMediaIds = newSocialMedia.map((sm) => sm._id)

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
				status: 200,
				message: 'Added a new company profile successfully.',
				response,
			})
		)
		.catch((error) => next({ status: 400, message: error }));
};

exports.update = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await CompanyProfileModel.findById({_id:req.params.id})
		.then(async(isExist) => {
			if(isExist === null) {
				return next({status:400, message:'This Id is not exist in Company Profile Model'})
			} else {
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
						status: 200,
						message: 'Company profile is updated successfully',
						companyprofile,
					})
				)
				.catch((err) => next({ status: 404, message: err }));
		})
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => next({ status: 404, message: err }));
			}
		})
		.catch((err) => next({ status: 404, message: err }));
	} else {
		next({status:400, message:'Object Id is not valid.'})
	}
};

exports.delete = async (req, res, next) => {
	await CompanyProfileModel.findById({_id:req.params.id})
		.then(async(isExist) => {
			if(isExist === null) {
				return next({status:400, message:'This Id is not exist in Company Profile Model.'})
			} else {
				await CompanyProfileModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) =>
			res.json({
				status: 200,
				message: 'Company profile is deleted successfully',
				data,
			})
		)
		.catch((err) => next({ status: 404, message: err }));
			}
		})
		.catch((err) => next({ status: 404, message: err }));
	
};
