const BlogsModel = require('../model/Blog.model');

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
			});

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
			});

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
	const newBlog = await new BlogsModel({
		userId: req.body.userId,
		title: req.body.title,
		content: req.body.content,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	});

	newBlog
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New Blog is created successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.getSingleBlog = async (req, res) => {
	await BlogsModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
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
			select: 'url',
		},
	});
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
		});
};

exports.updateBlog = async (req, res) => {
	await BlogsModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json({ status: 200, message: 'Successfully updated', data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeSingleBlog = async (req, res) => {
	await BlogsModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};
