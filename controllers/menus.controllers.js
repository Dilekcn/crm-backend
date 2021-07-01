const mongoose = require('mongoose');
const MenusModel = require('../model/Menu.model');

exports.getAll = async (req, res) => {
	try {
		const {page = 1, limit} = req.query
		const response = await MenusModel.find().limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
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
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
};

exports.getSingleMenu = async (req, res) => {
	await MenusModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getMenuByParentId = async (req, res) => {
	await MenusModel.find({ parentId: req.params.parentId }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.updateMenu = async (req, res) => {
	await MenusModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.removeSingleMenu = async (req, res) => {
	await MenusModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
