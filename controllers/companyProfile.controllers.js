const CompanyProfileModel = require('../model/CompanyProfile.model');
const SocialMediaModel = require('../model/SocialMedia.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
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
		res.json({ status: 404, message: error });
	}
};

exports.getSingle = async (req, res) => {
	await CompanyProfileModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err, status: 404 });
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

				const { name, logo, address, email, isActive, isDeleted } = req.body;

				const newCompanyProfile = await new CompanyProfileModel({
					name,
					logo: newMedia._id,
					phones:
						typeof req.body.phones === 'string'
							? JSON.parse(req.body.phones)
							: req.body.phones,
					address,
					socialMediaId: socialMediaIds,
					email,
					isActive,
					isDeleted,
				});

				newCompanyProfile
					.save()
					.then((response) =>
						res.json({
							status: 200,
							message: 'Added a new company profile successfully.',
							response,
						})
					)
					.catch((error) => res.json({ status: 404, message: error }));
			};
			await S3.uploadNewLogo(req, res, data);
		} else if (req.body.logo) {
			const { name, logo, address, email, isActive, isDeleted } = req.body;

			const newCompanyProfile = await new CompanyProfileModel({
				name,
				logo,
				phones:
					typeof req.body.phones === 'string'
						? JSON.parse(req.body.phones)
						: req.body.phones,
				address,
				socialMediaId: socialMediaIds,
				email,
				isActive,
				isDeleted,
			});

			newCompanyProfile
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Added a new company profile successfully.',
						response,
					})
				)
				.catch((error) => res.json({ status: 404, message: error }));
		} else {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'company-logo',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { name, address, email, isActive, isDeleted } = req.body;

				const newCompanyProfile = await new CompanyProfileModel({
					name,
					logo: newMedia._id,
					phones:
						typeof req.body.phones === 'string'
							? JSON.parse(req.body.phones)
							: req.body.phones,
					address,
					socialMediaId: socialMediaIds,
					email,
					isActive,
					isDeleted,
				});

				newCompanyProfile
					.save()
					.then((response) =>
						res.json({
							status: 200,
							message: 'Added a new company profile successfully.',
							response,
						})
					)
					.catch((error) => res.json({ status: 404, message: error }));
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

				const { name, address, email, isActive, isDeleted } = req.body;

				const newCompanyProfile = await new CompanyProfileModel({
					name,
					logo: newMedia._id,
					phones:
						typeof req.body.phones === 'string'
							? JSON.parse(req.body.phones)
							: req.body.phones,
					address,
					email,
					isActive,
					isDeleted,
				});

				newCompanyProfile
					.save()
					.then((response) =>
						res.json({
							status: 200,
							message: 'Added a new company profile successfully.',
							response,
						})
					)
					.catch((error) => res.json({ status: 404, message: error }));
			};
			await S3.uploadNewLogo(req, res, data);
		} else if (req.body.logo) {
			const { name, logo, address, email, isActive, isDeleted } = req.body;

			const newCompanyProfile = await new CompanyProfileModel({
				name,
				logo,
				phones:
					typeof req.body.phones === 'string'
						? JSON.parse(req.body.phones)
						: req.body.phones,
				address,
				email,
				isActive,
				isDeleted,
			});

			newCompanyProfile
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Added a new company profile successfully.',
						response,
					})
				)
				.catch((error) => res.json({ status: 404, message: error }));
		} else {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'company-logo',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { name, address, email, isActive, isDeleted } = req.body;

				const newCompanyProfile = await new CompanyProfileModel({
					name,
					logo: newMedia._id,
					phones:
						typeof req.body.phones === 'string'
							? JSON.parse(req.body.phones)
							: req.body.phones,
					address,
					email,
					isActive,
					isDeleted,
				});

				newCompanyProfile
					.save()
					.then((response) =>
						res.json({
							status: 200,
							message: 'Added a new company profile successfully.',
							response,
						})
					)
					.catch((error) => res.json({ status: 404, message: error }));
			};
			await S3.uploadNewLogo(req, res, data);
		}
	}
};

exports.update = async (req, res) => {
	if (req.files) {
		await CompanyProfileModel.findById({ _id: req.params.id })
			.then(async (companyprofile) => {
				await MediaModel.findById({ _id: companyprofile.logo }).then(
					async (media) => {
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
							).catch((err) => res.json({ status: 404, message: err }));
						};
						await S3.updateLogo(req, res, media.mediaKey, data);
					}
				);

				await companyprofile.socialMediaId.map(async (SMId, index) => {
					await SocialMediaModel.findByIdAndUpdate(
						{ _id: SMId },
						{
							$set: JSON.parse(req.body.socialMediaId)[index],
						},
						{ useFindAndModify: false, new: true }
					);
				});

				const { name, address, email } = req.body;

				await CompanyProfileModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							name,
							logo: req.files ? companyprofile.logo : req.body.logo,
							phones:
								typeof req.body.phones === 'string'
									? JSON.parse(req.body.phones)
									: req.body.phones,
							address,
							socialMediaId: companyprofile.socialMediaId,
							email,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((companyprofile) =>
						res.json({
							status: 200,
							message: 'Company profile is updated successfully',
							companyprofile,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			})
			.catch((err) => res.json({ status: 404, message: err }));
	} else {
		await CompanyProfileModel.findById({ _id: req.params.id })
			.then(async (companyprofile) => {
				await companyprofile.socialMediaId.map(async (SMId, index) => {
					await SocialMediaModel.findByIdAndUpdate(
						{ _id: SMId },
						{
							$set: req.body.socialMediaId[index],
						},
						{ useFindAndModify: false, new: true }
					);
				});

				const { name, address, email, logo } = req.body;

				await CompanyProfileModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							name,
							logo: !logo ? companyprofile.logo : logo,
							phones:
								typeof req.body.phones === 'string'
									? JSON.parse(req.body.phones)
									: req.body.phones,
							address,
							socialMediaId: companyprofile.socialMediaId,
							email,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((companyprofile) =>
						res.json({
							status: 200,
							message: 'Company profile is updated successfully',
							companyprofile,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			})
			.catch((err) => res.json({ status: 404, message: err }));
	}
};

exports.delete = async (req, res) => {
	await CompanyProfileModel.findById({ _id: req.params.id })
		.then(async (companyprofile) => {
			await MediaModel.findByIdAndUpdate(
				{ _id: companyprofile.logo },
				{
					$set: {
						isActive: false,
					},
				},
				{ useFindAndModify: false, new: true }
			);
			await CompanyProfileModel.findByIdAndDelete({ _id: req.params.id })
				.then((data) =>
					res.json({
						status: 200,
						message: 'Company profile is deleted successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.catch((err) => res.json({ status: 404, message: err }));
};
