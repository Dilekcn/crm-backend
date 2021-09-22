const VideoModel = require('../model/Video.model');
const S3 = require('../config/aws.s3.config');
const mongoose = require('mongoose')

exports.getAllVideo = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await VideoModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await VideoModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ message: 'All Videos', total: total, pages, status: 200, response });
	} catch (error) {
		next({ status: 404, message: error });
	}
};

exports.getWithQuery = async (req, res, next) => { 
	try {
		const query =
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
		const { page = 1, limit } = req.query;
		const response = await VideoModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await VideoModel.find(query).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit); 
		res.json({
			message: 'Filtered videos',
			total,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		next({ status: 404, message: error });
	}
};

exports.createVideo = async (req, res, next) => {
	const data = async (data) => {
		const newMedia = await new VideoModel({
			url: data.Location,
			title: req.body.title,
			mediaKey: data.Key,
			isHomePage: req.body.isHomePage,
			isActive: req.body.isActive,
			isDeleted: req.body.isDeleted,
			alt: req.body.alt,  
		});

		newMedia
			.save()
			.then((response) =>
				res.json({ status: 200, message: 'Video Created', response })
			)
			.catch((err) => next({ status: 404, message: err }));
	};
	await S3.uploadNewVideo(req, res, data);
};

exports.getSingleVideo = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.videoid)) {
		await VideoModel.findById({_id: req.params.videoid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Videos Model.',
					})
				} else {
					await VideoModel.findById({ _id: req.params.videoid }, (err, data) => {
						if (err) {
							next({ status: 404, message: err });
						} else {
							res.json({ status: 200, data });
						}
					});
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};



exports.getMediaByIsActive = async (req, res, next) => {
	const { page, limit } = req.query;
	const isActive = req.params.isactive.toLowerCase();
	const total = await VideoModel.find({ isActive }).countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);

	await VideoModel.find({ isActive }, (err, data) => {
		if (err) {
			next({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.sort({ createdAt: -1 });
};

exports.updateSingleVideo = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.videoid)) {
		await VideoModel.findById({_id: req.params.videoid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Medias Model.',
					})
				} else {
					await VideoModel.findById({ _id: req.params.videoid })
					.then(async (response) => {
						const data = async (data) => {
							await VideoModel.findByIdAndUpdate(
								{ _id: req.params.videoid },
								{
									$set: {
										url: data.Location || isExist.url,
										mediaKey: data.Key || isExist.mediaKey,
										title: req.body.title === null ? isExist.title : req.body.title,
										isActive: req.body.isActive === null ? isExist.isActive : req.body.isActive,
										isDeleted: req.body.isDeleted === null ? isExist.isDeleted : req.body.isDeleted,
										alt: req.body.alt === null ? isExist.alt : req.body.alt,
									},
								}
							)
								.then((data) =>
									res.json({ status: 200, message: 'Video updated', data })
								)
								.catch((err) => next({ status: 404, message: err }));
						};
						await S3.updateVideo(req, res, response.mediaKey, data);
					})
					.catch((err) => next({ status: 404, message: err })); 
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
	
};

exports.removeSingleVideo = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.videoid)) {
		await VideoModel.findById({_id: req.params.videoid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Videos Model.',
					})
				} else {
					await VideoModel.findById({ _id: req.params.videoid })
					.then(async (response) => {
						S3.deleteMedia(response.mediaKey);
						await VideoModel.findByIdAndDelete({ _id: req.params.videoid })
							.then((data) => res.json({ status: 200, message: 'Video removed', data }))
							.catch((err) => next({ status: 404, message: err }));
					})
					.catch((err) => next({ status: 404, message: err }));
							}
						}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
