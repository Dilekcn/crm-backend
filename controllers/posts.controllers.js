const mongoose = require("mongoose");
const PostsModel = require("../model/Post.model")

exports.getAll = async (req, res) => {
  try {
    const response = await PostsModel.find()
    res.json({message: "All Posts", response})
  } catch (error) {
    res.status(500).json(error)
  }

}
  exports.create = async (req,res) => {
  const newPost = await new PostsModel({
  title: req.body.title,
  body: req.body.body,
  author: req.body.author
})
newPost.save().then(response => res.json(response)).catch(err => res.json(err)) 
  }
exports.getSinglePost = async (req,res) => {
await PostsModel.findById({_id: req.params.postid}, (err,data) => {
  if(err) {
    res.json({message: err})
  } else {
    res.json(data)
  }
})
  }
 
exports.getSinglePostByTitle = async (req,res) => {
    await PostsModel.findOne({title: req.params.titlename}, (err,data) => {
      if(err) {
        res.json({message: err})
      } else {
        res.json(data)
      }
    })
      }
exports.updatePost = async (req,res) => {       
  await PostsModel.findByIdAndUpdate({_id: req.params.postid},{$set: req.body}).then(data => res.json(data))
        .catch(err => res.json({message: err}))
          }

 exports.removeSinglePost = async (req,res) => {
   await PostsModel.findByIdAndDelete({_id: req.params.postid}).then(data => res.json(data))
   .catch(err => res.json({message: err}))
              }