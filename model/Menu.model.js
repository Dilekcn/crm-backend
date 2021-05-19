const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const MenusSchema = new Schema({
  parentId: { type: String, required: true },
  text: { type: String, required: true },
  link: { type: String, required: true },
  iconClassName: { type: String, required: true },
  order: { type: Number, required: true},
  isActive: { type: Boolean, default:true},
  isDeleted: { type: Boolean, default:false}, 
  
}, {timestamps:true}) 

module.exports = mongoose.model('menu', MenusSchema);