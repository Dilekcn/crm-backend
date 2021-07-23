const SubscribersModel = require('../model/Subscribers.model');
const nodemailer = require('nodemailer');
const { response } = require('express');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.email,
		pass: process.env.password,
	},
});

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await SubscribersModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await SubscribersModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (err) {
		res.json({ status: 404, message: err });
	}
};

exports.getWithQuery = async (req, res) => {
	try {
		const query =
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
		const { page, limit } = req.query;
		const total = await SubscribersModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const response = await SubscribersModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		res.json({
			message: 'Filtered subscribers',
			total,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.create = (req, res) => {
	const newSubscriber = new SubscribersModel({
		email: req.body.email,
		name: req.body.name,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	});

	newSubscriber
		.save()
		.then((response) => response)
		.then((data) => {
			const option = {
				from: process.env.email,
				to: req.body.email,
				subject: 'Welcome',
				text: 'Welcome to CRM',
			};

			transporter.sendMail(option, (err, info) => {
				if (err) {
					res.json({ status: 404, message: err });
					return;
				} else {
					res.json({
						message: 'Subscribed Successfully and Email Sent',
						status: true,
						info,
						data,
					});
				}
			});
		})
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.delete = (req, res) => {
	const { id } = req.params;

	SubscribersModel.findByIdAndDelete({ _id: id })
		.then((data) =>
			res.json({ status: 200, message: 'Subscriber is deleted successfully', data })
		)
		.catch((err) => res.json({ status: 404, error: err }));
};
