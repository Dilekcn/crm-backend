const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
require('dotenv').config();

const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_KEY = process.env.SECRET_KEY;
const BUCKET_NAME = process.env.BUCKET_NAME;

router.post('/aws', (req, res) => {
	const s3 = new AWS.S3({
		accessKeyId: ACCESS_KEY,
		secretAccessKey: SECRET_KEY, 
	});

	const params = {
		Bucket: BUCKET_NAME,
		Key: req.files.image.name,
		Body: req.files.image.data,
		ContentType: 'image/JPG',
	};

	s3.upload(params, (err, data) => {
		if (err) {
			console.log(err);
		} else {
			console.log('File uploaded successfully ', data.Location); 
			res.json(data);
		}
	});
});

module.exports = router;
