const mongoose = require('mongoose');
const ExpertModel = require('../model/Expert.model');

const SocialMediaModel = require('../model/SocialMedia.model');
const MediaModel = require('../model/Media.model');

exports.getAllExperts = async (req, res) => {
	try {
		const dataList = await ExpertModel.find()
			.sort({ createdAt: -1 })
			.populate('socialMediaId', 'title link')
			.populate('mediaId', 'url');
		res.json(dataList);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.createExpert = async (req, res) => {
	const newSocialMedia = await req.body.socialMediaId.map((sm) => {
		return new SocialMediaModel({
			title: sm.title || null,
			link: sm.link || null,
		});
	});

	console.log(req.body);

	newSocialMedia.map((sm) => sm.save());

	const socialMediaIds = newSocialMedia.map((sm) => sm._id);

	const newMedia = await MediaModel({
		url: req.body.mediaId.url || null,
		title: req.body.mediaId.title || null,
		description: req.body.mediaId.description || null,
	});

	newMedia.save();

	const { firstname, lastname, expertise, isActive, isDeleted } = req.body;
	const newExpert = await new ExpertModel({
		firstname,
		lastname,
		expertise,
		mediaId: newMedia._id,
		socialMediaId: socialMediaIds,
		isActive,
		isDeleted,
	});
	newExpert
		.save()
		.then((response) =>
			res.json({
				status: true,
				message: 'Added new expert successfully.',
				response,
			})
		)
		.catch((error) => res.json({ status: false, message: error }));
};

exports.getSingleExpert = async (req, res) => {
	await ExpertModel.findById({ _id: req.params.expertid }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getExpertsByFirstname = async (req, res) => {
	await ExpertModel.find({ firstname: req.params.firstname }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getExpertsByLastname = async (req, res) => {
	await ExpertModel.find({ lastname: req.params.lastname }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getExpertsByExpertise = async (req, res) => {
	await ExpertModel.find({ expertise: req.params.expertise }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.updateExpert = async (req, res) => {
	await ExpertModel.findByIdAndUpdate(
		{ _id: req.params.expertid },
		{ $set: req.body },
		{ useFindAndModify: false, new: true }
	)
		.then(async (expert) => {
			await expert.socialMediaId.map((socialMediaId, index) => {
				return SocialMediaModel.findByIdAndUpdate(
					socialMediaId,
					{
						$set: {
							title: req.body.socialMediaId[index].title,
							link: req.body.socialMediaId[index].link,
						},
					},
					{ useFindAndModify: false, new: true }
				)
					.then((newSocialMediaId) => {
						res.send(newSocialMediaId);
					})
					.catch((err) => console.log(err));
			});
			await MediaModel.findByIdAndUpdate(
				expert.mediaId,
				{
					$set: {
						url: req.body.url,
						title: req.body.title,
						description: req.body.description,
					},
				},
				{ useFindAndModify: false, new: true }
			)
				.then((newMedia) => {
					res.send(newMedia);
				})
				.catch((err) => res.json({ message: err, status: false }));
			res.send(expert);
		})
		.then((expert) =>
			res.json({
				status: true,
				message: 'Updated expert successfully',
				expert,
			})
		)
		.catch((err) => res.json({ status: false, message: err }));
};

exports.removeExpert = async (req, res) => {
	await ExpertModel.findByIdAndDelete({ _id: req.params.expertid })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
