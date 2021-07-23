const SliderModel = require('../model/Slider.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAllSlides = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await SliderModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('mediaId', 'url title alt');
		const total = await SliderModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, error });
	}
};

exports.getWithQuery = async (req, res) => {
	try {
		const query =
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
		const { page, limit } = req.query;
		const total = await SliderModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const response = await SliderModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		res.json({ message: 'Filtered sliders', total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.createSlide = async (req, res) => {
	if (req.files) {
		const data = async (data) => {
			const newMedia = await new MediaModel({
				title: 'slider',
				url: data.Location || null,
				mediaKey: data.Key,
				alt: req.body.alt || null,
			});

			newMedia.save();

			const {
				title,
				subtitle,
				url,
				buttonText,
				order,
				isActive,
				isDeleted,
				isVideo,
			} = req.body;

			const newSlide = await new SliderModel({
				title,
				subtitle,
				url,
				buttonText,
				order,
				isActive,
				isDeleted,
				mediaId: newMedia._id,
				isVideo,
			});
			newSlide
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Added new slide successfully.',
						response,
					})
				)
				.catch((error) => res.json({ status: 404, message: error }));
		};

		await S3.uploadNewMedia(req, res, data);
	} else if (req.body.mediaId) {
		const {
			title,
			subtitle,
			url,
			buttonText,
			order,
			isActive,
			isDeleted,
			isVideo,
			mediaId,
		} = req.body;

		const newSlide = await new SliderModel({
			title,
			subtitle,
			url,
			buttonText,
			order,
			isActive,
			isDeleted,
			mediaId,
			isVideo,
		});
		newSlide
			.save()
			.then((response) =>
				res.json({
					status: 200,
					message: 'Added new slide successfully.',
					response,
				})
			)
			.catch((error) => res.json({ status: 404, message: error }));
	} else {
		const data = async (data) => {
			const newMedia = await new MediaModel({
				title: 'slider',
				url: data.Location || null,
				mediaKey: data.Key,
				alt: req.body.alt || null,
			});

			newMedia.save();

			const {
				title,
				subtitle,
				url,
				buttonText,
				order,
				isActive,
				isDeleted,
				isVideo,
			} = req.body;

			const newSlide = await new SliderModel({
				title,
				subtitle,
				url,
				buttonText,
				order,
				isActive,
				isDeleted,
				mediaId: newMedia._id,
				isVideo,
			});
			newSlide
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Added new slide successfully.',
						response,
					})
				)
				.catch((error) => res.json({ status: 404, message: error }));
		};

		await S3.uploadNewMedia(req, res, data);
	}
};

exports.getSingleSlide = async (req, res) => {
	await SliderModel.findById({ _id: req.params.slideid }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	}).populate('mediaId', 'url title alt');
};

exports.getSingleSlideByTitle = async (req, res) => {
	const { page, limit } = req.query;
	await SliderModel.find({ title: req.params.titletext }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('mediaId', 'url title alt')
		.limit(limit * 1)
		.skip((page - 1) * limit);
};

exports.updateSlider = async (req, res) => {
	if (req.files) {
		await SliderModel.findById({ _id: req.params.slideid })
			.then(async (slider) => {
				await MediaModel.findById({ _id: slider.mediaId }).then(async (media) => {
					const data = async (data) => {
						await MediaModel.findByIdAndUpdate(
							{ _id: slider.mediaId },
							{
								$set: {
									title: 'slider',
									url: data.Location || null,
									mediaKey: data.Key,
									alt: req.body.title || null,
								},
							},
							{ useFindAndModify: false, new: true }
						).catch((err) => res.json({ status: 404, message: err }));
					};
					await S3.updateMedia(req, res, media.mediaKey, data);
				});
				const { title, subtitle, url, buttonText, order } = req.body;
				await SliderModel.findByIdAndUpdate(
					{ _id: req.params.slideid },
					{
						$set: {
							title,
							subtitle,
							url,
							buttonText,
							order,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
							mediaId: slider.mediaId,
							isVideo: !req.body.isVideo ? false : req.body.isVideo,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((response) =>
						res.json({
							status: 200,
							message: 'Slide updated successfully',
							response,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			})
			.catch((err) => res.json({ status: 404, message: err }));
	} else {
		await SliderModel.findById({ _id: req.params.slideid })
			.then(async (slider) => {
				const { title, subtitle, url, buttonText, order, mediaId } = req.body;

				await SliderModel.findByIdAndUpdate(
					{ _id: req.params.slideid },
					{
						$set: {
							title,
							subtitle,
							url,
							buttonText,
							order,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
							mediaId: !mediaId ? slider.mediaId : mediaId,
							isVideo: !req.body.isVideo ? false : req.body.isVideo,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((response) =>
						res.json({
							status: 200,
							message: 'Slide updated successfully',
							response,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			})
			.catch((err) => res.json({ status: 404, message: err }));
	}
};

exports.removeSlide = async (req, res) => {
	await SliderModel.findById({ _id: req.params.slideid })
		.then(async (slider) => {
			await MediaModel.findByIdAndUpdate(
				{ _id: slider.mediaId },
				{
					$set: { isActive: false },
				},
				{ useFindAndModify: false, new: true }
			);

			await SliderModel.findByIdAndDelete({ _id: req.params.slideid })
				.then(async (data) => {
					res.json({
						status: 200,
						message: 'Slide is deleted successfully',
						data,
					});
				})
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.catch((err) => res.json({ status: 404, message: err }));
};

// await SliderModel.findByIdAndDelete({ _id: req.params.slideid })
// 	.then(async(data) => {
// 		await MediaModel.findByIdAndRemove({_id:data.mediaId}).then(data => data).catch(err => res.json(err))
// 		return res.json(data)
// 	})
// 	.catch((err) => res.json({ message: err }));
