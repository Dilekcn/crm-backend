const SocialMediaModel = require('../model/SocialMedia.model');

exports.getAllSocialMedia = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await SocialMediaModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await SocialMediaModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (err) {
		res.json({ status: 404, message: err });
	}
};

exports.createSocialMedia = (req, res) => {
	const newSocialMedia = new SocialMediaModel(req.body);
	newSocialMedia
		.save()
		.then((data) => {
			res.json({
				status: 200,
				message: 'New social media info is created successfully',
				data,
			});
		})
		.catch((err) => {
			res.json({ status: 404, message: err });
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

exports.updateSocialMedia = (req, res) => {
	SocialMediaModel.findByIdAndUpdate(req.params.socialMediaId, req.body)
		.then((data) => {
			res.json({
				status: 200,
				message: 'Social media info is updated successfully',
				data,
			});
		})
		.catch((err) => {
			res.json({ status: 404, message: err });
		});
};

exports.removeSocialMedia = (req, res) => {
	SocialMediaModel.findByIdAndRemove(req.params.socialMediaId)
		.then((data) => {
			res.json({
				status: 200,
				message: 'Social media info is removed successfully',
				data,
			});
		})
		.catch((err) => {
			res.json({ status: 404, message: err });
		});
};
