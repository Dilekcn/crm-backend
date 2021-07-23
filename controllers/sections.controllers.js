const SectionModel = require('../model/Section.model');

exports.getAll = async (req, res) => {
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
		res.status(500).json(error);
	}
};

exports.create = async (req, res) => {
	const newSection = await new SectionModel({
		secTitle: req.body.title,
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
		.catch((err) => res.json({ status: false, message: err }));
};

exports.getSingleSection = async (req, res) => {
	await SectionModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: false, message: err });
		} else {
			res.json({ data });
		}
	})
};
exports.getSingleSectionByType = async (req, res) => {
	const { page, limit } = req.query;
	const title = req.params.title.toLowerCase();
	const total = await MediaModel.find({ title }).countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);
	await SectionModel.find({ secType }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.sort({ createdAt: -1 });
};




exports.updateSection = async (req, res) => {
	await SectionModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) => res.json({ message: 'Successfully updated', data }))
		.catch((err) => res.json({ message: err }));
};

exports.removeSingleSection = async (req, res) => {
	await SectionModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: false, message: err }));
};
