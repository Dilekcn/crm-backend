const StaticPageModel = require('../model/StaticPage.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');
const mongoose = require('mongoose')

exports.getAll = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await StaticPageModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('mediaId', 'url title alt');
		const total = await StaticPageModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
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
		const total = await StaticPageModel.find(query).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const response = await StaticPageModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		res.json({
			message: 'Filtered static pages',
			total,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		next({ status: 404, message: err });
	}
};

exports.createPage = async (req, res, next) => {
	if (req.files) {
		const data = async (data) => {
			const newImage = await new MediaModel({
				url: data.Location || null,
				title: 'static-page',
				mediaKey: data.Key,
				alt: req.body.alt || null,
			});

			newImage.save();

			const { name, content, isActive, isDeleted } = req.body;

			const newPage = await new StaticPageModel({
				name: name.trim(),
				content,
				mediaId: newImage._id,
				isActive,
				isDeleted,
			});
			newPage
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'New static page is created successfully.',
						response,
					})
				)
				.catch((error) => next({ status: 404, message: error }));
		};
		await S3.uploadNewMedia(req, res, data);
	} else if (req.body.mediaId) {
		const { name, content, isActive, isDeleted, mediaId } = req.body;

		const newPage = await new StaticPageModel({
			name,
			content,
			mediaId,
			isActive,
			isDeleted,
		});
		newPage
			.save()
			.then((response) =>
				res.json({
					status: 200,
					message: 'New static page is created successfully.',
					response,
				})
			)
			.catch((error) => next({ status: 404, message: error }));
	} else {
		const data = async (data) => {
			const newImage = await new MediaModel({
				url: data.Location || null,
				title: 'static-page',
				mediaKey: data.Key,
				alt: req.body.alt || null,
			});

			newImage.save();

			const { name, content, isActive, isDeleted } = req.body;

			const newPage = await new StaticPageModel({
				name,
				content,
				mediaId: newImage._id,
				isActive,
				isDeleted,
			});
			newPage
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'New static page is created successfully.',
						response,
					})
				)
				.catch((error) => next({ status: 404, message: error }));
		};
		await S3.uploadNewMedia(req, res, data);
	}
};

exports.getSinglePage = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await StaticPageModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Static Pages Model.',
					})
				} else {
					await StaticPageModel.findById({ _id: req.params.id }, (err, data) => {
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

exports.getSinglePageByName = async (req, res, next) => {
	await StaticPageModel.findOne({ name: req.params.name }, (err, data) => {
		if (err) {
			next({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	}).populate('mediaId', 'url title alt');
};

exports.updatePages = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await StaticPageModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Static Pages Model.',
					})
				} else {
					if (req.files) {
						await StaticPageModel.findById({ _id: req.params.id })
							.then(async (staticpage) => {
								await MediaModel.findById({ _id: staticpage.mediaId }).then(
									async (media) => {
										const data = async (data) => {
											await MediaModel.findByIdAndUpdate(
												{ _id: staticpage.mediaId },
												{
													$set: {
														url: data.Location || null,
														title: 'static-page',
														mediaKey: data.Key,
														alt: req.body.title,
													},
												},
												{ useFindAndModify: false, new: true }
											).catch((err) => next({ status: 404, message: err }));
										};
										await S3.updateMedia(req, res, media.mediaKey, data);
									}
								);
				
								await StaticPageModel.findByIdAndUpdate(
									{ _id: req.params.id },
									{
										$set: {
											name:req.body.name ? req.body.name : staticpage.name,
											content:req.body.content ? req.body.content : staticpage.content,
											mediaId: staticpage.mediaId,
											isActive: !req.body.isActive ? staticpage.isActive : req.body.isActive,
											isDeleted: !req.body.isDeleted ? staticpage.isDeleted : req.body.isDeleted,
										},
									},
									{ useFindAndModify: false, new: true }
								)
									.then((data) =>
										res.json({
											status: 200,
											message: 'Static page is updated successfully',
											data,
										})
									)
									.catch((err) => next({ status: 404, message: err }));
							})
							.catch((err) => next({ status: 404, message: err }));
					} else {
						await StaticPageModel.findById({ _id: req.params.id })
							.then(async (staticpage) => {
								const { name, content, mediaId } = req.body;
				
								await StaticPageModel.findByIdAndUpdate(
									{ _id: req.params.id },
									{
										$set: {
											name:req.body.name ? req.body.name : staticpage.name,
											content:req.body.content ? req.body.content : staticpage.content,
											mediaId: !mediaId ? staticpage.mediaId : mediaId,
											isActive: !req.body.isActive ? staticpage.isActive : req.body.isActive,
											isDeleted: !req.body.isDeleted ? staticpage.isDeleted : req.body.isDeleted,
										},
									},
									{ useFindAndModify: false, new: true }
								)
									.then((data) =>
										res.json({
											status: 200,
											message: 'Static page is updated successfully',
											data,
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

exports.removePage = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await StaticPageModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Static Pages Model.',
					})
				} else {
					await StaticPageModel.findById({ _id: req.params.id })
					.then(async (staticpage) => {
						await MediaModel.findByIdAndUpdate(
							{ _id: staticpage.mediaId },
							{
								$set: { isActive: false },
							},
							{ useFindAndModify: false, new: true }
						);

						await StaticPageModel.findByIdAndDelete({ _id: req.params.id })
							.then((data) =>
								res.json({
									status: 200,
									message: 'Static page is deleted successfully',
									data,
								})
							)
							.catch((err) => next({ status: 404, message: err }));
					})
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
