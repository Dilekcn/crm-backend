const MenusModel = require('../model/Menu.model');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await MenusModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await MenusModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.create = async (req, res) => {
	const { parentId, text, link, iconClassName, order, isActive, isDeleted } = req.body;
	const newPost = await new MenusModel({
		parentId,
		text,
		link,
		iconClassName,
		order,
		isActive,
		isDeleted,
	});
	newPost
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New menu is created successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.getSingleMenu = async (req, res) => {
	await MenusModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, message: data });
		}
	});
};

exports.getMenuByParentId = async (req, res) => {
	await MenusModel.find({ parentId: req.params.parentId }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.updateMenu = async (req, res) => {
	await MenusModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) =>
			res.json({ status: 200, message: 'Menu is updated successfully', data })
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeSingleMenu = async (req, res) => {
	await MenusModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) =>
			res.json({ status: 200, message: 'Menu is deleted successfully', data })
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
