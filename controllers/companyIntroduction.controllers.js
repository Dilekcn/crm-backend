const CompanyIntroductionModel = require('../model/CompanyIntroduction.model');
const mongoose = require('mongoose')

exports.getAll = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await CompanyIntroductionModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await CompanyIntroductionModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		next({ status: 404, message: error });
	}
};

exports.getWithQuery = async (req, res, next) => {
	try {	
	const query =typeof req.body.query === 'string'	? JSON.parse(req.body.query): req.body.query;
	const { page = 1, limit } = req.query;
	const response = await CompanyIntroductionModel.find(query)

			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await CompanyIntroductionModel.find(query).countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({
			message: 'Filtered CompanyIntroduction',
			total,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		next({ status: 404, message: error });
	}
};

exports.searchCompanyIntroductions = async (req, res, next) => {  
	const total = await CompanyIntroductionModel.find({
		"$or":[
			{"title": { "$regex": req.body.query, "$options": "i" }},
			{"subTitle": { "$regex": req.body.query, "$options": "i" }},  
			{"shortDescription": { "$regex": req.body.query, "$options": "i" }}, 
		] 
	}).countDocuments(); 
	try {
		const response = await CompanyIntroductionModel.find({  
			"$or":[
				{"title": { "$regex": req.body.query, "$options": "i" }} ,
				{"subTitle": { "$regex": req.body.query, "$options": "i" }}, 
				{"shortDescription": { "$regex": req.body.query, "$options": "i" }}, 
			],
			// "isActive":req.body.isActive ? req.body.isActive : "true"
		})
		res.json({status:200,total,message: 'Search results', response });  
	} catch (error) {
		next({ status: 404, message: error });  
	}
}; 

exports.createIntroduction = async (req, res, next) => {
	const { title, subTitle, iconName, shortDescription, isActive, isDeleted } = req.body;

	const newIntroduction = await new CompanyIntroductionModel({
		title,
		subTitle,
		iconName,
		shortDescription,
		isActive,
		isDeleted,
	});
	newIntroduction
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'Added new company introduction successfully',
				response,
			})
		)
		.catch((error) => next({ status: 404, message: error }));
};

exports.getSingleIntroduction = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await CompanyIntroductionModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Company Introductions Model.',
					})
				} else {
					await CompanyIntroductionModel.findById({ _id: req.params.id }, (err, data) => {
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

exports.getSingleIntroductionByTitle = async (req, res, next) => {
	await CompanyIntroductionModel.findOne({ title: req.params.title }, (err, data) => {
		if (err) {
			next({ status: 404, message: err });
		} else if(data === null) {
			res.json({status: 200, message:"Title did not match"})
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.updateIntroductions = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await CompanyIntroductionModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Company Introductions Model.',
					})
				} else {
					await CompanyIntroductionModel.findByIdAndUpdate(
						{ _id: req.params.id },
						{ $set: req.body }
					)
						.then((data) => res.json({ status: 200, data }))
						.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};

exports.removeIntroduction = async (req, res, next) => {
	if(mongoose.isValidObjectId(req.params.id)) {
		await CompanyIntroductionModel.findById({_id: req.params.id})
			.then(async(isExist) => {
				if(isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Company Introductions Model.',
					})
				} else {
					await CompanyIntroductionModel.findByIdAndDelete({ _id: req.params.id })
					.then((data) => res.json({ status: 200, data }))
					.catch((err) => next({ status: 404, message: err }));
				}
			}).catch(err => next({status: 500, message:err}))
	} else {
		next({ status: 400, message: 'Object Id is not valid.' })
	}
};
