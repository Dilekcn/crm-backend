const SubscribersModel = require('../model/Subscribers.model');
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.email,
		pass: process.env.password,
	},
});

exports.getAll = (req, res) => {
	SubscribersModel.find()
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.create = (req, res) => {
	const newSubscriber = new SubscribersModel({
		email: req.body.email,
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
					res.json({ error: err, status: false });
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
		.catch((err) => res.json(err));
};

exports.delete = (req, res) => {
	const { id } = req.params;

	SubscribersModel.findByIdAndDelete({ _id: id })
		.then((data) =>
			res.json({ message: 'Deleted Successfully', status: true, data }),
		)
		.catch((err) => res.json({ error: err, status: false }));
};
