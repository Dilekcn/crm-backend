const RolesModel = require('../model/Roles.model');
const mongoose = require('mongoose')

exports.getAllRoles = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const total = await RolesModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		const response = await RolesModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		next({ status: 404, message: error });
	}
};

exports.getSingleRole = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.roleid)) {
		await RolesModel.findById({_id: req.params.roleid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Roles Model.',
					})
				} else {
					await RolesModel.findById({ _id: req.params.roleid }, (err, data) => {
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

exports.createRole = async (req, res, next) => {
	const newRole = await new RolesModel({
		name: req.body.name,
		delete: req.body.delete
	});
	newRole
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New role is created successfully.',
				response,
			})
		)
		.catch((err) => next({ status: 400, message: err }));
};

exports.updateRole = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.roleid)) {
		await RolesModel.findById({_id: req.params.roleid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Roles Model.',
					})
				} else {
					await RolesModel.findByIdAndUpdate({ _id: req.params.roleid }, { $set: req.body })
					.then((data) =>
						res.json({ status: 200, message: 'Role is updated successfully', data })
					)
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.removeRole = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.roleid)) {
		await RolesModel.findById({_id: req.params.roleid})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Roles Model.',
					})
				} else {
					await RolesModel.findByIdAndDelete({ _id: req.params.roleid })
					.then((data) =>
						res.json({ status: 200, message: 'Role is deleted successfully', data })
					)
					.catch((err) => next({ status: 404, message: err }));
							}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
