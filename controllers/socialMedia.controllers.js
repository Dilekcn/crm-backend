const mongoose = require('mongoose');

const SocialMediaModel = require('../model/SocialMedia.model');

exports.getAllSocialMedia = (req, res) => {
	SocialMediaModel.find()
		.sort({ createdAt: -1 })
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.json(err);
		});
};

exports.createSocialMedia = (req, res) => {
	const newSocialMedia = new SocialMediaModel(req.body);
	newSocialMedia
		.save()
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.json(err);
		});
};

// exports.createSocialMedia = (req, res) => {
//     const newSocialMedia=  new SocialMediaModel({
//         title: req.body.title,
//         link:req.body.link,
//         isActive: req.body.isActive,
//         isDeleted: req.body.isDeleted
//     })
//     newSocialMedia.save()
//     .then((data) =>{ res.json(data);})
//     .catch((err) => {res.json( err)});

// }

exports.updateSocialMedia = (req, res, next) => {
	SocialMediaModel.findByIdAndUpdate(req.params.socialMediaId, req.body)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			next({ message: 'The social media was not fund', code: 99 });
			res.json(err);
		});
};

exports.removeSocialMedia = (req, res, next) => {
	SocialMediaModel.findByIdAndRemove(req.params.socialMediaId)
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			next({ message: 'The social media link deleted.', code: 99 });
			res.json(err);
		});
};
