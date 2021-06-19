const mongoose =require('mongoose');
const Schema =mongoose.Schema;


const SocialMediaSchema = new Schema(
    {
        title:{type:String,required:true},
        link:{type:String,required:true},
        isActive:{type:Boolean,default:true},
        isDeleted:{type:Boolean,default:false}
    },
    {
        timestamps:true
    },
)
module.exports = mongoose.model('social',SocialMediaSchema);