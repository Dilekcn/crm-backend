const AWS = require('aws-sdk');
require('dotenv').config();
const Access_Key = process.env.Access_Key_ID;
const Secret_Key = process.env.Secret_Access_Key;
const Bucket_Name = process.env.Bucket_Name;
const uuid = require('uuid');
const fs = require('fs');

const S3 = new AWS.S3({
	accessKeyId: Access_Key,
	secretAccessKey: Secret_Key,
});

const uploadNewMedia = (req, res, callback) => {
	const file = __dirname + '/noImage.jpg';
	const data = fs.readFileSync(file);
	const params = {
		Bucket: Bucket_Name,
		Key: uuid(),
		Body: req.files ? req.files.mediaId.data : data,
		ContentType: 'image/JPG',
	};
	S3.upload(params, (err, data) => {
		if (err) return res.json(err);
		callback(data);
	});
};

const uploadNewLogo = (req, res, callback) => {
	const file = __dirname + '/noImage.jpg';
	const data = fs.readFileSync(file);
	const params = {
		Bucket: Bucket_Name,
		Key: uuid(),
		Body: req.files ? req.files.logo.data : data,
		ContentType: 'image/JPG',
	};
	S3.upload(params, (err, data) => {
		if (err) return res.json(err);
		callback(data);
	});
};
const uploadNewVideo = (req, res, callback) => {
	const file = __dirname + '/noImage.jpg';
	const data = fs.readFileSync(file);
	const params = {
		Bucket: Bucket_Name,
		Key: uuid(),
		Body: req.files ? req.files.videoId.data : data,
		ContentType: 'image/JPG',
	};
	S3.upload(params, (err, data) => {
		if (err) return res.json(err);
		callback(data);
	});
};

const updateMedia = (req, res, mediaKey, callback) => {
	if (req.files) {
		const params = {
			Bucket: Bucket_Name,
			Key: mediaKey,
			Body: req.files ? req.files.mediaId.data : null,
			ContentType: 'image/JPG',
		};
		S3.upload(params, (err, data) => {
			if (err) return res.json({ message: 'error from aws update', err });
			callback(data);
		});
	} else {
		const params = {
			Bucket: Bucket_Name,
			Key: mediaKey,
		};

		S3.getObject(params, (err, data) => {
			if (err) return res.json({ message: 'error from aws update', err });

			const updateParams = {
				Bucket: Bucket_Name,
				Key: mediaKey,
				Body: data.Body,
				ContentType: 'image/JPG',
			};
			S3.upload(updateParams, (err, updateData) => {
				if (err) return res.json({ message: 'error from aws update', err });
				callback(updateData);
			});
		});
	}
};
const updateVideo = (req, res, mediaKey, callback) => {
	if (req.files) {
		const params = {
			Bucket: Bucket_Name,
			Key: mediaKey,
			Body: req.files ? req.files.videoId.data : null,
			ContentType: 'image/JPG',
		};
		S3.upload(params, (err, data) => {
			if (err) return res.json({ message: 'error from aws update', err });
			callback(data);
		});
	} else {
		const params = {
			Bucket: Bucket_Name,
			Key: mediaKey,
		};

		S3.getObject(params, (err, data) => {
			if (err) return res.json({ message: 'error from aws update', err });

			const updateParams = {
				Bucket: Bucket_Name,
				Key: mediaKey,
				Body: data.Body,
				ContentType: 'image/JPG',
			};
			S3.upload(updateParams, (err, updateData) => {
				if (err) return res.json({ message: 'error from aws update', err });
				callback(updateData);
			});
		});
	}
};

const updateLogo = (req, res, mediaKey, callback) => {
	if (req.files) {
		const params = {
			Bucket: Bucket_Name,
			Key: mediaKey,
			Body: req.files ? req.files.logo.data : null,
			ContentType: 'image/JPG',
		};
		S3.upload(params, (err, data) => {
			if (err) return res.json({ message: 'error from aws update', err });
			callback(data);
		});
	} else {
		const params = {
			Bucket: Bucket_Name,
			Key: mediaKey,
		};

		S3.getObject(params, (err, data) => {
			if (err) return res.json({ message: 'error from aws update', err });

			const updateParams = {
				Bucket: Bucket_Name,
				Key: mediaKey,
				Body: data.Body,
				ContentType: 'image/JPG',
			};
			S3.upload(updateParams, (err, updateData) => {
				if (err) return res.json({ message: 'error from aws update', err });
				callback(updateData);
			});
		});
	}
};

const deleteMedia = (mediaKey) => {
	const params = {
		Bucket: Bucket_Name,
		Key: mediaKey,
	};

	S3.deleteObject(params).promise();
};

module.exports = { uploadNewMedia,uploadNewVideo, uploadNewLogo, updateMedia,updateVideo, updateLogo, deleteMedia };
