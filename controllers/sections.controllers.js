const SectionModel = require('../model/Section.model');
const mongoose = require('mongoose')

exports.getAll = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await SectionModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })   
		const total = await SectionModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		next({status:500, message:error});
	}
};

exports.create = async (req, res, next) => {
	const newSection = await new SectionModel({
		secTitle: req.body.secTitle,
		isActive: req.body.isActive,
		secType: req.body.secType,
	});

	newSection 
		.save() 
		.then((response) =>
			res.json({
				status: 200,
				message: 'New Section is created successfully',
				response,
			})
		)
		.catch((err) => next({ status: 400, message: err }));
};

exports.getSingleSection = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await SectionModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Sections Model.',
					})
				} else {
					await SectionModel.findById({ _id: req.params.id }, (err, data) => {
						if (err) {
							next({ status: 400, message: err });
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
exports.getSingleSectionByType = async (req, res, next) => {
	const { page, limit } = req.query;
	const secType = req.params.secType.toLowerCase();
	const total = await SectionModel.find({ secType }).countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	await SectionModel.find({ secType }, (err, data) => {
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




exports.updateSection = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await SectionModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Sections Model.',
					})
				} else {
					await SectionModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
					.then((data) => res.json({ message: 'Successfully updated', data }))
					.catch((err) => next({ message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.removeSingleSection = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await SectionModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Sections Model.',
					})
				} else {
					await SectionModel.findByIdAndDelete({ _id: req.params.id })
					.then((data) => res.json({ status: 200, data }))
					.catch((err) => next({ status: false, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
