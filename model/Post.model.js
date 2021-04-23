const mongoose = require("mongoose");
const Schema = mongoose.Schema

const PostSchema = new Schema({
  title:{type:String, required:true, unique:true},
  body:{type:String, required:true},
  author:{type:String, required:true},
  // date:{type:Date, default:Date.now, required:true}
}, {timestamps:true})

module.exports = mongoose.model("post", PostSchema)