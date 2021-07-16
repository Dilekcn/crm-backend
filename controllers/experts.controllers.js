const ExpertModel = require('../model/Expert.model');
const SocialMediaModel = require('../model/SocialMedia.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAllExperts = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await ExpertModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('socialMediaId', 'title link description')
			.populate('mediaId', 'url title alt');
		const total = await ExpertModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.createExpert = async (req, res) => {
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
					title: 'expert',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { firstname, lastname, expertise, isActive, isDeleted } = req.body;

				const newExpert = await new ExpertModel({
					firstname,
					lastname,
					expertise,
					mediaId: newMedia._id,
					socialMediaId: socialMediaIds,
					isActive,
					isDeleted,
				});
				newExpert
					.save()
					.then((response) =>
						res.json({
							status: 200,
							message: 'Added new expert successfully.',
							response,
						})
					)
					.catch((error) => res.json({ status: 404, message: error }));
			};

			await S3.uploadNewMedia(req, res, data);
		} else if (req.body.mediaId) {
			const { firstname, lastname, expertise, isActive, isDeleted, mediaId } =
				req.body;

			const newExpert = await new ExpertModel({
				firstname,
				lastname,
				expertise,
				mediaId,
				socialMediaId: socialMediaIds,
				isActive,
				isDeleted,
			});
			newExpert
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Added new expert successfully.',
						response,
					})
				)
				.catch((error) => res.json({ status: 404, message: error }));
		} else {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'expert',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { firstname, lastname, expertise, isActive, isDeleted } = req.body;

				const newExpert = await new ExpertModel({
					firstname,
					lastname,
					expertise,
					mediaId: newMedia._id,
					socialMediaId: socialMediaIds,
					isActive,
					isDeleted,
				});
				newExpert
					.save()
					.then((response) =>
						res.json({
							status: 200,
							message: 'Added new expert successfully.',
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
					title: 'expert',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { firstname, lastname, expertise, isActive, isDeleted } = req.body;

				const newExpert = await new ExpertModel({
					firstname,
					lastname,
					expertise,
					mediaId: newMedia._id,
					isActive,
					isDeleted,
				});
				newExpert
					.save()
					.then((response) =>
						res.json({
							status: 200,
							message: 'Added new expert successfully.',
							response,
						})
					)
					.catch((error) => res.json({ status: 404, message: error }));
			};

			await S3.uploadNewMedia(req, res, data);
		} else if (req.body.mediaId) {
			const { firstname, lastname, expertise, isActive, isDeleted, mediaId } =
				req.body;

			const newExpert = await new ExpertModel({
				firstname,
				lastname,
				expertise,
				mediaId,
				socialMediaId: socialMediaIds,
				isActive,
				isDeleted,
			});
			newExpert
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Added new expert successfully.',
						response,
					})
				)
				.catch((error) => res.json({ status: 404, message: error }));
		} else {
			const { firstname, lastname, expertise, isActive, isDeleted, mediaId } =
				req.body;

			const newExpert = await new ExpertModel({
				firstname,
				lastname,
				expertise,
				mediaId: mediaId,
				isActive,
				isDeleted,
			});
			newExpert
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Added new expert successfully.',
						response,
					})
				)
				.catch((error) => res.json({ status: 404, message: error }));
		}
	}
};

exports.getSingleExpert = async (req, res) => {
	await ExpertModel.findById({ _id: req.params.expertid }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('socialMediaId', 'title link description')
		.populate('mediaId', 'url title alt');
};

exports.getExpertsByFirstname = async (req, res) => {
	await ExpertModel.find({ firstname: req.params.firstname }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('socialMediaId', 'title link description')
		.populate('mediaId', 'url title alt');
};

exports.getExpertsByLastname = async (req, res) => {
	await ExpertModel.find({ lastname: req.params.lastname }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('socialMediaId', 'title link description')
		.populate('mediaId', 'url title alt');
};

exports.getExpertsByExpertise = async (req, res) => {
	await ExpertModel.find({ expertise: req.params.expertise }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('socialMediaId', 'title link description')
		.populate('mediaId', 'url title alt');
};

exports.updateExpert = async (req, res) => {
	if (req.files) {
		await ExpertModel.findById({ _id: req.params.expertid })
			.then(async (expert) => {
				await MediaModel.findById({ _id: expert.mediaId }).then(async (media) => {
					const data = async (data) => {
						await MediaModel.findByIdAndUpdate(
							{ _id: expert.mediaId },
							{
								$set: {
									url: data.Location || null,
									title: 'expert',
									mediaKey: data.Key,
									alt: req.body.alt,
								},
							},
							{ useFindAndModify: false, new: true }
						).catch((err) => res.json({ status: 404, message: err }));
					};
					await S3.updateMedia(req, res, media.mediaKey, data);
				});
				await expert.socialMediaId.map(async (SMId, index) => {
					await SocialMediaModel.findByIdAndUpdate(
						{ _id: SMId },
						{
							$set: JSON.parse(req.body.socialMediaId)[index],
						}
					);
				});

				const { firstname, lastname, expertise } = req.body;
				await ExpertModel.findByIdAndUpdate(
					{ _id: req.params.expertid },
					{
						$set: {
							firstname,
							lastname,
							expertise,
							mediaId: req.files ? expert.mediaId : req.body.mediaId,
							socialMediaId: expert.socialMediaId,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
						},
					},
					{ useFindAndModify: false, new: true }
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
	} else {
		await ExpertModel.findById({ _id: req.params.expertid })
			.then(async (expert) => {
				await expert.socialMediaId.map(async (SMId, index) => {
					await SocialMediaModel.findByIdAndUpdate(
						{ _id: SMId },
						{
							$set: JSON.parse(req.body.socialMediaId)[index],
						},
						{ useFindAndModify: false, new: true }
					);
				});

				const { firstname, lastname, expertise, mediaId } = req.body;
				await ExpertModel.findByIdAndUpdate(
					{ _id: req.params.expertid },
					{
						$set: {
							firstname,
							lastname,
							expertise,
							mediaId: !mediaId ? expert.mediaId : mediaId,
							socialMediaId: expert.socialMediaId,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
						},
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
	}
};

exports.removeExpert = async (req, res) => {
	await ExpertModel.findById({ _id: req.params.expertid })
		.then(async (expert) => {
			await MediaModel.findByIdAndUpdate(
				{ _id: expert.mediaId },
				{
					$set: {
						isActive: false,
					},
				},
				{ useFindAndModify: false, new: true }
			);
			await ExpertModel.findByIdAndDelete({ _id: req.params.expertid })
				.then(async (data) => {
					res.json({
						status: 200,
						message: 'Expert is deleted successfully',
						data,
					});
				})
				.catch((err) => {
					res.json({ status: 4041, message: err });
				});
		})
		.catch((err) => res.json({ status: 4042, message: err }));
};
