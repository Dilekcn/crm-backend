const mongoose = require('mongoose');

const SocialMediaModel = require('../model/SocialMedia.model');


exports.getAllSocialMedia = (req,res)=>{

    SocialMediaModel.find()
    .then((data)=>{res.json(data)})
    .catch((err)=>{res.json(err)});

};

exports.createSocialMedia =(req,res)=>{
    const newSocialMedia = new SocialMediaModel(req.body);
    newSocialMedia.save()
    .then((data)=>{res.json(data);})
    .catch((err)=>{res.json(err)});
}

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