const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productsSchema = new Schema({
  order: { type: Number, required: true }, 
  coverImageId:{type:String, required:true, unique:true},
  isHomePage: { type: Boolean, default:false},
  title:{type:String, required:true},
  content:{type:String, required:true},
  createAt:{type:Date, default:Date.now},
  shortDescription:{type:String, required: true},
  buttonText:{type:String, required: true},
  userId:{ type: String, required: true },
  isActive:{type:Boolean,default:true},
  isDeleted:{type:Boolean,default:false},
  isBlog:{type:Boolean,default:false},
  updateAt:{type:String}

}, {timestamps:true})

module.exports = mongoose.model('product', productsSchema);
