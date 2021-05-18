const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductsSchema = new Schema({
  order: { type: Number, required: true }, 
  coverImageId:Schema.Types.ObjectId, 
  isHomePage: { type: Boolean, default:false},
  title:{type:String, required:true},
  content:{type:String, required:true}, 
  shortDescription:{type:String, required: true},
  buttonText:{type:String, required: true},
  userId:Schema.Types.ObjectId,  
  isActive:{type:Boolean,default:true},
  isDeleted:{type:Boolean,default:false},
  isBlog:{type:Boolean,default:false},
  isAboveFooter:{type:Boolean,default:false}

}, {timestamps:true})

module.exports = mongoose.model('product', ProductsSchema);
