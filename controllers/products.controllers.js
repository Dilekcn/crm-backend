const mongoose = require('mongoose');
const ProductModel = require("../model/Products.model");


exports.getAllProduct = async (req, res) => {
    try {
        const response = await ProductModel.find()
        res.json({message: 'All Products', response})
    } catch (err) {
        res.status(500).json(err)
    }
};


exports.createProduct = async (req, res) => {
    const newProduct = await new ProductModel({
        order: req.body.order,
        coverImageId: req.body.coverImageId,
        isHomePage: req.body.isHomePage,
        title: req.body.title,
        content:req.body.content,
        createAt:req.body.createAt,
        shortDescription:req.body.shortDescription,
        buttonText:req.body.buttonText,
        userId:req.body. userId,
        isActive: req.body.isActive,
        isDeleted: req.body.isDeleted,
        isBlog: req.body.isBlog,
        updateAt: req.body.updateAt

    })

    newProduct.save()
    .then(response => res.json({message:'Product Created', status:true, response}))
    .catch(error => res.json({message:error, status:false}))
}


