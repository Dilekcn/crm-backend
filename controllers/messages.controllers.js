const mongoose = require('mongoose');
const MessagesModel = require('../model/Messages.model');

exports.getAll = async (req, res) => {
	try {
		const {page = 1, limit} = req.query
		const response = await MessagesModel.find().limit(limit * 1).skip((page - 1) * limit).sort({ createdAt: -1 });
		const total = await MessagesModel.find().count()
		const pages = limit === undefined ? 1 : Math.ceil(total / limit)
		res.json({total:total, pages, response});;
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const {
		firstname,
		lastname,
		subject,
		content,
		email,
		phoneNumber,
		isRead,
		isDeleted,
		isReplied,
	} = req.body;
	const newPost = await new MessagesModel({
		firstname,
		lastname,
		subject,
		content,
		email,
		phoneNumber,
		isRead,
		isDeleted,
		isReplied,
	});
	newPost
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
};

exports.getSingleMessage = async (req, res) => {
	await MessagesModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getMessageBySubject = async (req, res) => {
	await MessagesModel.find({ subject: req.params.subject }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.updateMessage = async (req, res) => {
	await MessagesModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.removeSingleMessage = async (req, res) => {
	await MessagesModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
