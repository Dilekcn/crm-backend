const FooterModel = require('../model/Footer.model');
const SocialMediaModel = require('../model/SocialMedia.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await FooterModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('socialMediaId', 'title link')
			.populate('mediaId', 'url title alt');
		const total = await FooterModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (err) {
		res.json({ status: 404, message: err });
	}
};

exports.getSingleFooterById = (req, res) => {
	const id = req.params.id;

	FooterModel.findById({ _id: id })
		.populate('socialMediaId', 'title link')
		.populate('mediaId', 'url title alt')
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.createFooter = async (req, res) => {
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
					title: 'footer',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const newFooter = new FooterModel({
					mediaId: newMedia._id,
					address: req.body.address,
					email: req.body.email,
					phone: req.body.phone,
					socialMediaId: socialMediaIds,
					copyright: req.body.copyright,
					isActive: req.body.isActive,
					isDeleted: req.body.isDeleted,
				});

				newFooter
					.save()
					.then((data) =>
						res.json({
							status: 200,
							message: 'New footer is created successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			};
			await S3.uploadNewMedia(req, res, data);
		} else if (req.body.mediaId) {
			const newFooter = new FooterModel({
				mediaId: req.body.mediaId,
				address: req.body.address,
				email: req.body.email,
				phone: req.body.phone,
				socialMediaId: socialMediaIds,
				copyright: req.body.copyright,
				isActive: req.body.isActive,
				isDeleted: req.body.isDeleted,
			});

			newFooter
				.save()
				.then((data) =>
					res.json({
						status: 200,
						message: 'New footer is created successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		} else {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'footer',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const newFooter = new FooterModel({
					mediaId: newMedia._id,
					address: req.body.address,
					email: req.body.email,
					phone: req.body.phone,
					socialMediaId: socialMediaIds,
					copyright: req.body.copyright,
					isActive: req.body.isActive,
					isDeleted: req.body.isDeleted,
				});

				newFooter
					.save()
					.then((data) =>
						res.json({
							status: 200,
							message: 'New footer is created successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			};
			await S3.uploadNewMedia(req, res, data);
		}
	} else {
		if (req.files) {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'footer',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const newFooter = new FooterModel({
					mediaId: newMedia._id,
					address: req.body.address,
					email: req.body.email,
					phone: req.body.phone,
					socialMediaId: socialMediaIds,
					copyright: req.body.copyright,
					isActive: req.body.isActive,
					isDeleted: req.body.isDeleted,
				});

				newFooter
					.save()
					.then((data) =>
						res.json({
							status: 200,
							message: 'New footer is created successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			};
			await S3.uploadNewMedia(req, res, data);
		} else if (req.body.mediaId) {
			const newFooter = new FooterModel({
				mediaId: newMedia._id,
				address: req.body.address,
				email: req.body.email,
				phone: req.body.phone,
				socialMediaId: socialMediaIds,
				copyright: req.body.copyright,
				isActive: req.body.isActive,
				isDeleted: req.body.isDeleted,
			});

			newFooter
				.save()
				.then((data) =>
					res.json({
						status: 200,
						message: 'New footer is created successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		} else {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'footer',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const newFooter = new FooterModel({
					mediaId: newMedia._id,
					address: req.body.address,
					email: req.body.email,
					phone: req.body.phone,
					socialMediaId: socialMediaIds,
					copyright: req.body.copyright,
					isActive: req.body.isActive,
					isDeleted: req.body.isDeleted,
				});

				newFooter
					.save()
					.then((data) =>
						res.json({
							status: 200,
							message: 'New footer is created successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			};
			await S3.uploadNewMedia(req, res, data);
		}
	}
};

exports.updateFooterById = async (req, res) => {
	await FooterModel.findById({ _id: req.params.footerid })
		.then(async (footer) => {
			await footer.socialMediaId.map(
				async (socialMediaid, index) =>
					await SocialMediaModel.findByIdAndUpdate(
						{ _id: socialMediaid },
						{ $set: req.body.socialMediaId[index] }
					)
						.then((data) => res.json({ status: 200, data }))
						.catch((err) => res.json({ status: 404, message: err }))
			);

			await FooterModel.findByIdAndUpdate(
				{ _id: req.params.footerid },
				{
					logo: req.body.logo,
					address: req.body.address,
					email: req.body.email,
					phone: req.body.phone,
					socialMediaId: footer.socialMediaId,
					copyright: req.body.copyright,
				}
			)
				.then((data) =>
					res.json({
						status: 200,
						message: 'Expert is updated successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeFooterById = (req, res) => {
	const id = req.params.id;
	FooterModel.findByIdAndDelete({ _id: id })
		.then(async (data) => {
			res.json({ status: 200, message: 'Footer is deleted successfully', data });
		})
		.catch((err) => res.json({ status: 404, message: err }));
};
