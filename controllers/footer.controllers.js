const FooterModel = require('../model/Footer.model');
const SocialMediaModel = require('../model/SocialMedia.model');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await FooterModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('socialMediaId', 'title link');
		const total = await FooterModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (err) {
		res.json({ status: 404, message: err });
	}
};

exports.getSingleFooterById = (req, res) => {
	const id = req.params.id;

	FooterModel.findById({ _id: id })
		.populate('socialMediaId', 'title link')
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.createFooter = async (req, res) => {
	const newSocialMedia = await req.body.socialMediaId.map((sm) => {
		return new SocialMediaModel({
			title: sm.title || null,
			link: sm.link || null,
		});
	});

	newSocialMedia.map((sm) => sm.save());

	const socialMediaIds = newSocialMedia.map((sm) => sm._id);

	const newFooter = new FooterModel({
		logo: req.body.logo,
		address: req.body.address,
		email: req.body.email,
		phone: req.body.phone,
		socialMediaId: socialMediaIds,
		copyright: req.body.copyright,
	});

	newFooter
		.save()
		.then((data) =>
			res.json({ status: 200, message: 'New footer is created successfully', data })
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.updateFooterById = async (req, res) => {
	await FooterModel.findById({ _id: req.params.footerid })
		.then(async (footer) => {
			await footer.socialMediaId.map(
				async (socialMediaid, index) =>
					await SocialMediaModel.findByIdAndUpdate(
						{ _id: socialMediaid },
						{ $set: req.body.socialMediaId[index] }
					)
						.then((data) => res.json({ status: 200, data }))
						.catch((err) => res.json({ status: 404, message: err }))
			);

			await FooterModel.findByIdAndUpdate(
				{ _id: req.params.footerid },
				{
					logo: req.body.logo,
					address: req.body.address,
					email: req.body.email,
					phone: req.body.phone,
					socialMediaId: footer.socialMediaId,
					copyright: req.body.copyright,
				}
			)
				.then((data) =>
					res.json({
						status: 200,
						message: 'Expert is updated successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeFooterById = (req, res) => {
	const id = req.params.id;
	FooterModel.findByIdAndDelete({ _id: id })
		.then(async (data) => {
			res.json({ status: 200, message: 'Footer is deleted successfully', data });
		})
		.catch((err) => res.json({ status: 404, message: err }));
};
