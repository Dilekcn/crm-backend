const UserModel = require('../model/User.model');
const MediaModel = require('../model/Media.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const S3 = require('../config/aws.s3.config');

exports.getAllUsers = async (req, res) => {
	await UserModel.find()
		.sort({ createdAt: -1 })
		.populate('roleId', 'name')
		.populate('mediaId', 'url title alt')
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.createUser = async (req, res) => {
	const data = async (data) => {
		const newMedia = await new MediaModel({
			url: req.body.mediaId.url || null,
			title: 'users',
			mediaKey: data.Key,
			alt: req.body.alt || null,
		});

		newMedia.save();

		const { firstname, lastname, email, password, isActive, isDeleted, roleId } =
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
				res.json({ status: true, message: 'Signed up successfully.', data })
			)
			.catch((err) => res.json({ status: false, message: err }));
	};
	await S3.uploadNewMedia(req, res, data);
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
		.catch((err) => res.json({ message: 'Email does not exist', err }));
};

exports.updateUser = async (req, res) => {
	await UserModel.findById({ _id: req.params.id })
		.then(async (user) => {
			await MediaModel.findById({ _id: user.mediaId })
				.then(async (media) => {
					const data = async (data) => {
						await MediaModel.findByIdAndUpdate(
							{ _id: user.mediaId },
							{
								$set: {
									url: data.Location || null,
									title: 'users',
									mediaKey: data.Key,
									alt: req.body.alt || null,
								},
							},
							{ useFindAndModify: false, new: true }
						).then(async (updatedMedia) => {
							const { firstname, lastname, email, password } = req.body;
							await UserModel.findByIdAndUpdate(
								{ _id: req.params.id },
								{
									$set: {
										firstname,
										lastname,
										email,
										password,
										isActive: !req.body.isActive
											? true
											: req.body.isActive,
										isDeleted: !req.body.isDeleted
											? false
											: req.body.isDeleted,
										roleId: !req.body.roleId
											? user.roleId
											: req.body.roleId,
										mediaId: user.mediaId,
									},
								},
								{ useFindAndModify: false, new: true }
							).then((data) =>
								res.json({
									status: true,
									message: 'User is updated successfully',
									data,
								})
							);
						});
					};
					await S3.updateMedia(req, res, media.mediaKey, data);
				})
				.catch((err) => res.json({ status: false, message: err }));
		})
		.catch((err) => res.json({ status: false, message: err }));
};

exports.deleteUser = async (req, res) => {
	await UserModel.findByIdAndRemove({ _id: req.params.id })
		.then((data) => res.json({ message: 'Successfully removed.', data }))
		.catch((err) => res.json({ message: err }));
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
