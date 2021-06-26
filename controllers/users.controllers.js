const UserModel = require('../model/User.model');
const MediaModel = require('../model/Media.model');
const RoleModel = require('../model/Roles.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.getAllUsers = async (req, res) => {
	await UserModel.find()
		.populate('roleId', 'name')
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.createUser = async (req, res) => {
	const newMedia = await new MediaModel({
		url: req.body.mediaId.url || null,
		title: 'users',
		description: req.body.mediaId.description || null,
	});

	newMedia.save();

	const { firstname, lastname, email, password, isActive, isDeleted, roleId } =
		req.body;
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = await new UserModel({
		firstname: firstname,
		lastname: lastname,
		email: email,
		isActive: isActive,
		isDeleted: isDeleted,
		roleId,
		password: hashedPassword,
		mediaId: newMedia._id,
	});
	newUser
		.save()
		.then((data) =>
			res.json({ status: true, message: 'Signed up successfully.', data })
		)
		.catch((err) => res.json({ status: false, message: err }));
};

exports.login = async (req, res) => {
	const { email, password } = req.body;

	await UserModel.findOne({ email: email })
		.then(async (data) => {
			if (await bcrypt.compare(password, data.password)) {
				const token = jwt.sign(
					{ name: email, role: data.role },
					process.env.ACCESS_TOKEN_SECRET,
					{ expiresIn: '1h' }
				);
				res.json({
					status: true,
					firstname: data.firstname,
					lastname: data.lastname,
					email: data.email,
					id: data._id,
					token: token,
				});
			} else {
				res.json({ status: false, message: 'Wrong password' });
			}
		})
		.catch((err) => res.json({ message: 'Email does not exist' }));
};

exports.updateUser = async (req, res) => {
	await UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			await MediaModel.findByIdAndUpdate(
				{ _id: user.mediaId },
				{
					$set: {
						url: req.body.mediaId.url,
						title: 'users',
						description: req.body.mediaId.description,
					},
				},
				{ useFindAndModify: false, new: true }
			);

			const { firstname, lastname, email, password } = req.body;
			await UserModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						firstname,
						lastname,
						email,
						password,
						isActive: !req.body.isActive ? true : req.body.isActive,
						isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
						roleId: !req.body.roleId ? user.roleId : req.body.roleId,
						mediaId: user.mediaId,
					},
				},
				{ useFindAndModify: false, new: true }
			)
				.then((data) =>
					res.json({ message: 'User is updated successfully', data })
				)
				.catch((err) => res.json({ message: err }));
		})
		.then((data) => data)
		.catch((err) => res.json(err));
};

exports.deleteUser = async (req, res) => {
	await UserModel.findByIdAndRemove({ _id: req.params.id })
		.then((data) => res.json({ message: 'User is removed successfully.', data }))
		.catch((err) => res.json({ message: err }));
};
