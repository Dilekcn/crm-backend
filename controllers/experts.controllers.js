const mongoose = require('mongoose');
const ExpertModel = require('../model/Expert.model');
const SocialMediaModel = require('../model/SocialMedia.model');
const MediaModel = require('../model/Media.model');
const AWS = require('aws-sdk');
require('dotenv').config();
const Access_Key = process.env.Access_Key_ID;
const Secret_Key = process.env.Secret_Access_Key;
const Bucket_Name = process.env.Bucket_Name;

exports.getAllExperts = async (req, res) => {
	try {
		const dataList = await ExpertModel.find()
			.sort({ createdAt: -1 })
			.populate('socialMediaId', 'title link description')
			.populate('mediaId', 'url title');
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

	newSocialMedia.map((sm) => sm.save());

	const socialMediaIds = newSocialMedia.map((sm) => sm._id);

	const mediaId = req.files.mediaId;

	const s3 = new AWS.S3({
		accessKeyId: Access_Key,
		secretAccessKey: Secret_Key,
	});

	const params = {
		Bucket: Bucket_Name,
		Key: mediaId.name,
		Body: mediaId.data,
		ContentType: 'image/JPG',
	};

	await s3.upload(params, async (err, data) => {
		if (err) {
			console.log(err);
		} else {
			const newMedia = await new MediaModel({
				url: req.body.mediaId.url || null,
				title: 'experts',
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
		}
	});
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
	await ExpertModel.findById({ _id: req.params.expertid })
		.then(async (expert) => {
			await MediaModel.findByIdAndUpdate(
				{ _id: expert.mediaId },
				{
					$set: {
						url: req.body.mediaId.url || null,
						title: 'experts',
						description: req.body.mediaId.description || null,
					},
				},
				{ useFindAndModify: false, new: true }
			);
			await expert.socialMediaId.map(async (SMId, index) => {
				await SocialMediaModel.findByIdAndUpdate(
					{ _id: SMId },
					{
						$set: req.body.socialMediaId[index],
					},
					{ useFindAndModify: false, new: true }
				);
			});

			const { firstname, lastname, expertise } = req.body;
			await ExpertModel.findByIdAndUpdate(
				{ _id: req.params.expertid },
				{
					firstname,
					lastname,
					expertise,
					mediaId: expert.mediaId,
					socialMediaId: expert.socialMediaId,
					isActive: !req.body.isActive ? true : req.body.isActive,
					isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
				},
				{ useFindAndModify: false, new: true }
			)

				.then((data) =>
					res.json({ message: 'Expert is updated successfully', data })
				)
				.catch((err) => res.json({ message: err }));
		})
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.removeExpert = async (req, res) => {
	await ExpertModel.findByIdAndDelete({ _id: req.params.expertid })
<<<<<<< HEAD
		.then((data) => res.json(data))
		.catch((err) => res.status(404).json({ message: err }));
=======
		.then((data) => {
			res.json({ message: 'Expert is deleted successfully', data });
		})
		.catch((err) => {
			res.json({ message: err });
		});
>>>>>>> a33ba7e003be18cf9337ef4de5bd2a002acb6211
};
