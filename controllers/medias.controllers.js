const MediaModel = require('../model/Media.model');
const AWS = require('aws-sdk')
require('dotenv').config()
const Access_Key = process.env.Access_Key_ID
const Secret_Key = process.env.Secret_Access_Key
const Bucket_Name = process.env.Bucket_Name
const uuid = require('uuid')

exports.getAllMedia = async (req, res) => {
	try {
		const response = await MediaModel.find();
		res.json({ message: 'All Medias', response });
	} catch (e) {
		res.status(500).json(e);
	}
};

exports.createMedia = async (req, res) => {

	const files = req.files.image
    
    const s3 = new AWS.S3({
        accessKeyId:Access_Key,
        secretAccessKey:Secret_Key
    })

    const params = {
        Bucket:Bucket_Name,
        Key:uuid(),
        Body:req.files.image.data,
        ContentType:'image/JPG'
    }

	s3.upload(params, async (err, data) => {
        if(err) {
            res.json(err)
        } else {
            const newMedia = await new MediaModel({
                url: data.Location,
				title: req.body.title,
				mediaKey:data.Key,
				description: req.body.description,
				isHomePage: req.body.isHomePage,
				isActive: req.body.isActive,
				isDeleted: req.body.isDeleted,
            })
        
            newMedia.save().then(response => res.json({message:'Media Created', status:true, response})).catch(err => res.json({message:err, status:false}))
        }
    })

};

exports.getSingleMedia = async (req, res) => {
	await MediaModel.findById({ _id: req.params.mediaId }, (err, data) => {
		if (err) {
			res.json({ message: err, status: false });
		} else {
			res.json({ data, status: true });
		}
	});
};


exports.getSingleMediaByTitle = async (req, res) => {
	const title = req.params.title.toLowerCase()
	await MediaModel.find({ title: title }, (err, data) => {
		if (err) {
			res.json({ message: err, status: false });
		} else {
			res.json({ data, status: true });
		}
	});
};

exports.updateSingleMedia = async (req, res) => {
	await MediaModel.findById({_id: req.params.mediaId}).then(response => {
		const s3 = new AWS.S3({
			accessKeyId:Access_Key,
			secretAccessKey:Secret_Key
		})
	
		const params = {
			Bucket:Bucket_Name,
			Key:response.mediaKey,
			Body:req.files.image.data,
			ContentType:'image/JPG'
		}

		s3.upload(params, async(err, data) => {
			await MediaModel.findByIdAndUpdate({ _id: req.params.mediaId }, { $set: {
				url:data.Location,
				mediaKey:data.Key,
				title:req.body.title,
				description:req.body.description,
				isActive:req.body.isActive,
				isDeleted:req.body.isDeleted
			} })
				.then((data) => res.json({ message: 'Media updated', status: true, data }))
				.catch((err) => res.json({ message: err, status: false }));
		})
	}).catch((err) => res.json({ message: err, status: false }));
	
};

exports.removeSingleMedia = async (req, res) => {
	await MediaModel.findByIdAndDelete({ _id: req.params.mediaId })
		.then((data) => res.json({ message: 'Media removed', status: true, data }))
		.catch((err) => res.json({ message: err, status: false }));
};
