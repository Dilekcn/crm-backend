const mongoose = require("mongoose");
const Schema = mongoose.Schema

const CompanyDescriptionSchema = new Schema({
  contentName:String, 
  routeName:String,
  title:{type:String, required:true, unique:true},
  content:{type:String, required:true},
  author:{type:String, required:true},
  isActive:{type:Boolean,default:true},
  isDeleted:{type:Boolean,default:false}
}, {timestamps:true})

module.exports = mongoose.model("companyDescription", CompanyDescriptionSchema)