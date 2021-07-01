const mongoose = require('mongoose');
const IconBoxModel = require('../model/IconBox.model');

exports.getAll = async (req, res) => {
	try {
		const response = await IconBoxModel.find().sort({ createdAt: -1 });
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const newPost = await new IconBoxModel({
		contentName: req.body.contentName,
		routeName: req.body.routeName,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		iconName: req.body.iconName,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	});
	newPost
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
};

exports.getSingleIconBox = async (req, res) => {
	await IconBoxModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getIconBoxByTitle = async (req, res) => {
	await IconBoxModel.findOne({ title: req.params.title }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getIconBoxByAuthor = async (req, res) => {
	await IconBoxModel.findOne({ author: req.params.author }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.updateIconBox = async (req, res) => {
	await IconBoxModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.removeSingleIconBox = async (req, res) => {
	await IconBoxModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
