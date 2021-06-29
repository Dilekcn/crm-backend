const AWS = require('aws-sdk');
require('dotenv').config();
const Access_Key = process.env.Access_Key_ID;
const Secret_Key = process.env.Secret_Access_Key;
const Bucket_Name = process.env.Bucket_Name;
const uuid = require('uuid');

const S3 = new AWS.S3({
	accessKeyId: Access_Key,
	secretAccessKey: Secret_Key,
});

const uploadNewMedia = (req, res, callback) => {
	const params = {
		Bucket: Bucket_Name,
		Key: uuid(),
		Body: req.files.mediaId.data,
		ContentType: 'image/JPG',
	};
	S3.upload(params, (err, data) => {
		if (err) return res.json(err);
		callback(data);
	});
};

const updateMedia = (req, res, mediaKey, callback) => {
	const params = {
		Bucket: Bucket_Name,
		Key: mediaKey,
		Body: req.files.mediaId.data,
		ContentType: 'image/JPG',
	};
	S3.upload(params, (err, data) => {
		if (err) return res.json({ message: 'error from aws update', err });
		callback(data);
	});
};

const deleteMedia = (mediaKey) => {
	const params = {
		Bucket: Bucket_Name,
		Key: mediaKey,
	};

	S3.deleteObject(params).promise();
};

module.exports = { uploadNewMedia, updateMedia, deleteMedia };
