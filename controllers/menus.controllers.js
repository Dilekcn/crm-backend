const MenusModel = require('../model/Menu.model');
const mongoose = require('mongoose')

exports.getAll = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await MenusModel.find()
			.limit(limit * 1) 
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('parentId')
		const total = await MenusModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
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
		const response = await MenusModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('children','text link')
		const total = await MenusModel.find(query).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({
			message: 'Filtered menus',
			total,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		next({ status: 404, message: error });
	}
};
exports.searchMenus = async (req, res, next) => {  
	const total = await MenusModel.find({
		"$or":[
			{"text": { "$regex": req.body.query, "$options": "i" }},
			{"iconClassName": { "$regex": req.body.query, "$options": "i" }}, 
		] 
	}).countDocuments(); 
	try {
		const response = await MenusModel.find({  
			"$or":[
				{"text": { "$regex": req.body.query, "$options": "i" }},
			    {"iconClassName": { "$regex": req.body.query, "$options": "i" }}, 
			],
			// "isActive":req.body.isActive ? req.body.isActive : "true"
		})
		res.json({status:200,total,message: 'Search results', response });  
	} catch (error) {
		next({ status: 404, message: error });  
	}
};

exports.create = async (req, res, next) => {
	const { parentId, text, link, iconClassName, order, isActive, isDeleted,children } = req.body;
	const newMenu = await new MenusModel({
		parentId:req.body.parentId === '' ? null : parentId ,
		text,
		link,
		iconClassName,
		order,
		isActive,
		isDeleted,
		children
	});
	newMenu
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New menu is created successfully',
				response,
			})
		)
		.catch((err) => next({ status: 404, message: err }));
};

exports.getSingleMenu = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await MenusModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Menus Model.',
					})
				} else {
					await MenusModel.findById({ _id: req.params.id }, (err, data) => {
						if (err) {
							next({ status: 404, message: err });
						} else {
							res.json({ status: 200, data });
						}
					})
					.populate('parentId')
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.getMenuByParentId = async (req, res, next) => {
	if(typeof req.params.parentid === 'string') {
		await MenusModel.find({ parentId: req.params.parentid }, (err, data) => {
			if (err) {
				next({ status: 404, message: err });
			} else { 
				res.json({ status: 200, data }); 
			}
		})
		.populate('parentId')
	} else {
		next ({status:400, message: 'Enter parent id.'})
	}
};

exports.updateMenu = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await MenusModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Menus Model.',
					})
				} else {
					await MenusModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
					.then((data) =>
						res.json({ status: 200, message: 'Menu is updated successfully', data })
					)
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.removeSingleMenu = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await MenusModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Menus Model.',
					})
				} else {
					await MenusModel.findByIdAndDelete({ _id: req.params.id })
					.then((data) =>
						res.json({ status: 200, message: 'Menu is deleted successfully', data })
					)
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
