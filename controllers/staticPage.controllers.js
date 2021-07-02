const StaticPageModel = require('../model/StaticPage.model');
const ImageModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await StaticPageModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('imageId', 'url title alt');
		const total = await StaticPageModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: err });
	}
};

exports.createPage = async (req, res) => {
	const data = async (data) => {
		const newImage = await new ImageModel({
			url: data.Location || null,
			title: 'static-pages',
			mediaKey: data.Key,
			alt: req.body.alt || null,
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
					status: 200,
					message: 'Added new static page successfully.',
					response,
				})
			)
			.catch((error) => res.json({ status: 404, message: error }));
	};
	await S3.uploadNewMedia(req, res, data);
};

exports.getSinglePage = async (req, res) => {
	await StaticPageModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	}).populate('imageId', 'url title alt');
};

exports.getSinglePageByName = async (req, res) => {
	await StaticPageModel.findOne({ name: req.params.name }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	}).populate('imageId', 'url title alt');
};

exports.updatePages = async (req, res) => {
	await StaticPageModel.findById({ _id: req.params.id })
		.then(async (data) => {
			const { name, content, isActive, isDeleted } = req.body;
			await ImageModel.findByIdAndUpdate(
				{ _id: data.imageId },
				{
					$set: {
						url: data.Location || null,
						title: 'static-pages',
						mediaKey: data.Key,
						alt: req.body.alt || null,
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
					res.json({
						status: 200,
						message: 'Static page is updated  successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removePage = async (req, res) => {
	await StaticPageModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};
