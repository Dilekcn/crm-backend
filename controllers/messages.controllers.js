const MessagesModel = require('../model/Messages.model');
const mongoose = require('mongoose')

exports.getAll = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await MessagesModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await MessagesModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		next({ status: 404, message: error });
	}
};

exports.getWithQuery = async (req, res, next) => {
	try {
		const query =
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
		const { page = 1, limit } = req.query;
		const response = await MessagesModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await MessagesModel.find(query).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({
			message: 'Filtered messages',
			total,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		next({ status: 404, message: error });
	}
};
exports.searchMessages = async (req, res, next) => {  
	const total = await MessagesModel.find({
		"$or":[
			{"firstname": { "$regex": req.body.query, "$options": "i" }},
			{"lastname": { "$regex": req.body.query, "$options": "i" }}, 
			{"subject": { "$regex": req.body.query, "$options": "i" }}, 
			{"content": { "$regex": req.body.query, "$options": "i" }}, 
			{"email": { "$regex": req.body.query, "$options": "i" }}, 
		] 
	}).countDocuments(); 
	try {
		const response = await MessagesModel.find({  
			"$or":[
			{"firstname": { "$regex": req.body.query, "$options": "i" }},
			{"lastname": { "$regex": req.body.query, "$options": "i" }}, 
			{"subject": { "$regex": req.body.query, "$options": "i" }}, 
			{"content": { "$regex": req.body.query, "$options": "i" }}, 
			{"email": { "$regex": req.body.query, "$options": "i" }},  
			],
			// "isActive":req.body.isActive ? req.body.isActive : "true"
		})
		res.json({status:200,total,message: 'Search results', response });  
	} catch (error) {
		next({ status: 404, message: error });  
	}
};

exports.create = async (req, res, next) => {
	const {
		firstname,
		lastname,
		subject,
		content,
		email,
		phoneNumber,
		isActive,
		isRead,
		isDeleted,
		isReplied,
	} = req.body;

	const newMessage = await new MessagesModel({
		firstname,
		lastname,
		subject,
		content,
		email,
		phoneNumber,
		isActive,
		isRead,
		isDeleted,
		isReplied,
	});
	newMessage
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New message is created successfully',
				response,
			})
		)
		.catch((err) => next({ status: 400, message: err }));
};

exports.getSingleMessage = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await MessagesModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Messages Model.',
					})
				} else {
					await MessagesModel.findById({ _id: req.params.id }, (err, data) => {
						if (err) {
							next({ status: 404, message: err });
						} else {
							res.json({ status: 200, data });
						}
					});
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.getMessagesBySubject = async (req, res, next) => {
	const { page, limit } = req.query;
	const total = await MessagesModel.find().countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);

	await MessagesModel.find({ subject: req.params.subject }, (err, data) => {
		if (err) {
			next({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.sort({ createdAt: -1 });
};

exports.getMessagesByEmail = async (req, res, next) => {
	const { page, limit } = req.query;
	const total = await MessagesModel.find().countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);

	await MessagesModel.find({ email: req.params.email }, (err, data) => {
		if (err) {
			next({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.sort({ createdAt: -1 });
};

exports.updateMessage = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await MessagesModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Messages Model.',
					})
				} else {
					await MessagesModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
					.then((data) =>
						res.json({ status: 200, message: 'Message is updated successfully', data })
					)
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.removeSingleMessage = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await MessagesModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Messages Model.',
					})
				} else {
					await MessagesModel.findByIdAndDelete({ _id: req.params.id })
					.then((data) =>
						res.json({ status: 200, message: 'Message is deleted successfully', data })
					)
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
