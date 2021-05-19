const mongoose = require('mongoose');

const RolesModel = require('../model/Roles.model');

exports.getAllRoles = async (req, res) => {
	try {
		const response = RolesModel.find();
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};
