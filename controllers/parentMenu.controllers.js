const mongoose = require('mongoose');
const ParentMenuModel = require("../model/ParentMenu.model");


exports.getAllParentMenu =  (req, res) => {
  
    ParentMenuModel.find()
    .then((data) =>{ res.json(data);})
    .catch((err) => {res.json( err)}); 
}

exports.createParentMenu = (req, res) => {
    const newParentMenu=  new ParentMenuModel({
        name: req.body.name,     
        isActive: req.body.isActive,
        isDeleted: req.body.isDeleted          

    })

    newParentMenu.save()
    .then((data) =>{ res.json(data);})
    .catch((err) => {res.json( err)});
   
}

exports.deleteParentMenu = (req,res,next)=>{

    ParentMenuModel.findByIdAndRemove({_id:req.params.parentMenuId})
    .then((data)=>{res.json(data)})
    .catch((err)=>{
      next({message:'The ParentMenu deleted.',code:99})
      res.json(err)
    })
  }

  exports.updateSingleParentMenu =  (req, res) => {
    ParentMenuModel.findByIdAndUpdate({_id: req.params.parentMenuId}, {$set: req.body})
    .then(data => res.json({message:'ParentMenu updated', status:true, data}))
    .catch(err => res.json({message: err, status:false}))
}