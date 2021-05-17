const MediaModel = require('../model/Media.model')

exports.getAllMedia = async (req, res) => {
    try {
        const response = await MediaModel.find()
        res.json({message: 'All Medias', response})
    } catch (e) {
        res.status(500).json(e)
    }
}

exports.createMedia = async (req, res) => {
    const newMovie = await new MediaModel({
        url: req.body.url,
        title: req.body.title,
        description: req.body.description,
        isHomePage: req.body.isHomePage,
        isActive: req.body.isActive,
        isDeleted: req.body.isDeleted,
        userId: req.body.userId
    })

    newMovie.save().then(response => res.json({message:'Media Created', status:true, response})).catch(err => res.json({message:err, status:false}))
}

exports.getSingleMedia = async (req, res) => {
   await MediaModel.findById({_id: req.params.mediaId}, (err, data) => {
       if(err) {
        res.json({message: err, status:false})
       } else {
           res.json({data, status:true})
       }
   })
}


 exports.updateSingleMedia = async (req, res) => {
     await MediaModel.findByIdAndUpdate({_id: req.params.mediaId}, {$set: req.body})
     .then(data => res.json({message:'Media updated', status:true, data}))
     .catch(err => res.json({message: err, status:false}))
 }


 exports.removeSingleMedia = async (req, res) => {
     await MediaModel.findByIdAndDelete({_id: req.params.mediaId})
     .then(data => res.json({message:'Media removed', status:true, data}))
     .catch(err => res.json({message: err, status:false}))
 }
