const mongoose = require('mongoose');

const RolesModel = require('../model/Roles.model');

exports.getAllRoles = async (req, res) => {
	try {
		const response = await RolesModel.find().sort({ createdAt: -1 });
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.getSingleRole = async (req, res) => {
	await RolesModel.findById({ _id: req.params.roleid }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.createRole = async (req, res) => {
	const newRole = await new RolesModel({
		name: req.body.name,
	});
	newRole
		.save()
		.then((response) =>
			res.json({
				status: true,
				message: 'Added new role successfully.',
				response,
			})
		)
		.catch((error) => res.json({ status: false, message: error }));
};

exports.updateRole = async (req, res) => {
	await RolesModel.findByIdAndUpdate({ _id: req.params.roleid }, { $set: req.body });
};

exports.removeRole = async (req, res) => {
	await RolesModel.findByIdAndDelete({ _id: req.params.roleid })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
