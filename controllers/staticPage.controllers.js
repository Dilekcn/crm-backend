const StaticPageModel = require('../model/StaticPage.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await StaticPageModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('mediaId', 'url title alt');
		const total = await StaticPageModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: err });
	}
};

exports.createPage = async (req, res) => {
	const data = async (data) => {
		const newImage = await new MediaModel({
			url: data.Location || null,
			title: 'static-page',
			mediaKey: data.Key,
			alt: req.body.alt || null,
		});

		newImage.save();

		const { name, content, isActive, isDeleted } = req.body;

		const newPage = await new StaticPageModel({
			name,
			content,
			mediaId: newImage._id,
			isActive,
			isDeleted,
		});
		newPage
			.save()
			.then((response) =>
				res.json({
					status: 200,
					message: 'New static page is created successfully.',
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
	}).populate('mediaId', 'url title alt');
};

exports.getSinglePageByName = async (req, res) => {
	await StaticPageModel.findOne({ name: req.params.name }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	}).populate('mediaId', 'url title alt');
};

exports.updatePages = async (req, res) => {
	await StaticPageModel.findById({ _id: req.params.id })
		.then(async (staticpage) => {
			await MediaModel.findById({ _id: staticpage.mediaId }).then(async (media) => {
				const data = async (data) => {
					await MediaModel.findByIdAndUpdate(
						{ _id: staticpage.mediaId },
						{
							$set: {
								url: data.Location || null,
								title: 'static-page',
								mediaKey: data.Key,
								alt: req.body.alt,
							},
						},
						{ useFindAndModify: false, new: true }
					).catch((err) => res.json({ status: 4040, message: err }));
				};
				await S3.updateMedia(req, res, media.mediaKey, data);
			});
			const { name, content } = req.body;

			await StaticPageModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{
					$set: {
						name,
						content,
						mediaId: staticpage.mediaId,
						isActive: !req.body.isActive ? true : req.body.isActive,
						isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
					},
				},
				{ useFindAndModify: false, new: true }
			)
				.then((data) =>
					res.json({
						status: 200,
						message: 'Static page is updated successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 4041, message: err }));
		})
		.catch((err) => res.json({ status: 4042, message: err }));
};

exports.removePage = async (req, res) => {
	await StaticPageModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) =>
			res.json({
				status: 200,
				message: 'Static page is deleted successfully',
				data,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
