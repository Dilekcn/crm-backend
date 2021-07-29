const CompanyIntroductionModel = require('../model/CompanyIntroduction.model');

exports.getAll = async (req, res) => {
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
		res.json({ status: 404, message: error });
	}
};

exports.getWithQuery = async (req, res) => {
	try {
		const query =
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
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
		res.json({ status: 404, message: error });
	}
};

exports.createIntroduction = async (req, res) => {
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
		.catch((error) => res.json({ status: 404, message: error }));
};

exports.getSingleIntroduction = async (req, res) => {
	await CompanyIntroductionModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.getSingleIntroductionByTitle = async (req, res) => {
	await CompanyIntroductionModel.findOne({ title: req.params.title }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.updateIntroductions = async (req, res) => {
	await CompanyIntroductionModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{ $set: req.body }
	)
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeIntroduction = async (req, res) => {
	await CompanyIntroductionModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};
