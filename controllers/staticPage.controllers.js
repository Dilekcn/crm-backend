const mongoose = require('mongoose');
const StaticPageModel = require('../model/StaticPage.model');

const ImageModel = require('../model/Media.model');

exports.getAll = async (req, res) => {
	try {
		const response = await StaticPageModel.find()
			.sort({ createdAt: -1 })
			.populate('imageId', 'url title');
		res.json(response);
	} catch (error) {
		res.status(500).json(error);
	}
};

exports.createPage = async (req, res) => {
	const newImage = await new ImageModel({
		url: req.body.imageId.url || null,
		title: 'static-pages',
		description: req.body.imageId.description || null,
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
				message: 'Added new company introductions successfully.',
				response,
			})
		)
		.catch((error) => res.json({ status: false, message: error }));
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
	await StaticPageModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then(async (staticpage) => {
			await ImageModel.findByIdAndUpdate(
				staticpage.imageId,
				{
					$set: {
						url: req.body.imageId.url,
						description: req.body.imageId.description,
					},
				},
				{ useFindAndModify: false, new: true }
			);
		})
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};

exports.removePage = async (req, res) => {
	await StaticPageModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
