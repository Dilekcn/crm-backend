const FooterModel = require('../model/Footer.model')
const SocialMediaModel = require('../model/SocialMedia.model');

exports.getAll = (req, res) => {
    FooterModel.find()
        .then(data => res.json(data))
        .catch(err => res.json({message: err, status:false}))
}

exports.getSingleFooterById = (req, res) => {
    const id = req.params.id

    FooterModel.findById({_id:id})
    .then(data => res.json(data))
    .catch(err => res.json({message: err, status:false}))
}

exports.createFooter = async (req, res) => {
    const newSocialMedia = await req.body.socialMediaId.map((sm) => {
		return new SocialMediaModel({
			title: sm.title || null,
			link: sm.link || null,
		});
	});

	newSocialMedia.map((sm) => sm.save());

	const socialMediaIds = newSocialMedia.map((sm) => sm._id);

    const newFooter = new FooterModel({
        logo : req.body.logo,
        address : req.body.address,
        email : req.body.email,
        phone : req.body.phone,
        socialMediaLinks : socialMediaIds,
        copyright : req.body.copyright
    })

    newFooter.save().then(data => res.json({status:true, data})).catch(err => res.json({message: err, status:false}))
}


exports.updateFooterById = (req, res) => {
    const id = req.params.id
    FooterModel.findByIdAndUpdate({_id:id}).then(data => res.json({status:true, data})).catch(err => res.json({message: err, status:false}))
}

exports.removeFooterById = (req, res) => {
    const id = req.params.id
    FooterModel.findByIdAndDelete({_id:id}).then(data => res.json({status:true, data})).catch(err => res.json({message: err, status:false}))
}