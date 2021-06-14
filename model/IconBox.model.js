const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IconBoxSchema = new Schema({
  contentName:String,  
  routeName:String,
  title:{type:String, required:true},
  content:{type:String, required:true},
  author:{type:String, required:true},
  iconName:{type:String, required:true},
  isActive:{type:Boolean,default:true},
  isDeleted:{type:Boolean,default:false}
}, {timestamps:true})

module.exports = mongoose.model('iconBox', IconBoxSchema);
