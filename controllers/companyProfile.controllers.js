const CompanyProfileModel = require('../model/CompanyProfile.model');
const SocialMediaModel = require('../model/SocialMedia.model');
const MediaModel = require('../model/Media.model');
const mongoose = require('mongoose');

exports.getAll = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await CompanyProfileModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('socialMediaId', 'title link')
			.populate('logo', 'url title alt');
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
	})
		.populate('socialMediaId', 'title link')
		.populate('logo', 'url title alt');
};

exports.create = async (req, res) => {
	if (req.body.socialMediaId) {
		const newSocialMedia =
			typeof req.body.socialMediaId === 'string'
				? await JSON.parse(req.body.socialMediaId).map((sm) => {
						return new SocialMediaModel({
							title: sm.title || null,
							link: sm.link || null,
						});
				  })
				: req.body.socialMediaId.map((sm) => {
						return new SocialMediaModel({
							title: sm.title || null,
							link: sm.link || null,
						});
				  });

		newSocialMedia.map((sm) => sm.save());

		const socialMediaIds = newSocialMedia.map((sm) => sm._id);
		if (req.files) {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'company-logo',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { name, address, email, isActive, isDeleted } = req.body;

				const newCompanyProfile = new CompanyProfileModel({
					name,
					logo: newMedia._id,
					address,
					email,
					phones:
						typeof req.body.phones === 'string'
							? JSON.parse(req.body.phones)
							: req.body.phones,
					socialMediaId: socialMediaIds,
					isActive,
					isDeleted,
				});

				newCompanyProfile
					.save()
					.then((data) =>
						res.json({
							status: 200,
							message: 'New company profile is created successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			};
			await S3.uploadNewLogo(req, res, data);
		} else if (req.body.logo) {
			const { name, address, email, isActive, isDeleted, logo } = req.body;

			const newCompanyProfile = new CompanyProfileModel({
				name,
				logo,
				address,
				email,
				phones:
					typeof req.body.phones === 'string'
						? JSON.parse(req.body.phones)
						: req.body.phones,
				socialMediaId: socialMediaIds,
				isActive,
				isDeleted,
			});

			newCompanyProfile
				.save()
				.then((data) =>
					res.json({
						status: 200,
						message: 'New company profile is created successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		} else {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'company-logo',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { name, address, email, phone, isActive, isDeleted } = req.body;

				const newCompanyProfile = new CompanyProfileModel({
					name,
					logo: newMedia._id,
					address,
					email,
					phone,
					socialMediaId: socialMediaIds,
					isActive,
					isDeleted,
				});

				newCompanyProfile
					.save()
					.then((data) =>
						res.json({
							status: 200,
							message: 'New company profile is created successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			};
			await S3.uploadNewLogo(req, res, data);
		}
	} else {
		if (req.files) {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'company-logo',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { address, email, phone, name, isActive, isDeleted } = req.body;

				const newCompanyProfile = new CompanyProfileModel({
					logo: newMedia._id,
					address,
					email,
					phone,
					name,
					isActive,
					isDeleted,
				});

				newCompanyProfile
					.save()
					.then((data) =>
						res.json({
							status: 200,
							message: 'New company profile is created successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			};
			await S3.uploadNewLogo(req, res, data);
		} else if (req.body.logo) {
			const { address, email, phone, name, isActive, isDeleted, logo } = req.body;

			const newCompanyProfile = new CompanyProfileModel({
				logo,
				address,
				email,
				phone,
				name,
				isActive,
				isDeleted,
			});
			newCompanyProfile
				.save()
				.then((data) =>
					res.json({
						status: 200,
						message: 'New company profile is created successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		} else {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'company-logo',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { address, email, phone, name, isActive, isDeleted } = req.body;

				const newCompanyProfile = new CompanyProfileModel({
					logo: newMedia._id,
					address,
					email,
					phone,
					name,
					isActive,
					isDeleted,
				});

				newCompanyProfile
					.save()
					.then((data) =>
						res.json({
							status: 200,
							message: 'New company profile is created successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			};
			await S3.uploadNewLogo(req, res, data);
		}
	}
};

// exports.create = async (req, res, next) => {
// 	const newSocialMedia = typeof req.body.socialMediaId === 'string' ? await JSON.parse(req.body.socialMediaId).map((sm) => {
// 		return new SocialMedia({
// 			title: sm.title || null,
// 			link: sm.link || null,
// 		});
// 	}) : await req.body.socialMediaId.map((sm) => {
// 		return new SocialMedia({
// 			title: sm.title || null,
// 			link: sm.link || null,
// 		});
// 	});

// 	newSocialMedia.map((sm) => sm.save());

// 	const socialMediaIds = newSocialMedia.map((sm) => sm._id)

// 	const { name, logo, phones, address, email, isActive, isDeleted } = req.body;

// 	const companyProfile = await new CompanyProfileModel({
// 		name,
// 		logo,
// 		phones,
// 		address,
// 		socialMediaId: socialMediaIds,
// 		email,
// 		isActive,
// 		isDeleted,
// 	});

// 	companyProfile
// 		.save()
// 		.then((response) =>
// 			res.json({
// 				status: 200,
// 				message: 'Added a new company profile successfully.',
// 				response,
// 			})
// 		)
// 		.catch((error) => next({ status: 400, message: error }));
// };

exports.update = async (req, res, next) => {
	if (mongoose.isValidObjectId(req.params.id)) {
		await CompanyProfileModel.findById({ _id: req.params.id })
			.then(async (isExist) => {
				if (isExist === null) {
					next({
						status: 400,
						message: 'This Id is not exist in Company Profile Model.',
					});
				} else {
					if (req.files) {
						await CompanyProfileModel.findById({ _id: req.params.id })
							.then(async (companyprofile) => {
								await MediaModel.findById({
									_id: companyprofile.logo,
								}).then(async (media) => {
									const data = async (data) => {
										await MediaModel.findByIdAndUpdate(
											{
												_id: companyprofile.logo,
											},
											{
												$set: {
													url: data.Location || null,
													title: 'company-logo',
													mediaKey: data.Key,
													alt: req.body.alt,
												},
											},
											{ useFindAndModify: false, new: true }
										).catch((err) =>
											res.json({ status: 404, message: err })
										);
									};
									await S3.updateLogo(req, res, media.mediaKey, data);
								});

								await companyprofile.socialMediaId.map(
									async (SMId, index) => {
										await SocialMediaModel.findByIdAndUpdate(
											{ _id: SMId },
											{
												$set: JSON.parse(req.body.socialMediaId)[
													index
												],
											},
											{ useFindAndModify: false, new: true }
										);
									}
								);

								const { name, address, email } = req.body;

								await CompanyProfileModel.findByIdAndUpdate(
									{ _id: req.params.id },
									{
										$set: {
											name,
											logo: req.files
												? companyprofile.logo
												: req.body.logo,
											phones:
												typeof req.body.phones === 'string'
													? JSON.parse(req.body.phones)
													: req.body.phones,
											address,
											socialMediaId: companyprofile.socialMediaId,
											email,
											isActive: !req.body.isActive
												? true
												: req.body.isActive,
											isDeleted: !req.body.isDeleted
												? false
												: req.body.isDeleted,
										},
									}
								)
									.then((companyprofile) =>
										res.json({
											status: 200,
											message:
												'Company profile is updated successfully',
											companyprofile,
										})
									)
									.catch((err) =>
										res.json({ status: 404, message: err })
									);
							})
							.catch((err) => res.json({ status: 404, message: err }));
					} else {
						await CompanyProfileModel.findById({ _id: req.params.id })
							.then(async (companyprofile) => {
								await companyprofile.socialMediaId.map(
									async (SMId, index) => {
										await SocialMediaModel.findByIdAndUpdate(
											{ _id: SMId },
											{
												$set: req.body.socialMediaId[index],
											},
											{ useFindAndModify: false, new: true }
										);
									}
								);

								const { name, address, email, logo } = req.body;

								await CompanyProfileModel.findByIdAndUpdate(
									{ _id: req.params.id },
									{
										$set: {
											name,
											logo: !logo ? companyprofile.logo : logo,
											phones: req.body.phones
												? typeof req.body.phones === 'string'
													? JSON.parse(req.body.phones)
													: req.body.phones
												: companyprofile.phones,
											address,
											socialMediaId: companyprofile.socialMediaId,
											email,
											isActive: !req.body.isActive
												? true
												: req.body.isActive,
											isDeleted: !req.body.isDeleted
												? false
												: req.body.isDeleted,
										},
									},
									{ useFindAndModify: false, new: true }
								)
									.then((companyprofile) =>
										res.json({
											status: 200,
											message:
												'Company profile is updated successfully',
											companyprofile,
										})
									)
									.catch((err) =>
										res.json({ status: 404, message: err })
									);
							})
							.catch((err) => res.json({ status: 404, message: err }));
					}
				}
			})
			.catch((err) => next({ status: 404, message: err }));
	} else {
		next({ status: 400, message: 'Object Id is not valid.' });
	}
};

exports.delete = async (req, res, next) => {
	await CompanyProfileModel.findById({ _id: req.params.id })
		.then(async (isExist) => {
			if (isExist === null) {
				return next({
					status: 400,
					message: 'This Id is not exist in Company Profile Model.',
				});
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
