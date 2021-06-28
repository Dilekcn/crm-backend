const mongoose = require('mongoose');
const ProductModel = require('../model/Products.model');
const Media = require('../model/Media.model');
const AWS = require('aws-sdk');
require('dotenv').config();
const Access_Key = process.env.Access_Key_ID;
const Secret_Key = process.env.Secret_Access_Key;
const Bucket_Name = process.env.Bucket_Name;


exports.getAllProduct = (req, res) => {
	ProductModel.find()
	    .sort({ createdAt: -1 })
		.populate('coverImageId', 'title url')
		.populate('user', 'firstname lastname email')
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.json(err);
		});
};

exports.createProduct = async (req, res) => {
	const files =req.files.image
	

const s3 = new AWS.S3({
	accessKeyId:Access_Key,
	secretAccessKey:Secret_Key
})
const params={
	 Bucket:Bucket_Name,
	Key:req.files.image.name,
	Body:req.files.image.data,
	ContentType:'image/JPG'
}

s3.upload(params, async(err,data)=>{
	if(err){
		res.json(err)
	}else{
		const newMedia = await new Media({
			url: data.Location || null,
			title: 'products',
			description: JSON.parse(req.body.coverImageId.description) || null,
		});
	
		newMedia.save();
	
		const mediaIds = newMedia._id;
	
		const {
			title,
			order,
			coverImageId,
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
					status: true,
					message: 'Added a new product successfully.',
					response,
				})
			)
			.catch((error) => res.json({ status: false, message: error }));
	}
	

})




};

/************************************ */
exports.deleteProduct = (req, res, next) => {
	ProductModel.findByIdAndRemove({ _id: req.params.productId })
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			next({ message: 'The product deleted.', code: 99 });
			res.json(err);
		});
};

exports.updateSingleProduct = (req, res) => {
	ProductModel.findByIdAndUpdate(
		{ _id: req.params.productId },
		{ $set: req.body },
		{ useFindAndModify: false, new: true }
	)
		.then(async (product) => {
			await Media.findByIdAndUpdate(
				product.coverImageId,
				{
					$set: {
						url: req.body.coverImageId.url,
						description: req.body.coverImageId.description,
					},
				},
				{ useFindAndModify: false, new: true }
			);
		})
		.then((data) => res.json({ message: 'Product updated', status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};
