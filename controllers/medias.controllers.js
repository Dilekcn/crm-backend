const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');
const mongoose = require('mongoose')

exports.getAllMedia = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await MediaModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await MediaModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ message: 'All Medias', total: total, pages, status: 200, response });
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
		const response = await MediaModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await MediaModel.find(query).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({
			message: 'Filtered medias',
			total,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		next({ status: 404, message: error });
	}
};

exports.createMedia = async (req, res, next) => {
	const data = async (data) => {
		const newMedia = await new MediaModel({
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
				res.json({ status: 200, message: 'Media Created', response })
			)
			.catch((err) => next({ status: 404, message: err }));
	};
	await S3.uploadNewMedia(req, res, data);
};

exports.getSingleMedia = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.mediaid)) {
		await MediaModel.findById({_id: req.params.mediaid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Medias Model.',
					})
				} else {
					await MediaModel.findById({ _id: req.params.mediaid }, (err, data) => {
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

exports.getSingleMediaByTitle = async (req, res, next) => {
	const { page, limit } = req.query;
	const title = req.params.title.toLowerCase();
	const total = await MediaModel.find({ title }).countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	await MediaModel.find({ title }, (err, data) => {
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

exports.getMediaByIsActive = async (req, res, next) => {
	const { page, limit } = req.query;
	const isActive = req.params.isactive.toLowerCase();
	const total = await MediaModel.find({ isActive }).countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);

	await MediaModel.find({ isActive }, (err, data) => {
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

exports.updateSingleMedia = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.mediaid)) {
		await MediaModel.findById({_id: req.params.mediaid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Medias Model.',
					})
				} else {
					await MediaModel.findById({ _id: req.params.mediaid })
					.then(async (response) => {
						const data = async (data) => {
							await MediaModel.findByIdAndUpdate(
								{ _id: req.params.mediaid },
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
									res.json({ status: 200, message: 'Media updated', data })
								)
								.catch((err) => next({ status: 404, message: err }));
						};
						await S3.updateMedia(req, res, response.mediaKey, data);
					})
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
	
};

exports.removeSingleMedia = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.mediaid)) {
		await MediaModel.findById({_id: req.params.mediaid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Medias Model.',
					})
				} else {
					await MediaModel.findById({ _id: req.params.mediaid })
					.then(async (response) => {
						S3.deleteMedia(response.mediaKey);
						await MediaModel.findByIdAndDelete({ _id: req.params.mediaid })
							.then((data) => res.json({ status: 200, message: 'Media removed', data }))
							.catch((err) => next({ status: 404, message: err }));
					})
					.catch((err) => next({ status: 404, message: err }));
							}
						}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
