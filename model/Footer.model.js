const mongoose = require('mongoose')
const Schema = mongoose.Schema

const FooterSchema = new Schema({
    logo : {type:String, required: true},
    address : {type:String, required: true},
    email : {type:String, required: true},
    phone : {type:String, required: true},
    socialMediaLinks : {type:Array, required: true},
    copyright : {type:String, required: true},
}, {timestamps:true})

module.exports = mongoose.model('footer', FooterSchema)