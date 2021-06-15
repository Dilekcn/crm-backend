const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ParentMenuSchema = new Schema({
  name:{type:String, required:true},  
  isActive:{type:Boolean,default:true},
  isDeleted:{type:Boolean,default:false}
}, {timestamps:true})

module.exports = mongoose.model('parentMenu', ParentMenuSchema);