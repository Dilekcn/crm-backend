const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');

exports.getAllMedia = async (req, res) => {
	try {
		const response = await MediaModel.find().sort({ createdAt: -1 });
		res.json({ message: 'All Medias', response });
	} catch (e) {
		res.status(500).json(e);
	}
};

exports.createMedia = async (req, res) => {
	const data = async (data) => {
		const newMedia = await new MediaModel({
			url: data.Location,
			title: req.body.title,
			mediaKey: data.Key,
			isHomePage: req.body.isHomePage,
			isActive: req.body.isActive,
			isDeleted: req.body.isDeleted,
		});

		newMedia
			.save()
			.then((response) =>
				res.json({ message: 'Media Created', status: true, response })
			)
			.catch((err) => res.json({ message: err, status: false }));
	};
	await S3.uploadNewMedia(req, res, data);
};

exports.getSingleMedia = async (req, res) => {
	await MediaModel.findById({ _id: req.params.mediaId }, (err, data) => {
		if (err) {
			res.json({ message: err, status: false });
		} else {
			res.json({ data, status: true });
		}
	});
};

exports.getSingleMediaByTitle = async (req, res) => {
	const title = req.params.title.toLowerCase();
	await MediaModel.find({ title: title }, (err, data) => {
		if (err) {
			res.json({ message: err, status: false });
		} else {
			res.json({ data, status: true });
		}
	});
};

exports.updateSingleMedia = async (req, res) => {
	await MediaModel.findById({ _id: req.params.mediaId })
		.then(async (response) => {
			const data = async (data) => {
				await MediaModel.findByIdAndUpdate(
					{ _id: req.params.mediaId },
					{
						$set: {
							url: data.Location,
							mediaKey: data.Key,
							title: req.body.title,
							isActive: req.body.isActive,
							isDeleted: req.body.isDeleted,
						},
					}
				)
					.then((data) =>
						res.json({ message: 'Media updated', status: true, data })
					)
					.catch((err) => res.json({ message: err, status: false }));
			};
			await S3.updateMedia(req, res, response.mediaKey, data);
		})
		.catch((err) => res.json({ message: err, status: false }));
};

exports.removeSingleMedia = async (req, res) => {
	await MediaModel.findById({ _id: req.params.mediaId })
		.then(async (response) => {
			S3.deleteMedia(response.mediaKey);
			await MediaModel.findByIdAndDelete({ _id: req.params.mediaId })
				.then((data) =>
					res.json({ message: 'Media removed', status: true, data })
				)
				.catch((err) => res.json({ message: err, status: false }));
		})
		.catch((err) => res.json({ message: err, status: false }));
};
