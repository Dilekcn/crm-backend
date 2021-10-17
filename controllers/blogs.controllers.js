const BlogsModel = require('../model/Blog.model');
const MediaModel = require('../model/Media.model');
const mongoose = require('mongoose')
const S3 = require('../config/aws.s3.config')

exports.getAll = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await BlogsModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate({
				path: 'userId',
				model: 'user',
				select: 'firstname lastname mediaId',
				populate: {
					path: 'mediaId',
					model: 'media',
					select: 'url',
				},
			})
			.populate('mediaId', 'url title alt');

		const total = await BlogsModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		next({ status: 404, message: error });
	}
};

exports.getWithQuery = async (req, res, next) => {
		try {
			const  query  = typeof req.body.query==="string" ?  JSON.parse(req.body.query) : req.body.query
			const { page = 1, limit } = req.query;	
			const response = await BlogsModel.find(query)
				.limit(limit * 1)
				.skip((page - 1) * limit)
				.sort({ createdAt: -1 })
				.populate({
					path: 'userId',
					model: 'user',
					select: 'firstname lastname mediaId',
					populate: {
						path: 'mediaId',
						model: 'media',
						select: 'url alt',
					},
				})
				.populate('mediaId')
	
			const total = await BlogsModel.find().countDocuments();
			const pages = limit === undefined ? 1 : Math.ceil(total / limit);
			res.json({message: 'Filtered Blogs', total:response.length,pages,status: 200, response });
		} catch (error) {
			next({ status: 404, message: error });
		}
	};

exports.searchBlogs = async (req, res, next) => {  
		const total = await BlogsModel.find({
			"$or":[
				{"title": { "$regex": req.body.query, "$options": "i" }},
				{"content": { "$regex": req.body.query, "$options": "i" }},   
			] 
		}).countDocuments(); 
		try {
			const response = await BlogsModel.find({  
				"$or":[
					{"title": { "$regex": req.body.query, "$options": "i" }} ,
					{"content": { "$regex": req.body.query, "$options": "i" }}, 
				],
				// "isActive":req.body.isActive ? req.body.isActive : "true"
			})
			res.json({status:200,total,message: 'Search results', response });  
		} catch (error) {
			next({ status: 404, message: error });  
		}
}; 

exports.create = async (req, res, next) => {
	if (req.files) {
		const data = async (data) => {
			const newMedia = await new MediaModel({
				title: 'blog',
				url: data.Location || null,
				mediaKey: data.Key,
				alt: req.body.alt || null,
			});

			newMedia.save();

			const { userId, title, content, isActive, isDeleted } = req.body;

			const newBlog = await new BlogsModel({
				userId,
				title,
				content,
				mediaId: newMedia._id,
				isActive,
				isDeleted,
			});
			newBlog
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Added new blog successfully.',
						response,
					})
				)
				.catch((error) => next({ status: 404, message: error }));
		};

		await S3.uploadNewMedia(req, res, data);
	} else if (req.body.mediaId) {
		const { userId, title, content, mediaId, isActive, isDeleted } = req.body;

		const newBlog = await new BlogsModel({
			userId,
			title,
			content,
			mediaId,
			isActive,
			isDeleted,
		});
		newBlog
			.save()
			.then((response) =>
				res.json({
					status: 200,
					message: 'Added new blog successfully.',
					response,
				})
			)
			.catch((error) => next({ status: 404, message: error }));
	} else {
		const data = async (data) => {
			const newMedia = await new MediaModel({
				title: 'blog',
				url: data.Location || null,
				mediaKey: data.Key,
				alt: req.body.alt || null,
			});

			newMedia.save();

			const { userId, title, content, isActive, isDeleted } = req.body;

			const newBlog = await new BlogsModel({
				userId,
				title,
				content,
				mediaId: newMedia._id,
				isActive,
				isDeleted,
			});
			newBlog
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Added new blog successfully.',
						response,
					})
				)
				.catch((error) => next({ status: 404, message: error }));
		};

		await S3.uploadNewMedia(req, res, data);
	}
};

exports.getSingleBlog = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await BlogsModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Blogs Model.',
					})
				} else {
					await BlogsModel.findById({ _id: req.params.id }, (err, data) => {
						if (err) {
							next({ status: 404, message: err });
						} else {
							res.json({ status: 200, data });
						}
					}).populate({
						path: 'userId',
						model: 'user',
						select: 'firstname lastname mediaId',
						populate: {
							path: 'mediaId',
							model: 'media',
							select: 'url alt',
						},
					})
					.populate('mediaId')
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.getBlogsByUserId = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.userid)) {
		await BlogsModel.findOne({ userId: req.params.userid })
		.then(async(isExist) => {
			if (isExist === null) {
				next({
					status: 404,
					message: 'This Id is not exist in Blogs Model.',
				})
			} else {
				const { page, limit } = req.query;
			const total = await BlogsModel.find().countDocuments();
			const pages = limit === undefined ? 1 : Math.ceil(total / limit);
			await BlogsModel.find({ userId: req.params.userid }, (err, data) => {
			if (err) {
				next({ status: 404, message: err });
			} else {
				res.json({ total, pages, status: 200, data });
			}
		})
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate({
				path: 'userId',
				model: 'user',
				select: 'firstname lastname mediaId',
				populate: {
					path: 'mediaId',
					model: 'media',
					select: 'url alt',
				},
			})
			.populate('mediaId')
			}
		}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.updateBlog = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await BlogsModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Blogs Model.',
					})
				} else {
					await BlogsModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
					.then((data) => res.json({ status: 200, message: 'Successfully updated', data }))
					.catch((err) => next({ status: 400, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
}

exports.removeSingleBlog = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await BlogsModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Blogs Model.',
					})
				} else {
					await BlogsModel.findByIdAndDelete({ _id: req.params.id })
					.then((data) => res.json({ status: 200, data }))
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
}