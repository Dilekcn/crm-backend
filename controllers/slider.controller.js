const SliderModel = require('../model/Slider.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAllSlides = async (req, res) => {
	try {
		const {page = 1, limit} = req.query
		const response = await SliderModel.find().limit(limit * 1).skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('mediaId', 'url title alt');
			const total = await SliderModel.find()
		const pages = limit === undefined ? 1 : Math.ceil(total.length / limit)
			res.json({response, total:total.length, pages});;
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.createSlide = async (req, res) => {
	const data = async (data) => {
		const newMedia = await new MediaModel({
			title: 'slider',
			url: data.Location || null,
			mediaKey: data.Key,
			alt: req.body.alt || null,
		});

		newMedia.save();

		const { title, subtitle, url, buttonText, order, isActive, isDeleted, isVideo } =
			req.body;

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
					status: true,
					message: 'Added new slide successfully.',
					response,
				})
			)
			.catch((error) => res.json({ status: false, message: error }));
	};

	await S3.uploadNewMedia(req, res, data);
};

exports.getSingleSlide = async (req, res) => {
	await SliderModel.findById({ _id: req.params.slideid }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	}).populate('mediaId', 'url title alt');
};

exports.getSingleSlideByTitle = async (req, res) => {
	await SliderModel.findOne({ title: req.params.titletext }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	}).populate('mediaId', 'url title alt');
};

exports.updateSlider = async (req, res) => {
	await SliderModel.findById({ _id: req.params.slideid })
		.then(async (slider) => {
			await MediaModel.findById({ _id: slider.mediaId })
				.then(async (media) => {
					const data = async (data) => {
						await MediaModel.findByIdAndUpdate(
							{ _id: slider.mediaId },
							{
								$set: {
									title: 'slider',
									url: data.Location || null,
									mediaKey: data.Key,
									alt: req.body.alt || null,
								},
							}
						)
							.then(async (updatedMedia) => {
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
								return await SliderModel.findByIdAndUpdate(
									{ _id: req.params.slideid },
									{
										$set: {
											title,
											subtitle,
											url,
											buttonText,
											order,
											isActive,
											isDeleted,
											mediaId: slider.mediaId,
											isVideo,
										},
									}
								)
									.then((data) => data)
									.catch((err) => err);
							})
							.then((response) =>
								res.json({
									status: true,
									message: 'Slide updated successfully',
									response,
								})
							);
					};
					await S3.updateMedia(req, res, media.mediaKey, data);
				})
				.catch((err) => res.json({ message: err }));
		})

		.catch((err) => res.json({ message: err }));
};

exports.removeSlide = async (req, res) => {
	await SliderModel.findByIdAndDelete({ _id: req.params.slideid })
		.then(async (slider) => {
			await MediaModel.findByIdAndRemove({ _id: slider.mediaId }).then((media) => {
				S3.deleteMedia(media.mediaKey);
			});
			res.json(slider);
		})
		.catch((err) => res.json({ message: err }));

	// await SliderModel.findByIdAndDelete({ _id: req.params.slideid })
	// 	.then(async(data) => {
	// 		await MediaModel.findByIdAndRemove({_id:data.mediaId}).then(data => data).catch(err => res.json(err))
	// 		return res.json(data)
	// 	})
	// 	.catch((err) => res.json({ message: err }));
};
