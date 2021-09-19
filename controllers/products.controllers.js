const ProductModel = require('../model/Products.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');
const mongoose = require('mongoose')

exports.getAllProducts = async (req, res, next) => {
	try {
		const { page, limit } = req.query;
		const response = await ProductModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('mediaId', 'title url alt')
			.populate('videoId', 'title url alt')
			.populate('userId', 'firstname lastname email');
		const total = await ProductModel.find().countDocuments();
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
		const { page = 1, limit } = req.query;
		const response = await ProductModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await ProductModel.find(query).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({
			message: 'Filtered products',
			total,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		next({ status: 404, message: error });
	}
};

exports.getSingleProduct = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.productid)) {
		await ProductModel.findById({_id: req.params.productid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Products Model.',
					})
				} else {
					ProductModel.findById({ _id: req.params.productid })
					.populate('mediaId', 'title url alt')
					.populate('videoId', 'title url alt')
					.populate('userId', 'firstname lastname email')
					.then((data) => res.json({ status: 200, data }))
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.getProductsByUserId = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.userid)) {
		await ProductModel.findOne({ userId: req.params.userid })
		.then(async(isExist) => {
			if (isExist === null) {
				next({
					status: 404,
					message: 'This Id is not exist in Products Model.',
				})
			} else {
				const { page, limit } = req.query;
				const total = await ProductModel.find().countDocuments();
				const pages = limit === undefined ? 1 : Math.ceil(total / limit);
			
				await ProductModel.find({ userId: req.params.userid }, (err, data) => {
					if (err) {
						next({ status: 404, message: err });
					} else {
						res.json({ total, pages, status: 200, data });
					}
				})
					.limit(limit * 1)
					.skip((page - 1) * limit)
					.sort({ createdAt: -1 })
					.populate('mediaId', 'title url alt')
					.populate('videoId', 'title url alt')
					.populate('userId', 'firstname lastname email');
			}
		}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.getProductsByTitle = async (req, res, next) => {
	const { page, limit } = req.query;
	const total = await ProductModel.find().countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);

	await ProductModel.find({ title: req.params.title }, (err, data) => {
		if (err) {
			next({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.sort({ createdAt: -1 })
		.populate('mediaId', 'title url alt')
		.populate('videoId', 'title url alt')
		.populate('userId', 'firstname lastname email');
};

exports.createProduct = async (req, res, next) => {
	if (req.files) {
		const data = async (data) => {
			const newMedia = await new MediaModel({
				url: data.Location || null,
				title: 'product',
				mediaKey: data.Key,
				alt: req.body.alt || null,
			});

			newMedia.save();

			const mediaIds = newMedia._id;

			const {
				title,
				order,
				isHomePage,
				content,
				shortDescription,
				buttonText,
				userId,
				isActive,
				isDeleted,
				isBlog,
				isAboveFooter,
			} = req.body;

			const newProduct = await new ProductModel({
				title,
				order,
				mediaId: mediaIds,
				isHomePage,
				content,
				shortDescription,
				buttonText,
				userId,
				isActive,
				isDeleted,
				isBlog,
				isAboveFooter,
			});

			newProduct
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'New product is created successfully',
						response,
					})
				)
				.catch((error) => next({ status: 404, message: error }));
		};
		await S3.uploadNewMedia(req, res, data);
	} else if (req.body.mediaId) {
		const {
			title,
			order,
			isHomePage,
			content,
			shortDescription,
			buttonText,
			userId,
			isActive,
			isDeleted,
			isBlog,
			isAboveFooter,
			mediaId,
		} = req.body;

		const newProduct = await new ProductModel({
			title,
			order,
			mediaId,
			isHomePage,
			content,
			shortDescription,
			buttonText,
			userId,
			isActive,
			isDeleted,
			isBlog,
			isAboveFooter,
		});

		newProduct
			.save()
			.then((response) =>
				res.json({
					status: 200,
					message: 'New product is created successfully',
					response,
				})
			)
			.catch((error) => next({ status: 404, message: error }));
	} else {
		const {
			title,
			order,
			isHomePage,
			content,
			shortDescription,
			buttonText,
			userId,
			isActive,
			isDeleted,
			isBlog,
			isAboveFooter,
			mediaId,
		} = req.body;

		const newProduct = await new ProductModel({
			title,
			order,
			mediaId,
			isHomePage,
			content,
			shortDescription,
			buttonText,
			userId,
			isActive,
			isDeleted,
			isBlog,
			isAboveFooter,
		});

		newProduct
			.save()
			.then((response) =>
				res.json({
					status: 200,
					message: 'New product is created successfully',
					response,
				})
			)
			.catch((error) => next({ status: 404, message: error }));
	}
};

exports.updateSingleProduct = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.productid)) {
		await ProductModel.findById({_id: req.params.productid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Products Model.',
					})
				} else {
					if (req.files) {
						await ProductModel.findById({ _id: req.params.productid })
							.then(async (product) => {
								await MediaModel.findById({ _id: product.mediaId }).then(
									async (media) => {
										const data = async (data) => {
											await MediaModel.findByIdAndUpdate(
												{ _id: product.mediaId },
												{
													$set: {
														url: data.Location || null,
														title: 'product',
														mediaKey: data.Key,
														alt: req.body.alt,
													},
												},
												{ useFindAndModify: false, new: true }
											).catch((err) => next({ status: 404, message: err }));
										};
										await S3.updateMedia(req, res, media.mediaKey, data);
									}
								);
				
								const { title, order, content, shortDescription, buttonText, userId } =
									req.body;
				
								await ProductModel.findByIdAndUpdate(
									{ _id: req.params.productid },
									{
										$set: {
											title,
											order,
											mediaId: product.mediaId,
											isHomePage: !req.body.isHomePage
												? false
												: req.body.isHomePage,
											content,
											shortDescription,
											buttonText,
											userId: !req.body.userId ? product.userId : req.body.userId,
											isActive: !req.body.isActive ? true : req.body.isActive,
											isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
											isBlog: !req.body.isBlog ? false : req.body.isBlog,
											isAboveFooter: !req.body.isAboveFooter
												? false
												: req.body.isAboveFooter,
										},
									},
									{ useFindAndModify: false, new: true }
								)
									.then((data) =>
										res.json({
											status: 200,
											message: 'Product is updated successfully',
											data,
										})
									)
									.catch((err) => next({ status: 404, message: err }));
							})
							.catch((err) => next({ status: 404, message: err }));
					} else {
						await ProductModel.findById({ _id: req.params.productid })
							.then(async (product) => {
								const {
									title,
									order,
									content,
									shortDescription,
									buttonText,
									userId,
									mediaId,
								} = req.body;
				
								await ProductModel.findByIdAndUpdate(
									{ _id: req.params.productid },
									{
										$set: {
											title,
											order,
											mediaId: product.mediaId,
											isHomePage: !req.body.isHomePage
												? false
												: req.body.isHomePage,
											content,
											shortDescription,
											buttonText,
											userId,
											isActive: !req.body.isActive ? true : req.body.isActive,
											isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
											isBlog: !req.body.isBlog ? false : req.body.isBlog,
											isAboveFooter: !req.body.isAboveFooter
												? false
												: req.body.isAboveFooter,
										},
									},
									{ useFindAndModify: false, new: true }
								)
									.then((data) =>
										res.json({
											status: 200,
											message: 'Product is updated successfully',
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

exports.deleteProduct = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.productid)) {
		await ProductModel.findById({_id: req.params.productid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Products Model.',
					})
				} else {
				await ProductModel.findById({ _id: req.params.productid })
				.then(async (product) => {
					await MediaModel.findByIdAndUpdate(
						{ _id: product.mediaId },
						{
							$set: { isActive: false },
						},
						{ useFindAndModify: false, new: true }
					);
					await ProductModel.findByIdAndRemove({ _id: req.params.productid })
						.then((data) => {
							res.json({
								status: 200,
								message: 'Product is deleted successfully',
								data,
							});
						})
						.catch((err) => {
							next({ status: 404, message: err });
						});
				})
				.catch((err) => next({ status: 404, message: err }));
						}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
