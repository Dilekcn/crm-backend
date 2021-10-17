const IconBoxModel = require('../model/IconBox.model');
const mongoose = require('mongoose')

exports.getAll = async (req, res, next) => {
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
		next({ status: 404, error });
	}
};

exports.getWithQuery = async (req, res, next) => {
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
		next({ status: 404, message: error });
	}
};
exports.searchIconBox = async (req, res, next) => {  
	const total = await IconBoxModel.find({
		"$or":[
			{"title": { "$regex": req.body.query, "$options": "i" }},
			{"content": { "$regex": req.body.query, "$options": "i" }},  
			{"author": { "$regex": req.body.query, "$options": "i" }}, 
			{"contentName": { "$regex": req.body.query, "$options": "i" }}, 
			{"routeName": { "$regex": req.body.query, "$options": "i" }}, 
			{"iconName": { "$regex": req.body.query, "$options": "i" }}, 
		] 
	}).countDocuments(); 
	try {
		const response = await IconBoxModel.find({  
			"$or":[
				{"title": { "$regex": req.body.query, "$options": "i" }} ,
				{"content": { "$regex": req.body.query, "$options": "i" }}, 
				{"author": { "$regex": req.body.query, "$options": "i" }}, 
				{"contentName": { "$regex": req.body.query, "$options": "i" }}, 
			    {"routeName": { "$regex": req.body.query, "$options": "i" }}, 
			    {"iconName": { "$regex": req.body.query, "$options": "i" }}, 
			],
			// "isActive":req.body.isActive ? req.body.isActive : "true"
		})
		res.json({status:200,total,message: 'Search results', response });  
	} catch (error) {
		next({ status: 404, message: error });  
	}
};

exports.create = async (req, res, next) => {
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
		.catch((err) => next({ status: 404, message: err }));
};

exports.getSingleIconBox = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await IconBoxModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Icon Box Model.',
					})
				} else {
					await IconBoxModel.findById({ _id: req.params.id }, (err, data) => {
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


exports.updateIconBox = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await IconBoxModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Icon Box Model.',
					})
				} else {
					await IconBoxModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
					.then((data) =>
						res.json({ status: 200, message: 'Iconbox is updated successfully', data }))
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.removeSingleIconBox = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await IconBoxModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Icon Box Model.',
					})
				} else {
					await IconBoxModel.findByIdAndDelete({ _id: req.params.id })
					.then((data) =>
						res.json({ status: 200, message: 'Iconbox is deleted successfully', data })
					)
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
