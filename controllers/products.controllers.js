const ProductModel = require('../model/Products.model');
const Media = require('../model/Media.model');

const S3 = require('../config/aws.s3.config');

exports.getAllProduct = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await ProductModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('coverImageId', 'title url alt')
			.populate('user', 'firstname lastname email');
		const total = await ProductModel.find().count();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total: total, pages, status: 200, response });
	} catch (err) {
		res.json({ status: 404, message: err });
	}
};

exports.getSingleProduct = (req, res) => {
	ProductModel.findById({ _id: req.params.productId })
		.then((data) => res.json({ status: 200, data }))
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.createProduct = async (req, res) => {
	const data = async (data) => {
		const newMedia = await new Media({
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
			coverImageId: mediaIds,
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
					message: 'Added a new product successfully.',
					response,
				})
			)
			.catch((error) => res.json({ status: 404, message: error }));
	};
	await S3.uploadNewMedia(req, res, data);
};

/************************************ */
exports.deleteProduct = (req, res, next) => {
	ProductModel.findByIdAndRemove({ _id: req.params.productId })
		.then((data) => {
			res.json({ status: 200, message: 'Product is deleted successfully', data });
		})
		.catch((err) => {
			res.json({ status: 404, message: err });
		});
};

exports.updateSingleProduct = (req, res) => {
	ProductModel.findByIdAndUpdate(
		{ _id: req.params.productId },
		{ $set: req.body },
		{ useFindAndModify: false, new: true }
	)
		.then(async (product) => {
			await Media.findById({ _id: product.coverImageId }).then(async (media) => {
				const data = async (data) => {
					await Media.findByIdAndUpdate(
						{ _id: product.coverImageId },
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
		})
		.then((data) => res.json({ status: 200, message: 'Product updated', data }))
		.catch((err) => res.json({ status: 404, message: err }));
};
