const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SocialMediaSchema = new Schema(
	{
		title: { type: String, required: [true, `Field 'title' must be filled.`]  },
		link: { type: String, required: [true, `Field 'link' must be filled.`]  },
		iconName: { type: String, required: [true, `Field 'iconName' must be filled.`]  },
		isActive: { type: Boolean, default: true },
		isDeleted: { type: Boolean, default: false },  
	},
	{
		timestamps: true,
	}
);
module.exports = mongoose.model('social', SocialMediaSchema);  
