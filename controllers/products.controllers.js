const ProductModel = require('../model/Products.model');
const MediaModel = require('../model/Media.model');

const S3 = require('../config/aws.s3.config');

exports.getAllProducts = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await ProductModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('mediaId', 'title url alt')
			.populate('userId', 'firstname lastname email');
		const total = await ProductModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (err) {
		res.json({ status: 404, message: err });
	}
};

exports.getSingleProduct = (req, res) => {
	ProductModel.findById({ _id: req.params.productid })
		.populate('mediaId', 'title url alt')
		.populate('userId', 'firstname lastname email')
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.createProduct = async (req, res) => {
	const data = async (data) => {
		const newMedia = await new MediaModel({
			url: data.Location || null,
			title: 'product',
			mediaKey: data.Key,
			alt: req.body.alt || null,
		});

		newMedia.save();

		const mediaIds = newMedia._id;

		const {
			title,
			order,
			isHomePage,
			content,
			shortDescription,
			buttonText,
			userId,
			isActive,
			isDeleted,
			isBlog,
			isAboveFooter,
		} = req.body;

		const product = await new ProductModel({
			title,
			order,
			mediaId: mediaIds,
			isHomePage,
			content,
			shortDescription,
			buttonText,
			userId,
			isActive,
			isDeleted,
			isBlog,
			isAboveFooter,
		});

		product
			.save()
			.then((response) =>
				res.json({
					status: 200,
					message: 'New product is added successfully.',
					response,
				})
			)
			.catch((error) => res.json({ status: 404, message: error }));
	};
	await S3.uploadNewMedia(req, res, data);
};

exports.updateSingleProduct = async (req, res) => {
	await ProductModel.findById({ _id: req.params.productid })
		.then(async (product) => {
			await MediaModel.findById({ _id: product.mediaId }).then(async (media) => {
				const data = async (data) => {
					await MediaModel.findByIdAndUpdate(
						{ _id: product.mediaId },
						{
							$set: {
								url: data.Location || null,
								title: 'product',
								mediaKey: data.Key,
								alt: req.body.alt,
							},
						},
						{ useFindAndModify: false, new: true }
					).catch((err) => res.json({ status: 404, message: err }));
				};
				await S3.updateMedia(req, res, media.mediaKey, data);
			});

			const { title, order, content, shortDescription, buttonText, userId } =
				req.body;

			await ProductModel.findByIdAndUpdate(
				{ _id: req.params.productid },
				{
					$set: {
						title,
						order,
						mediaId: product.mediaId,
						isHomePage: !req.body.isHomePage ? false : req.body.isHome,
						content,
						shortDescription,
						buttonText,
						userId,
						isActive: !req.body.isActive ? true : req.body.isActive,
						isDeleted: !req.body.isDeleted ? false : req.body.isDeleted,
						isBlog: !req.body.isBlog ? false : req.body.isBlog,
						isAboveFooter: !req.body.isAboveFooter
							? false
							: req.body.isAboveFooter,
					},
				},
				{ useFindAndModify: false, new: true }
			)
				.then((data) =>
					res.json({
						status: 200,
						message: 'Product is updated successfully',
						data,
					})
				)
				.catch((err) => res.json({ status: 404, message: err }));
		})
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.deleteProduct = async (req, res) => {
	await ProductModel.findById({ _id: req.params.productid })
		.then(async (product) => {
			await MediaModel.findByIdAndUpdate(
				{ _id: product.mediaId },
				{
					$set: { isActive: false },
				},
				{ useFindAndModify: false, new: true }
			);
			await ProductModel.findByIdAndRemove({ _id: req.params.productid })
				.then((data) => {
					res.json({
						status: 200,
						message: 'Product is deleted successfully',
						data,
					});
				})
				.catch((err) => {
					res.json({ status: 404, message: err });
				});
		})
		.catch((err) => res.json({ status: 404, message: err }));
};
