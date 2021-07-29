const BlogsModel = require('../model/Blog.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
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
		res.json({ status: 404, message: error });
	}
};

exports.getWithQuery = async (req, res) => {
	try {
		const query =
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
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
					select: 'url',
				},
			})
			.populate('mediaId', 'url title alt');

		const total = await BlogsModel.find(query).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({
			message: 'Filtered Blogs',
			total,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.create = async (req, res) => {
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
				.catch((error) => res.json({ status: 404, message: error }));
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
			.catch((error) => res.json({ status: 404, message: error }));
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

			const newSlide = await new BlogsModel({
				userId,
				title,
				content,
				mediaId: newMedia._id,
				isActive,
				isDeleted,
			});
			newSlide
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Added new blog successfully.',
						response,
					})
				)
				.catch((error) => res.json({ status: 404, message: error }));
		};

		await S3.uploadNewMedia(req, res, data);
	}
};

exports.getSingleBlog = async (req, res) => {
	await BlogsModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
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
};

exports.getBlogsByUserId = async (req, res) => {
	const { page, limit } = req.query;
	const total = await BlogsModel.find().countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	await BlogsModel.find({ userId: req.params.userid }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
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
				select: 'url',
			},
		})
		.populate('mediaId', 'url title alt');
};

exports.updateBlog = async (req, res) => {
	if (req.files) {
		await BlogsModel.findById({ _id: req.params.id })
			.then(async (blog) => {
				await MediaModel.findById({ _id: blog.mediaId }).then(async (media) => {
					const data = async (data) => {
						await MediaModel.findByIdAndUpdate(
							{ _id: blog.mediaId },
							{
								$set: {
									title: 'blog',
									url: data.Location || null,
									mediaKey: data.Key,
									alt: req.body.alt || null,
								},
							},
							{ useFindAndModify: false, new: true }
						).catch((err) => res.json({ status: 404, message: err }));
					};
					await S3.updateMedia(req, res, media.mediaKey, data);
				});

				const { userId, title, content } = req.body;

				await BlogsModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							userId,
							title,
							content,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
							mediaId: blog.mediaId,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((response) =>
						res.json({
							status: 200,
							message: 'Blog is updated successfully',
							response,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			})
			.catch((err) => res.json({ status: 404, message: err }));
	} else {
		await BlogsModel.findById({ _id: req.params.id })
			.then(async (blog) => {
				const { userId, title, content, mediaId } = req.body;

				await BlogsModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							userId,
							title,
							content,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
							mediaId: !mediaId ? slider.mediaId : mediaId,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((response) =>
						res.json({
							status: 200,
							message: 'Blog is updated successfully',
							response,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			})
			.catch((err) => res.json({ status: 404, message: err }));
	}
};

exports.removeSingleBlog = async (req, res) => {
	await BlogsModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};
