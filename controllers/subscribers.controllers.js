const SubscribersModel = require('../model/Subscribers.model');
const nodemailer = require('nodemailer');
const mongoose = require('mongoose')
require('dotenv').config();

const transporter = nodemailer.createTransport({
	service: 'gmail',
	auth: {
		user: process.env.email,
		pass: process.env.password,
	},
});

exports.getAll = async (req, res, next) => {
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
		next({ status: 404, message: err });
	}
};

exports.getWithQuery = async (req, res, next) => {
	try {
		const query =
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
		const { page, limit } = req.query;
		const total = await SubscribersModel.find(query).countDocuments();
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
		next({ status: 404, message: error });
	}
};
exports.searchSubscribers = async (req, res, next) => {  
	const total = await SubscribersModel.find({
		"$or":[
			{"email": { "$regex": req.body.query, "$options": "i" }},
			{"name": { "$regex": req.body.query, "$options": "i" }}, 
		] 
	}).countDocuments(); 
	try {
		const response = await SubscribersModel.find({  
			"$or":[
			{"email": { "$regex": req.body.query, "$options": "i" }},
			{"name": { "$regex": req.body.query, "$options": "i" }}, 
			],
		})
		res.json({status:200,total,message: 'Search results', response });  
	} catch (error) {
		next({ status: 404, message: error });  
	}
};

exports.getSingleSubscriber = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await SubscribersModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Subscribers Model.',
					})
				} else {
					await SubscribersModel.findById({ _id: req.params.id }, (err, data) => {
						if (err) {
							next({ status: 404, message: err });
						} else {
							res.json({ status: 200, data });
						}
					})
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.create = (req, res, next) => {
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
		.catch((err) => next({ status: 404, message: err }));
};

exports.updateSubscriber = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await SubscribersModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Subscribers Model.',
					})
				} else {
					await SubscribersModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
					.then((data) => res.json({ status: 200, message: 'Successfully updated', data }))
					.catch((err) => next({ status: 400, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
}

exports.delete = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await SubscribersModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Subscribers Model.',
					})
				} else {
					const { id } = req.params;

					SubscribersModel.findByIdAndDelete({ _id: id })
						.then((data) =>
							res.json({ status: 200, message: 'Subscriber is deleted successfully', data })
						)
						.catch((err) => next({ status: 404, error: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
