const CommentsModel = require('../model/Comment.model');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await CommentsModel.find()
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

		const total = await CommentsModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.getWithQuery = async (req, res) => {
	
	try {
		const  query  = typeof req.body.query==="string" ?  JSON.parse(req.body.query) : req.body.query
		const { page = 1, limit } = req.query;	
		const response = await CommentsModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);	
		res.json({message: 'Filtered Comments', total:response.length,pages,status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};



exports.create = async (req, res) => {
	const newComment = await new CommentsModel({
		userId: req.body.userId,
		title: req.body.title,
		content: req.body.content,
		isActive: req.body.isActive,
		reasonToBlock: req.body.reasonToBlock,
		isDeleted: req.body.isDeleted,
	});

	newComment
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New comment is created successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.getSingleComment = async (req, res) => {
	await CommentsModel.findById({ _id: req.params.id }, (err, data) => {
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

exports.getCommentsByUserId = async (req, res) => {
	const { page, limit } = req.query;
	const total = await CommentsModel.find().countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	await CommentsModel.find({ userId: req.params.userid }, (err, data) => {
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

exports.updateComment = async (req, res) => {
	await CommentsModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json({ status: 200, message: 'Successfully updated', data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeSingleComment = async (req, res) => {
	await CommentsModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};
