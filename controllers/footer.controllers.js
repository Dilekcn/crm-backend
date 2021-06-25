const FooterModel = require('../model/Footer.model')
const SocialMediaModel = require('../model/SocialMedia.model');

exports.getAll = (req, res) => {
    FooterModel.find().populate('socialMediaId', 'title link')
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
        socialMediaId : socialMediaIds,
        copyright : req.body.copyright
    })

    newFooter.save().then(data => res.json({status:true, data})).catch(err => res.json({message: err, status:false}))
}


exports.updateFooterById = async (req, res) => {

    await FooterModel.findById({_id: req.params.footerid}).then(async(footer) => {
       await footer.socialMediaId.map(async (socialMediaid, index) => await SocialMediaModel.findByIdAndUpdate({_id:socialMediaid}, {$set:req.body.socialMediaId[index]}).then(data => data).catch(err => err))

       await FooterModel.findByIdAndUpdate({_id:req.params.footerid}, {
        logo : req.body.logo,
        address : req.body.address,
        email : req.body.email,
        phone : req.body.phone,
        socialMediaId : footer.socialMediaId,
        copyright : req.body.copyright
       }).then(data => res.json({status:true, data})).catch(err => res.json({status:false, error:err}))

    }).catch(err => res.json(err))
}

exports.removeFooterById = (req, res) => {
    const id = req.params.id
    FooterModel.findByIdAndDelete({_id:id}).then(async(data) => {
       await data.socialMediaId.map(async(socialMediaid, index) => {
           await SocialMediaModel.findByIdAndRemove({_id:socialMediaid})
       })
       res.json({status:true, data})
    }).catch(err => res.json({message: err, status:false}))
}