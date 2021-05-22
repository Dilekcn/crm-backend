const FooterModel = require('../model/Footer.model')

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

exports.createFooter = (req, res) => {
    const newFooter = new FooterModel({
        logo : req.body.logo,
        address : req.body.address,
        email : req.body.email,
        phone : req.body.phone,
        socialMediaLinks : req.body.socialMediaLinks,
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