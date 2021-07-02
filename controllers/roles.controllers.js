const RolesModel = require('../model/Roles.model');

exports.getAllRoles = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await RolesModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		res.json({ status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.getSingleRole = async (req, res) => {
	await RolesModel.findById({ _id: req.params.roleid }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
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
				status: 200,
				message: 'Added new role successfully.',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.updateRole = async (req, res) => {
	await RolesModel.findByIdAndUpdate({ _id: req.params.roleid }, { $set: req.body })
		.then((data) =>
			res.json({ status: 200, message: 'Role is updated successfully', data })
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeRole = async (req, res) => {
	await RolesModel.findByIdAndDelete({ _id: req.params.roleid })
		.then((data) =>
			res.json({ status: 200, message: 'Role is deleted successfully', data })
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
