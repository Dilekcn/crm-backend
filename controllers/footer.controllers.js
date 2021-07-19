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
			.populate('logo', 'url title alt');
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
		.populate('logo', 'url title alt')
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
					title: 'footer-logo',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { address, email, phone, copyright, isActive, isDeleted } =
					req.body;

				const newFooter = new FooterModel({
					logo: newMedia._id,
					address,
					email,
					phone,
					socialMediaId: socialMediaIds,
					copyright,
					isActive,
					isDeleted,
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
			await S3.uploadNewLogo(req, res, data);
		} else if (req.body.logo) {
			const { address, email, phone, copyright, isActive, isDeleted, logo } =
				req.body;

			const newFooter = new FooterModel({
				logo,
				address,
				email,
				phone,
				socialMediaId: socialMediaIds,
				copyright,
				isActive,
				isDeleted,
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
					title: 'footer-logo',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { address, email, phone, copyright, isActive, isDeleted } =
					req.body;

				const newFooter = new FooterModel({
					logo: newMedia._id,
					address,
					email,
					phone,
					socialMediaId: socialMediaIds,
					copyright,
					isActive,
					isDeleted,
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
			await S3.uploadNewLogo(req, res, data);
		}
	} else {
		if (req.files) {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'footer-logo',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { address, email, phone, copyright, isActive, isDeleted } =
					req.body;

				const newFooter = new FooterModel({
					logo: newMedia._id,
					address,
					email,
					phone,
					copyright,
					isActive,
					isDeleted,
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
			await S3.uploadNewLogo(req, res, data);
		} else if (req.body.logo) {
			const { address, email, phone, copyright, isActive, isDeleted, logo } =
				req.body;

			const newFooter = new FooterModel({
				logo,
				address,
				email,
				phone,
				copyright,
				isActive,
				isDeleted,
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
					title: 'footer-logo',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { address, email, phone, copyright, isActive, isDeleted } =
					req.body;

				const newFooter = new FooterModel({
					logo: newMedia._id,
					address,
					email,
					phone,
					copyright,
					isActive,
					isDeleted,
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
			await S3.uploadNewLogo(req, res, data);
		}
	}
};

exports.updateFooterById = async (req, res) => {
	if (req.files) {
		await FooterModel.findById({ _id: req.params.id })
			.then(async (footer) => {
				await MediaModel.findById({ _id: footer.logo }).then(async (media) => {
					const data = async (data) => {
						await MediaModel.findByIdAndUpdate(
							{ _id: footer.logo },
							{
								$set: {
									url: data.Location || null,
									title: 'footer-logo',
									mediaKey: data.Key,
									alt: req.body.alt,
								},
							},
							{ useFindAndModify: false, new: true }
						).catch((err) => res.json({ status: 404, message: err }));
					};
					await S3.updateLogo(req, res, media.mediaKey, data);
				});
				await footer.socialMediaId.map(async (SMId, index) => {
					await SocialMediaModel.findByIdAndUpdate(
						{ _id: SMId },
						{
							$set: JSON.parse(req.body.socialMediaId)[index],
						}
					);
				});

				const { address, email, phone, copyright } = req.body;
				await FooterModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							address,
							email,
							phone,
							copyright,
							logo: req.files ? footer.logo : req.body.logo,
							socialMediaId: footer.socialMediaId,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
						},
					},
					{ useFindAndModify: false, new: true }
				)

					.then((data) =>
						res.json({
							status: 200,
							message: 'Footer is updated successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 4041, message: err }));
			})
			.catch((err) => res.json({ status: 4042, message: err }));
	} else {
		await FooterModel.findById({ _id: req.params.id })
			.then(async (footer) => {
				await footer.socialMediaId.map(async (SMId, index) => {
					await SocialMediaModel.findByIdAndUpdate(
						{ _id: SMId },
						{
							$set: JSON.parse(req.body.socialMediaId)[index],
						},
						{ useFindAndModify: false, new: true }
					);
				});

				const { address, email, phone, copyright, logo } = req.body;
				await FooterModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							address,
							email,
							phone,
							copyright,
							logo: !logo ? footer.logo : logo,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
						},
					},
					{ useFindAndModify: false, new: true }
				)

					.then((data) =>
						res.json({
							status: 200,
							message: 'Footer is updated successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 4041, message: err }));
			})
			.catch((err) => res.json({ status: 4042, message: err }));
	}
};

exports.removeFooterById = async (req, res) => {
	await FooterModel.findById({ _id: req.params.id })
		.then(async (footer) => {
			await MediaModel.findByIdAndUpdate(
				{ _id: footer.logo },
				{
					$set: {
						isActive: false,
					},
				},
				{ useFindAndModify: false, new: true }
			);
			const id = req.params.id;
			await FooterModel.findByIdAndDelete({ _id: id })
				.then(async (data) => {
					res.json({
						status: 200,
						message: 'Footer is deleted successfully',
						data,
					});
				})
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.catch((err) => res.json({ status: 404, message: err }));
};
