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
			.populate('mediaId', 'url title alt');
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
		.populate('mediaId', 'url title alt');
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
					title: 'company-profile',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { name, mediaId, address, email, isActive, isDeleted } = req.body;

				const newCompanyProfile = await new CompanyProfileModel({
					name,
					mediaId: newMedia._id,
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
			await S3.uploadNewMedia(req, res, data);
		} else if (req.body.mediaId) {
			const { name, mediaId, phones, address, email, isActive, isDeleted } =
				req.body;

			const newCompanyProfile = await new CompanyProfileModel({
				name,
				mediaId,
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
					title: 'company-profile',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { name, mediaId, phones, address, email, isActive, isDeleted } =
					req.body;

				const newCompanyProfile = await new CompanyProfileModel({
					name,
					mediaId: newMedia._id,
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
			await S3.uploadNewMedia(req, res, data);
		}
	} else {
		if (req.files) {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'company-profile',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { name, mediaId, phones, address, email, isActive, isDeleted } =
					req.body;

				const newCompanyProfile = await new CompanyProfileModel({
					name,
					mediaId: newMedia._id,
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
			await S3.uploadNewMedia(req, res, data);
		} else if (req.body.mediaId) {
			const { name, mediaId, phones, address, email, isActive, isDeleted } =
				req.body;

			const newCompanyProfile = await new CompanyProfileModel({
				name,
				mediaId,
				phones,
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
					title: 'company-profile',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { name, mediaId, phones, address, email, isActive, isDeleted } =
					req.body;

				const newCompanyProfile = await new CompanyProfileModel({
					name,
					mediaId: newMedia._id,
					phones,
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
			await S3.uploadNewMedia(req, res, data);
		}
	}
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

			const { name, mediaId, phones, address, email } = req.body;

			await CompanyProfileModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					name,
					mediaId,
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
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.delete = async (req, res) => {
	await CompanyProfileModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) =>
			res.json({
				status: 200,
				message: 'Company profile is deleted successfully',
				data,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
