const IconBoxModel = require('../model/IconBox.model');

exports.getAll = async (req, res) => {
	try {
		const { page, limit } = req.query;
		const response = await IconBoxModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await IconBoxModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, error });
	}
};

exports.getWithQuery = async (req, res) => {
	try {
		const query =
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
		const { page = 1, limit } = req.query;
		const response = await IconBoxModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await IconBoxModel.find(query).countDocuments;
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({
			message: 'Filtered icon-boxes',
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
	const newIconBox = await new IconBoxModel({
		contentName: req.body.contentName,
		routeName: req.body.routeName,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		iconName: req.body.iconName,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	});
	newIconBox
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New iconbox is successfully created',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.getSingleIconBox = async (req, res) => {
	await IconBoxModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.getIconBoxByTitle = async (req, res) => {
	await IconBoxModel.findOne({ title: req.params.title }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.getIconBoxByAuthor = async (req, res) => {
	await IconBoxModel.findOne({ author: req.params.author }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.updateIconBox = async (req, res) => {
	await IconBoxModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) =>
			res.json({ status: 200, message: 'Iconbox is updated successfully', data })
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeSingleIconBox = async (req, res) => {
	await IconBoxModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) =>
			res.json({ status: 200, message: 'Iconbox is deleted successfully', data })
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
