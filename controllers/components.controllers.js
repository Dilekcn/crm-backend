const mongoose = require('mongoose');
const ComponentModel = require('../model/Component');

exports.getAllComponents = async (req, res) => {
	try {
		const response = await ComponentModel.find();
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.getSingleComponent = async (req, res) => {
	await ExpertModel.findById({ _id: req.params.componentid }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.createComponent = async (req, res) => {
	const { name, componentId, description, isActive, isDeleted } = req.body;
	const newComponent = await new ComponentModel({
		name,
		componentId,
		description,
		isActive,
		isDeleted,
	});

	newComponent
		.save()
		.then((response) =>
			res.json({
				status: true,
				message: 'Added new component successfully.',
				response,
			})
		)
		.catch((error) => res.json({ status: false, message: error }));
};
