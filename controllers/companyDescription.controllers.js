const mongoose = require('mongoose');
const CompanyDescriptionModel = require('../model/CompanyDescription.model');

exports.getAll = async (req, res) => {
	try {
		const response = await CompanyDescriptionModel.find();
		res.json({ message: 'Company Description', response });
	} catch (error) {
		res.status(500).json(error); 
	}
};
 
exports.create = async (req, res) => {
	const newPost = await new CompanyDescriptionModel({
		contentName: req.body.contentName,
		routeName: req.body.routeName,
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		isActive: req.body.isActive,
		isDeleted: req.body.isDeleted,
	});
	newPost
		.save()
		.then((response) => res.json(response))
		.catch((err) => res.json(err));
};



exports.getSingleCompanyDescription = async (req,res) => {
await CompanyDescriptionModel.findById({_id: req.params.id}, (err,data) => {
  if(err) {
    res.json({message: err})
  } else {
    res.json(data)
  }
})
  }
 
exports.getCompanyDescriptionByTitle = async (req,res) => {
    await CompanyDescriptionModel.findOne({title: req.params.title}, (err,data) => {
      if(err) {
        res.json({message: err})
      } else {
        res.json(data)
      }
    })
      } 

      

exports.getCompanyDescriptionByAuthor = async (req,res) => {
        await CompanyDescriptionModel.findOne({author: req.params.author}, (err,data) => {
          if(err) {
            res.json({message: err})
          } else {
            res.json(data)
          }
        })
          }
		  
exports.updateCompanyDescription = async (req, res) => {
			await CompanyDescriptionModel.findByIdAndUpdate(
				{ _id: req.params.id },
				{ $set: req.body },
			)
				.then((data) => res.json(data))
				.catch((err) => res.json({ message: err }));
		};

exports.removeSingleCompanyDescription = async (req, res) => {
	await CompanyDescriptionModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) => res.json(data))
		.catch((err) => res.json({ message: err }));
};
