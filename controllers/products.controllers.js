const ProductModel = require('../model/Products.model');
const MediaModel = require('../model/Media.model');
const VideoModel = require('../model/Video.model');
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
exports.searchProducts = async (req, res, next) => {  
	const total = await ProductModel.find({
		"$or":[
			{"title": { "$regex": req.body.query, "$options": "i" }},
			{"content": { "$regex": req.body.query, "$options": "i" }}, 
			{"shortDescription": { "$regex": req.body.query, "$options": "i" }}

		] 
	}).countDocuments(); 
	try {
		const response = await ProductModel.find({  
			"$or":[
			{"title": { "$regex": req.body.query, "$options": "i" }},
			{"content": { "$regex": req.body.query, "$options": "i" }}, 
			{"shortDescription": { "$regex": req.body.query, "$options": "i" }}
			],
		})
		res.json({status:200,total,message: 'Search results', response });  
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
						message: 'This Id does not exist in Products Model.',
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
		videoId
	} = req.body; 

	if (req.files && req.files.mediaId && req.files.videoId ) {   
		const data = async (data) => {
			const newMedia = await new MediaModel({
				url: data.Location || null, 
				title: 'product',
				mediaKey: data.Key, 
				alt: req.body.alt || null,     
			});
			newMedia.save(); 
			const mediaIds = newMedia._id;  
		const videoData = async (data) => {
				const newVideo = await new VideoModel({    
					url: data.Location || null, 
					title: 'product',
					mediaKey: data.Key,
					alt: req.body.alt || null,       
				});
				newVideo.save(); 
				const videoIds = newVideo._id; 
			const newProduct = await new ProductModel({ 
				title,
				order,
				mediaId: mediaIds,
				videoId: videoIds,
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
		await S3.uploadNewVideo(req, res, videoData)
	}
	await S3.uploadNewMedia(req, res, data) 
    } else if (req.files && req.files.mediaId && !req.files.videoId && !req.body.videoId) { 
		const data = async (data) => {
			const newMedia = await new MediaModel({
				url: data.Location || null, 
				title: 'product',
				mediaKey: data.Key, 
				alt: req.body.alt || null,     
			});
			newMedia.save(); 
			const mediaIds = newMedia._id;  
			const newProduct = await new ProductModel({   
				title,
				order,
				mediaId:mediaIds,
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
	    await S3.uploadNewMedia(req, res, data) 
	
	} else if (req.files && req.files.videoId && !req.files.mediaId && !req.body.mediaId) {
		const videoData = async (data) => {
			const newVideo = await new VideoModel({
				url: data.Location || null, 
				title: 'product',
				mediaKey: data.Key, 
				alt: req.body.alt || null,     
			});
			newVideo.save(); 
			const videoIds = newVideo._id;  
			const newProduct = await new ProductModel({   
				title,
				order,
				videoId:videoIds,
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
	    await S3.uploadNewVideo(req, res, videoData) 
	} else if (req.body.mediaId && req.body.videoId) {
		const newProduct = await new ProductModel({   
			title,
			order,
			mediaId,
			videoId,
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
	} else if (req.files && req.files.mediaId && req.body.videoId) { 
		const data = async (data) => {
			const newMedia = await new MediaModel({
				url: data.Location || null, 
				title: 'product',
				mediaKey: data.Key, 
				alt: req.body.alt || null,     
			});
			newMedia.save(); 
			const mediaIds = newMedia._id;  
			const newProduct = await new ProductModel({   
				title,
				order,
				mediaId:mediaIds,
				videoId:videoId,
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
	    await S3.uploadNewMedia(req, res, data) 
	
	} else if (req.files && req.files.videoId && req.body.mediaId) {
		const videoData = async (data) => {
			const newVideo = await new VideoModel({
				url: data.Location || null, 
				title: 'product',
				mediaKey: data.Key, 
				alt: req.body.alt || null,     
			});
			newVideo.save(); 
			const videoIds = newVideo._id;  
			const newProduct = await new ProductModel({   
				title,
				order,
				videoId:videoIds,
				mediaId:mediaId,
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
	    await S3.uploadNewVideo(req, res, videoData) 
	}  else if (req.body.mediaId && !req.body.videoId && !req.files){
		const newProduct = await new ProductModel({
			title,
			order,
			isHomePage,
			mediaId:mediaId,
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
	}  else if (req.body.videoId && !req.body.mediaId && !req.files){
		const newProduct = await new ProductModel({
			title,
			order,
			isHomePage,
			videoId:videoId,
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
		const newProduct = await new ProductModel({
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
			.then(async(doesExist) => {
				if(doesExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Products Model.',
					})
				} else {
					if (req.files && req.files.mediaId && req.files.videoId ) {
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
											).catch((err) => next({ status: 404, message: err }))
											
										};
										await S3.updateMedia(req, res, media.mediaKey, data);
										const videoData = async (data) => {
											await VideoModel.findByIdAndUpdate(
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
											).catch((err) => next({ status: 404, message: err }))
											
										}
										await S3.updateVideo(req, res, media.mediaKey, videoData);
									}
								);
	
								await ProductModel.findByIdAndUpdate(
									{ _id: req.params.productid },
									{
										$set: {
											title:!req.body.title ? product.title : req.body.title,
											order:!req.body.order ? product.order : req.body.order,
											mediaId: product.mediaId,
											videoId: product.videoId,
											isHomePage: !req.body.isHomePage
												? product.isHomePage
												: req.body.isHomePage,
											content:!req.body.content ? product.content : req.body.content,
											shortDescription:!req.body.shortDescription ? product.shortDescription : req.body.shortDescription,
											buttonText:!req.body.buttonText ? product.buttonText : req.body.buttonText,
											userId: !req.body.userId ? product.userId : req.body.userId,
											isActive: !req.body.isActive ? product.isActive : req.body.isActive,
											isDeleted: !req.body.isDeleted ? product.isDeleted : req.body.isDeleted,
											isBlog: !req.body.isBlog ? product.isBlog : req.body.isBlog,
											isAboveFooter: !req.body.isAboveFooter
												? product.isAboveFooter
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
					} else if (req.files && req.files.mediaId && !req.files.videoId && !req.body.videoId){
						console.log('two')
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
											).catch((err) => next({ status: 404, message: err }))
											
										};
										await S3.updateMedia(req, res, media.mediaKey, data);
									}
								);
								await ProductModel.findByIdAndUpdate(
									{ _id: req.params.productid },
									{
										$set: {
											title:!req.body.title ? product.title : req.body.title,
											order:!req.body.order ? product.order : req.body.order,
											mediaId: product.mediaId,
											videoId: product.videoId,
											isHomePage: !req.body.isHomePage
												? product.isHomePage
												: req.body.isHomePage,
											content:!req.body.content ? product.content : req.body.content,
											shortDescription:!req.body.shortDescription ? product.shortDescription : req.body.shortDescription,
											buttonText:!req.body.buttonText ? product.buttonText : req.body.buttonText,
											userId: !req.body.userId ? product.userId : req.body.userId,
											isActive: !req.body.isActive ? product.isActive : req.body.isActive,
											isDeleted: !req.body.isDeleted ? product.isDeleted : req.body.isDeleted,
											isBlog: !req.body.isBlog ? product.isBlog : req.body.isBlog,
											isAboveFooter: !req.body.isAboveFooter
												? product.isAboveFooter
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
						
					} else if (req.files && !req.files.videoId && req.files.mediaId && !req.body.mediaId ){
                        console.log('three')
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
											).catch((err) => next({ status: 404, message: err }))
											
										};
										await S3.updateMedia(req, res, media.mediaKey, data);
									}
								);
								await ProductModel.findByIdAndUpdate(
									{ _id: req.params.productid },
									{
										$set: {
											title:!req.body.title ? product.title : req.body.title,
											order:!req.body.order ? product.order : req.body.order,
											mediaId: product.mediaId,
											videoId: req.body.videoId,
											isHomePage: !req.body.isHomePage
												? product.isHomePage
												: req.body.isHomePage,
											content:!req.body.content ? product.content : req.body.content,
											shortDescription:!req.body.shortDescription ? product.shortDescription : req.body.shortDescription,
											buttonText:!req.body.buttonText ? product.buttonText : req.body.buttonText,
											userId: !req.body.userId ? product.userId : req.body.userId,
											isActive: !req.body.isActive ? product.isActive : req.body.isActive,
											isDeleted: !req.body.isDeleted ? product.isDeleted : req.body.isDeleted,
											isBlog: !req.body.isBlog ? product.isBlog : req.body.isBlog,
											isAboveFooter: !req.body.isAboveFooter
												? product.isAboveFooter
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
					}  else if (req.files && req.files.videoId && !req.files.mediaId && !req.body.mediaId ){
                        console.log('four')
						await ProductModel.findById({ _id: req.params.productid })
							.then(async (product) => {
								await VideoModel.findById({ _id: product.videoId }).then(
									async (media) => {
										const videoData = async (data) => {
											await VideoModel.findByIdAndUpdate(
												{ _id: product.videoId },
												{
													$set: {
														url: data.Location || null,
														title: 'product',
														mediaKey: data.Key,
														alt: req.body.alt,
													},
												},
												{ useFindAndModify: false, new: true }
											).catch((err) => next({ status: 404, message: err }))
											
										};
										await S3.updateVideo(req, res, media.mediaKey, videoData);
									}
								);
								await ProductModel.findByIdAndUpdate(
									{ _id: req.params.productid },
									{
										$set: {
											title:!req.body.title ? product.title : req.body.title,
											order:!req.body.order ? product.order : req.body.order,
											mediaId: product.mediaId,
											videoId: product.videoId,
											isHomePage: !req.body.isHomePage
												? product.isHomePage
												: req.body.isHomePage,
											content:!req.body.content ? product.content : req.body.content,
											shortDescription:!req.body.shortDescription ? product.shortDescription : req.body.shortDescription,
											buttonText:!req.body.buttonText ? product.buttonText : req.body.buttonText,
											userId: !req.body.userId ? product.userId : req.body.userId,
											isActive: !req.body.isActive ? product.isActive : req.body.isActive,
											isDeleted: !req.body.isDeleted ? product.isDeleted : req.body.isDeleted,
											isBlog: !req.body.isBlog ? product.isBlog : req.body.isBlog,
											isAboveFooter: !req.body.isAboveFooter
												? product.isAboveFooter
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
					}  else if (req.files && req.files.videoId && !req.files.mediaId && req.body.mediaId ){
                        console.log('five')
						await ProductModel.findById({ _id: req.params.productid })
							.then(async (product) => {
								await VideoModel.findById({ _id: product.videoId }).then(
									async (media) => {
										const videoData = async (data) => {
											await VideoModel.findByIdAndUpdate(
												{ _id: product.videoId },
												{
													$set: {
														url: data.Location || null,
														title: 'product',
														mediaKey: data.Key,
														alt: req.body.alt,
													},
												},
												{ useFindAndModify: false, new: true }
											).catch((err) => next({ status: 404, message: err }))
											
										};
										await S3.updateVideo(req, res, media.mediaKey, videoData);
									}
								);
	
								await ProductModel.findByIdAndUpdate(
									{ _id: req.params.productid },
									{
										$set: {
											title:!req.body.title ? product.title : req.body.title,
											order:!req.body.order ? product.order : req.body.order,
											mediaId: product.mediaId,
											videoId: product.videoId,
											isHomePage: !req.body.isHomePage
												? product.isHomePage
												: req.body.isHomePage,
											content:!req.body.content ? product.content : req.body.content,
											shortDescription:!req.body.shortDescription ? product.shortDescription : req.body.shortDescription,
											buttonText:!req.body.buttonText ? product.buttonText : req.body.buttonText,
											userId: !req.body.userId ? product.userId : req.body.userId,
											isActive: !req.body.isActive ? product.isActive : req.body.isActive,
											isDeleted: !req.body.isDeleted ? product.isDeleted : req.body.isDeleted,
											isBlog: !req.body.isBlog ? product.isBlog : req.body.isBlog,
											isAboveFooter: !req.body.isAboveFooter
												? product.isAboveFooter
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
					}  else if (!req.files && req.body.videoId && req.body.mediaId ){
                        console.log('six')
						await ProductModel.findById({ _id: req.params.productid })
							.then(async (product) => {
								await ProductModel.findByIdAndUpdate(
									{ _id: req.params.productid },
									{
										$set: {
											title:!req.body.title ? product.title : req.body.title,
											order:!req.body.order ? product.order : req.body.order,
											mediaId: req.body.mediaId,
											videoId: req.body.videoId,
											isHomePage: !req.body.isHomePage
												? product.isHomePage
												: req.body.isHomePage,
											content:!req.body.content ? product.content : req.body.content,
											shortDescription:!req.body.shortDescription ? product.shortDescription : req.body.shortDescription,
											buttonText:!req.body.buttonText ? product.buttonText : req.body.buttonText,
											userId: !req.body.userId ? product.userId : req.body.userId,
											isActive: !req.body.isActive ? product.isActive : req.body.isActive,
											isDeleted: !req.body.isDeleted ? product.isDeleted : req.body.isDeleted,
											isBlog: !req.body.isBlog ? product.isBlog : req.body.isBlog,
											isAboveFooter: !req.body.isAboveFooter
												? product.isAboveFooter
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
					} else if (req.body.mediaId && !req.body.videoId && !req.files ){
                        console.log('seven')
						await ProductModel.findById({ _id: req.params.productid })
							.then(async (product) => {
								await ProductModel.findByIdAndUpdate(
									{ _id: req.params.productid },
									{
										$set: {
											title:!req.body.title ? product.title : req.body.title,
											order:!req.body.order ? product.order : req.body.order,
											mediaId: req.body.mediaId,
											videoId: product.videoId,
											isHomePage: !req.body.isHomePage
												? product.isHomePage
												: req.body.isHomePage,
											content:!req.body.content ? product.content : req.body.content,
											shortDescription:!req.body.shortDescription ? product.shortDescription : req.body.shortDescription,
											buttonText:!req.body.buttonText ? product.buttonText : req.body.buttonText,
											userId: !req.body.userId ? product.userId : req.body.userId,
											isActive: !req.body.isActive ? product.isActive : req.body.isActive,
											isDeleted: !req.body.isDeleted ? product.isDeleted : req.body.isDeleted,
											isBlog: !req.body.isBlog ? product.isBlog : req.body.isBlog,
											isAboveFooter: !req.body.isAboveFooter
												? product.isAboveFooter
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
					} else if (req.body.videoId && !req.body.mediaId && !req.files ){
                        console.log('eight')
						await ProductModel.findById({ _id: req.params.productid })
						.then(async (product) => {
							await ProductModel.findByIdAndUpdate(
								{ _id: req.params.productid },
								{
									$set: {
										title:!req.body.title ? product.title : req.body.title,
										order:!req.body.order ? product.order : req.body.order,
										mediaId: product.mediaId,
										videoId: req.body.videoId,
										isHomePage: !req.body.isHomePage
												? product.isHomePage
												: req.body.isHomePage,
										content:!req.body.content ? product.content : req.body.content,
										shortDescription:!req.body.shortDescription ? product.shortDescription : req.body.shortDescription,
										buttonText:!req.body.buttonText ? product.buttonText : req.body.buttonText,
										userId: !req.body.userId ? product.userId : req.body.userId,
										isActive: !req.body.isActive ? product.isActive : req.body.isActive,
										isDeleted: !req.body.isDeleted ? product.isDeleted : req.body.isDeleted,
										isBlog: !req.body.isBlog ? product.isBlog : req.body.isBlog,
										isAboveFooter: !req.body.isAboveFooter
												? product.isAboveFooter
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
						console.log('nine')
						await ProductModel.findById({ _id: req.params.productid })
							.then(async (product) => {
								await ProductModel.findByIdAndUpdate(
									{ _id: req.params.productid },
									{
										$set: {
											title:!req.body.title ? product.title : req.body.title,
											order:!req.body.order ? product.order : req.body.order,
											mediaId: product.mediaId,
											videoId: product.videoId,
											isHomePage: !req.body.isHomePage
												? product.isHomePage
												: req.body.isHomePage,
											content:!req.body.content ? product.content : req.body.content,
											shortDescription:!req.body.shortDescription ? product.shortDescription : req.body.shortDescription,
											buttonText:!req.body.buttonText ? product.buttonText : req.body.buttonText,
											userId: !req.body.userId ? product.userId : req.body.userId,
											isActive: !req.body.isActive ? product.isActive : req.body.isActive,
											isDeleted: !req.body.isDeleted ? product.isDeleted : req.body.isDeleted,
											isBlog: !req.body.isBlog ? product.isBlog : req.body.isBlog,
											isAboveFooter: !req.body.isAboveFooter
												? product.isAboveFooter
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
