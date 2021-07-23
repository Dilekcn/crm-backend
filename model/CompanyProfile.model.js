const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CompanyProfileSchema = new Schema(
	{
		name: {type:String,unique:true,required:[true, `Field 'name' must be filled.`]},
		logo: { type: Schema.Types.ObjectId, ref: 'media' },  
		phones: [{type: String, required:true}],
		address: String,
		socialMediaId: [{ type: Schema.Types.ObjectId,  ref: 'social' }],
		email: {type:String, required:[true, `Field 'email' must be filled.`]},
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },
		// componentId:{ type: Schema.Types.ObjectId, ref: 'component' }
	},
	{ timestamps: true }
);

module.exports = mongoose.model('companyprofile', CompanyProfileSchema);
