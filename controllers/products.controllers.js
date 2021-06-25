const mongoose = require('mongoose');
const ProductModel = require('../model/Products.model');
const Media =require('../model/Media.model')
const User =require('../model/User.model')
 
exports.getAllProduct = (req, res) => {
	ProductModel.find()
		.then((data) => {
			res.json(data);
		})
		.catch((err) => {
			res.json(err);
		});
};
// exports.createProduct = (req, res) => {
// 	const newProduct = new ProductModel({
// 		order: req.body.order,
// 		coverImageId: req.body.coverImageId,
// 		isHomePage: req.body.isHomePage,
// 		title: req.body.title,
// 		content: req.body.content,
// 		shortDescription: req.body.shortDescription,
// 		buttonText: req.body.buttonText,
// 		userId: req.body.userId,
// 		isActive: req.body.isActive,
// 		isDeleted: req.body.isDeleted,
// 		isBlog: req.body.isBlog,
// 		isAboveFooter: req.body.isAboveFooter,
// 	});

// 	newProduct
// 		.save()
// 		.then((data) => {
// 			res.json(data);
// 		})
// 		.catch((err) => {
// 			res.json(err);
// 		});
// };
/************************************* */

exports.createProduct = async (req, res) => {
	const newMedia = await  new Media({
			url: req.body.url || null,
			title: req.body.title || null,
			description:req.body.description || null,
		});



	newMedia.save();

	const mediaIds = newMedia._id;

/*****userId */
const newUser = await new User({
		firstname: req.body.firstname || null,
		lastname: req.body.lastname || null,
		email:req.body.email || null,
		roleId:req.body.roleId || null,

	});



newUser.save();

const UserIds = newUser._id;





	const { title, order,coverImageId ,isHomePage,content,shortDescription,buttonText,userId, isActive, isDeleted,isBlog,isAboveFooter } = req.body;

	const product = await new ProductModel({
		title,
		order,	
		coverImageId:mediaIds,
		isHomePage,
		content,
		shortDescription,
		buttonText,
		userId:UserIds,
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
	ProductModel.findByIdAndUpdate({ _id: req.params.productId }, { $set: req.body })
		.then((data) => res.json({ message: 'Product updated', status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};
