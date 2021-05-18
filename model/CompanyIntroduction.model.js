const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CompanyIntroductionSchema = new Schema({
  title:{type:String, required:true, unique:true},
  subTitle:{type:String, required:true, unique:true},
  iconName:{type:String, required:true},
  isActive:{type:Boolean,default:true},
  isDeleted:{type:Boolean,default:false},
  shortDescription:{type:String, required:true}
}, {timestamps:true})

module.exports = mongoose.model('companyIntroduction', CompanyIntroductionSchema);