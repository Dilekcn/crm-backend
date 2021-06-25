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
		title: 'user',
		description: req.body.mediaId.description || null,
	});

	newMedia.save();

	const { firstname, lastname, email, password, isActive, isDeleted } =
		req.body;
	const salt = await bcrypt.genSalt();
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = await new UserModel({
		firstname: firstname,
		lastname: lastname,
		email: email,
		isActive: isActive,
		isDeleted: isDeleted,
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
	await UserModel.findByIdAndUpdate(
		{ _id: req.params.id },
		{ $set: req.body },
		{ useFindAndModify: false, new: true }
	)
		.then(async (user) => {
			await MediaModel.findByIdAndUpdate(
				user.mediaId,
				{
					$set: {
						url: req.body.imageId.url,
						description: req.body.imageId.description,
					},
				},
				{ useFindAndModify: false, new: true }
			)
				.then((newImage) => {
					res.send(newImage);
				})
				.catch((err) => {
					console.log(err);
				});
			res.send(user);
		})
		.then((data) => res.json({ message: 'User is successfully updated.', data }))
		.catch((err) => res.json({ message: err }));
};
exports.deleteUser = async (req, res) => {
	await UserModel.findByIdAndRemove({ _id: req.params.id })
		.then((data) => res.json({ message: 'Successfully removed.', data }))
		.catch((err) => res.json({ message: err }));
};
