const UserModel = require('../model/User.model');
const MediaModel = require('../model/Media.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const S3 = require('../config/aws.s3.config');

exports.getAllUsers = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await UserModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('roleId', 'name')
			.populate('mediaId', 'url title alt');
		const total = await UserModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (err) {
		res.json({ status: 404, message: err });
	}
};

exports.getSingleUserById = async (req, res) => {
	await UserModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('roleId', 'name')
		.populate('mediaId', 'url title alt');
};

exports.getSingleUserByFirstName = async (req, res) => {
	await UserModel.find({ firstname: req.params.firstname }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('roleId', 'name')
		.populate('mediaId', 'url title alt');
};

exports.getSingleUserByLastName = async (req, res) => {
	await UserModel.find({ lastname: req.params.lastname }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('roleId', 'name')
		.populate('mediaId', 'url title alt');
};

exports.getSingleUserByEmail = async (req, res) => {
	await UserModel.find({ email: req.params.email }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('roleId', 'name')
		.populate('mediaId', 'url title alt');
};

exports.getSingleUserByRoleId = async (req, res) => {
	await UserModel.find({ roleId: req.params.roleid }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	})
		.populate('roleId', 'name')
		.populate('mediaId', 'url title alt');
};

exports.createUser = async (req, res) => {
	if (req.files) {
		const data = async (data) => {
			console.log(req.body);
			const newMedia = await new MediaModel({
				url: data.Location || null,
				title: 'user',
				mediaKey: data.Key,
				alt: req.body.alt || null,
			});

			newMedia.save();

			const { firstname, lastname, email, isActive, isDeleted, roleId, password } =
				req.body;
			const salt = await bcrypt.genSalt();
			const hashedPassword = await bcrypt.hash(password, salt);

			const newUser = await new UserModel({
				firstname,
				lastname,
				email,
				isActive,
				isDeleted,
				password: hashedPassword,
				mediaId: newMedia._id,
				roleId,
			});
			newUser
				.save()
				.then((data) =>
					res.json({ status: 200, message: 'Signed up successfully.', data })
				)
				.catch((err) => res.json({ status: 404, message: err }));
		};
		await S3.uploadNewMedia(req, res, data);
	} else if (req.body.mediaId) {
		const {
			firstname,
			lastname,
			email,
			isActive,
			isDeleted,
			roleId,
			password,
			mediaId,
		} = req.body;
		const salt = await bcrypt.genSalt();
		const hashedPassword = await bcrypt.hash(password, salt);

		const newUser = await new UserModel({
			firstname,
			lastname,
			email,
			isActive,
			isDeleted,
			password: hashedPassword,
			mediaId,
			roleId,
		});
		newUser
			.save()
			.then((data) =>
				res.json({ status: 200, message: 'Signed up successfully.', data })
			)
			.catch((err) => res.json({ status: 404, message: err }));
	} else {
		const data = async (data) => {
			console.log(req.body);
			const newMedia = await new MediaModel({
				url: data.Location || null,
				title: 'user',
				mediaKey: data.Key,
				alt: req.body.alt || null,
			});

			newMedia.save();

			const { firstname, lastname, email, isActive, isDeleted, roleId, password } =
				req.body;
			const salt = await bcrypt.genSalt();
			const hashedPassword = await bcrypt.hash(password, salt);

			const newUser = await new UserModel({
				firstname,
				lastname,
				email,
				isActive,
				isDeleted,
				password: hashedPassword,
				mediaId: newMedia._id,
				roleId,
			});
			newUser
				.save()
				.then((data) =>
					res.json({ status: 200, message: 'Signed up successfully.', data })
				)
				.catch((err) => res.json({ status: 404, message: err }));
		};
		await S3.uploadNewMedia(req, res, data);
	}
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
				res.json({ status: 404, message: 'Wrong password' });
			}
		})
		.catch((err) => res.json({ status: 404, message: 'Email does not exist', err }));
};

exports.updateUser = async (req, res) => {
	if (req.files) {
		await UserModel.findById({ _id: req.params.id })
			.then(async (user) => {
				await MediaModel.findById({ _id: user.mediaId }).then(async (media) => {
					const data = async (data) => {
						await MediaModel.findByIdAndUpdate(
							{ _id: user.mediaId },
							{
								$set: {
									url: data.Location || null,
									title: 'user',
									mediaKey: data.Key,
									alt: req.body.alt || null,
								},
							},
							{ useFindAndModify: false, new: true }
						);
					};
					await S3.updateMedia(req, res, media.mediaKey, data);
				});

				const { firstname, lastname, email, mediaId } = req.body;

				await UserModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							firstname,
							lastname,
							email,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
							roleId: !req.body.roleId ? user.roleId : req.body.roleId,
							mediaId: user.mediaId,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((data) =>
						res.json({
							status: 200,
							message: 'User is updated successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			})
			.catch((err) => res.json({ status: 404, message: err }));
	} else {
		await UserModel.findById({ _id: req.params.id })
			.then(async (user) => {
				const { firstname, lastname, email, mediaId } = req.body;

				await UserModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							firstname,
							lastname,
							email,
							isActive: !req.body.isActive ? true : req.body.isActive,
							isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
							roleId: !req.body.roleId ? user.roleId : req.body.roleId,
							mediaId: !mediaId ? user.mediaId : mediaId,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((data) =>
						res.json({
							status: 200,
							message: 'User is updated successfully',
							data,
						})
					)
					.catch((err) => res.json({ status: 404, message: err }));
			})
			.catch((err) => res.json({ status: 404, message: err }));
	}
};

exports.changePassword = (req, res) => {
	const { currentPassword, newPassword } = req.body;

	UserModel.findById({ _id: req.params.id })
		.then(async (response) => {
			if (await bcrypt.compare(currentPassword, response.password)) {
				const salt = await bcrypt.genSalt();
				const hashedPassword = await bcrypt.hash(newPassword, salt);
				UserModel.findByIdAndUpdate(
					{ _id: req.params.id },
					{
						$set: {
							password: hashedPassword,
						},
					}
				).then((data) =>
					res.json({
						status: 200,
						message: 'Password updated successfully',
						data,
					})
				);
			}
		})
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.deleteUser = async (req, res) => {
	await UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			await MediaModel.findByIdAndUpdate(
				{ _id: user.mediaId },
				{
					$set: { isActive: false },
				},
				{ useFindAndModify: false, new: true }
			);
			await UserModel.findByIdAndRemove({ _id: req.params.id })
				.then((data) =>
					res.json({
						status: 200,
						message: 'User is deleted successfully.',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.catch((err) => res.json({ status: 404, message: err }));
};

// exports.deleteUser = async (req, res) => {
// 	await UserModel.findByIdAndDelete({ _id: req.params.id })
// 		.then(async (user) => {
// 			await MediaModel.findById({ _id: user.mediaId }).then(async (media) => {
// 				S3.deleteMedia(media.mediaKey);
// 				await MediaModel.findByIdAndDelete({ _id: user.mediaId });
// 			});
// 			res.json(user);
// 		})
// 		.then((data) => res.json({ message: 'User is removed successfully.', data }))
// 		.catch((err) => res.json({ message: err }));
// };
