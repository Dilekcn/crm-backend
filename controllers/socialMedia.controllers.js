const SocialMediaModel = require('../model/SocialMedia.model');
const mongoose = require('mongoose')

exports.getAllSocialMedia = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await SocialMediaModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await SocialMediaModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (err) {
		next({ status: 404, message: err });
	}
};

exports.getWithQuery = async (req, res, next) => {
	try {
		const query =
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
		const { page, limit } = req.query;
		const total = await SocialMediaModel.find(query).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const response = await SocialMediaModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		res.json({
			message: 'Filtered social medias',
			total,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		next({ status: 404, message: error });
	}
};

exports.getSingleSocialMediaById = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await SocialMediaModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Social Medias Model.',
					})
				} else {
					await SocialMediaModel.findById({ _id: req.params.id }, (err, data) => {
						if (err) {
							next({ status: 404, message: err });
						} else {
							res.json({ status: 200, data });
						}
					})
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
}

exports.createSocialMedia = (req, res, next) => {
	const newSocialMedia = new SocialMediaModel(req.body);
	newSocialMedia
		.save()
		.then((data) => {
			res.json({
				status: 200,
				message: 'New social media info is created successfully',
				data,
			});
		})
		.catch((err) => {
			next({ status: 404, message: err });
		});
};

exports.updateSocialMedia = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.socialmediaid)) {
		await SocialMediaModel.findById({_id: req.params.socialmediaid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Social Medias Model.',
					})
				} else {
					SocialMediaModel.findByIdAndUpdate(req.params.socialmediaid, req.body)
					.then((data) => {
						res.json({
							status: 200,
							message: 'Social media info is updated successfully',
							data,
						});
					})
					.catch((err) => {
						next({ status: 404, message: err });
					});
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.removeSocialMedia = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.socialmediaid)) {
		await SocialMediaModel.findById({_id: req.params.socialmediaid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Social Medias Model.',
					})
				} else {
					SocialMediaModel.findByIdAndRemove(req.params.socialmediaid)
					.then((data) => {
						res.json({
							status: 200,
							message: 'Social media info is removed successfully',
							data,
						});
					})
					.catch((err) => {
						next({ status: 404, message: err });
					});
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
