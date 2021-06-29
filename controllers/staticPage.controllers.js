const mongoose = require('mongoose');
const StaticPageModel = require('../model/StaticPage.model');
const ImageModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
	try {
		const response = await StaticPageModel.find()
			.sort({ createdAt: -1 })
			.populate('imageId', 'url title description');
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.createPage = async (req, res) => {
	const data = async (data) => {
		const newImage = await new ImageModel({
			url: data.Location || null,
			title: 'static-pages',
			mediaKey: data.Key,
		});

		newImage.save();

		const { name, content, isActive, isDeleted } = req.body;

		const newPage = await new StaticPageModel({
			name,
			content,
			imageId: newImage._id,
			isActive,
			isDeleted,
		});
		newPage
			.save()
			.then((response) =>
				res.json({
					status: true,
					message: 'Added new static page successfully.',
					response,
				})
			)
			.catch((error) => res.json({ status: false, message: error }));
	};
	await S3.uploadNewMedia(req, res, data);
};

exports.getSinglePage = async (req, res) => {
	await StaticPageModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.getSinglePageByName = async (req, res) => {
	await StaticPageModel.findOne({ name: req.params.name }, (err, data) => {
		if (err) {
			res.json({ message: err });
		} else {
			res.json(data);
		}
	});
};

exports.updatePages = async (req, res) => {
	await StaticPageModel.findById({ _id: req.params.id })
		.then(async (data) => {
			const { name, content, isActive, isDeleted } = req.body;
			await ImageModel.findByIdAndUpdate(
				{ _id: data.imageId },
				{
					$set: {
						url: req.body.imageId.url || null,
						title: 'static-pages',
						description: req.body.imageId.description || null,
					},
				}
			);
			await StaticPageModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						name,
						content,
						imageId: data.imageId,
						isActive,
						isDeleted,
					},
				}
			)
				.then((data) =>
					res.json({ message: 'Static page is updated  successfully', data })
				)
				.catch((err) => res.json({ message: err }));
		})
		.then((data) => data)
		.catch((err) => res.json(err));
};

exports.removePage = async (req, res) => {
	await StaticPageModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
