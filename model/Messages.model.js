const mongoose = require('mongoose');
const Schema = mongoose.Schema;
 
const MessagesSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  subject: { type: String, required: true },
  content: { type: String, required: true },
  email: { type: String, required: true},
  phoneNumber: String,
  isRead: { type: Boolean, default:false},
  isDeleted: { type: Boolean, default:false}, 
  isReplied: { type: Boolean, default:false}
  
}, {timestamps:true}) 

module.exports = mongoose.model('message', MessagesSchema);
