const SliderModel = require('../model/Slider.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');
const mongoose = require('mongoose')

exports.getAllSlides = async (req, res, next) => {
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
		next({ status: 404, error });
	}
};

exports.getWithQuery = async (req, res, next) => {
	try {
		const query =
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
		const { page, limit } = req.query;
		const total = await SliderModel.find(query).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const response = await SliderModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		res.json({ message: 'Filtered sliders', total, pages, status: 200, response });
	} catch (error) {
		next({ status: 404, message: error });
	}
};
exports.searchSliders = async (req, res, next) => {  
	const total = await SliderModel.find({
		"$or":[
			{"title": { "$regex": req.body.query, "$options": "i" }},
			{"subtitle": { "$regex": req.body.query, "$options": "i" }}, 
		] 
	}).countDocuments(); 
	try {
		const response = await SliderModel.find({  
			"$or":[
				{"title": { "$regex": req.body.query, "$options": "i" }},
				{"subtitle": { "$regex": req.body.query, "$options": "i" }}, 
			],
		})
		res.json({status:200,total,message: 'Search results', response });  
	} catch (error) {
		next({ status: 404, message: error });  
	}
};

exports.createSlide = async (req, res, next) => {
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
				.catch((error) => next({ status: 404, message: error }));
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
			.catch((error) => next({ status: 404, message: error }));
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
				.catch((error) => next({ status: 400, message: error }));
		};

		await S3.uploadNewMedia(req, res, data);
	}
};

exports.getSingleSlide = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.slideid)) {
		await SliderModel.findById({_id: req.params.slideid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Sliders Model.',
					})
				} else {
					await SliderModel.findById({ _id: req.params.slideid }, (err, data) => {
						if (err) {
							next({ status: 404, message: err });
						} else {
							res.json({ status: 200, data });
						}
					}).populate('mediaId', 'url title alt');
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.getSingleSlideByTitle = async (req, res, next) => {
	const { page, limit } = req.query;
	await SliderModel.find({ title: req.params.titletext }, (err, data) => {
		if (err) {
			next({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('mediaId', 'url title alt')
		.limit(limit * 1)
		.skip((page - 1) * limit);
};

exports.updateSlider = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.slideid)) {
		await SliderModel.findById({_id: req.params.slideid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Sliders Model.',
					})
				} else {
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
										).catch((err) => next({ status: 404, message: err }));
									};
									await S3.updateMedia(req, res, media.mediaKey, data);
								});
								const { title, subtitle, url, buttonText, order } = req.body;
								await SliderModel.findByIdAndUpdate(
									{ _id: req.params.slideid },
									{
										$set: {
											title:!req.body.title ? slider.title : req.body.title,
											subtitle:!req.body.subtitle ? slider.subtitle : req.body.subtitle,
											url:!req.body.url ? slider.url : req.body.url,
											buttonText:!req.body.buttonText ? slider.buttonText : req.body.buttonText,
											order:!req.body.order ? slider.order : req.body.order,
											isActive: !req.body.isActive ? slider.isActive : req.body.isActive,
											isDeleted: !req.body.isDeleted ? slider.isDeleted : req.body.isDeleted,
											mediaId: slider.mediaId,
											isVideo: !req.body.isVideo ? slider.isVideo : req.body.isVideo,
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
									.catch((err) => next({ status: 404, message: err }));
							})
							.catch((err) => next({ status: 404, message: err }));
					} else {
						await SliderModel.findById({ _id: req.params.slideid })
							.then(async (slider) => {
								const { title, subtitle, url, buttonText, order, mediaId } = req.body;
				
								await SliderModel.findByIdAndUpdate(
									{ _id: req.params.slideid },
									{
										$set: {
											title:!req.body.title ? slider.title : req.body.title,
											subtitle:!req.body.subtitle ? slider.subtitle : req.body.subtitle,
											url:!req.body.url ? slider.url : req.body.url,
											buttonText:!req.body.buttonText ? slider.buttonText : req.body.buttonText,
											order:!req.body.order ? slider.order : req.body.order,
											isActive: !req.body.isActive ? slider.isActive : req.body.isActive,
											isDeleted: !req.body.isDeleted ? slider.isDeleted : req.body.isDeleted,
											mediaId: !mediaId ? slider.mediaId : mediaId,
											isVideo: !req.body.isVideo ? slider.isVideo : req.body.isVideo,
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
									.catch((err) => next({ status: 404, message: err }));
							})
							.catch((err) => next({ status: 404, message: err }));
					}
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.removeSlide = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.slideid)) {
		await SliderModel.findById({_id: req.params.slideid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Sliders Model.',
					})
				} else {
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
							.catch((err) => next({ status: 404, message: err }));
					})
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
