const mongoose = require('mongoose');
const ProductModel = require("../model/Products.model");


exports.getAllProduct =  (req, res) => {
  
    ProductModel.find()
    .then((data) =>{ res.json(data);})
    .catch((err) => {res.json( err)});
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

    newProduct.save()
    .then((data) =>{ res.json(data);})
    .catch((err) => {res.json( err)});
   
}

exports.deleteProduct = (req,res,next)=>{

    ProductModel.findByIdAndRemove({_id:req.params.productId})
    .then((data)=>{res.json(data)})
    .catch((err)=>{
      next({message:'The product deleted.',code:99})
      res.json(err)
    })
  }

  exports.updateSingleProduct =  (req, res) => {
    ProductModel.findByIdAndUpdate({_id: req.params.productId}, {$set: req.body})
    .then(data => res.json({message:'Product updated', status:true, data}))
    .catch(err => res.json({message: err, status:false}))
}