const mongoose = require('mongoose');
const ProductModel = require("../model/Products.model");


exports.getAllProduct =  (req, res) => {
  
    ProductModel.find()
    .then(data => res.json(data))
    .catch(err => res.json({message: err, status:false}))
}

exports.createProduct = (req, res) => {
    const newProduct =  new ProductModel({
        order: req.body.order,
        coverImageId: req.body.coverImageId,
        isHomePage: req.body.isHomePage,
        title: req.body.title,
        content:req.body.content,       
        shortDescription:req.body.shortDescription,
        buttonText:req.body.buttonText,
        userId:req.body. userId,
        isActive: req.body.isActive,
        isDeleted: req.body.isDeleted,
        isBlog: req.body.isBlog,
        isAboveFooter:req.body.isAboveFooter       

    })

    newProduct.save((err,data)=>{
        if(err){res.json(err);}
        res.json(data);
    });
   
}


