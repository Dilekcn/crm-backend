const ExpertModel = require('../model/Expert.model');
const SocialMediaModel = require('../model/SocialMedia.model');
const MediaModel = require('../model/Media.model');
const S3 = require('../config/aws.s3.config');
const mongoose = require('mongoose');

exports.getAllExperts = async (req, res, next) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await ExpertModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('socialMediaId', 'title link description')
			.populate('mediaId', 'url title alt');
		const total = await ExpertModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		next({ status: 404, message: error });
	}
};
 
 
exports.searchExperts = async (req, res, next) => {  
	const total = await ExpertModel.find({
		"$or":[
			{"firstname": { "$regex": req.body.query, "$options": "i" }},
			{"lastname": { "$regex": req.body.query, "$options": "i" }},
			{"expertise": { "$regex": req.body.query, "$options": "i" }}    
		] 
	}).countDocuments(); 
	try {
		const response = await ExpertModel.find({  
			"$or":[
				{"firstname": { "$regex": req.body.query, "$options": "i" }} ,
				{"lastname": { "$regex": req.body.query, "$options": "i" }},
				{"expertise": { "$regex": req.body.query, "$options": "i" }}    
			],
			// "isActive":req.body.isActive ? req.body.isActive : "true"
		})
		res.json({status:200,total,message: 'Search results', response });  
	} catch (error) {
		next({ status: 404, message: error });  
	}
}; 


// exports.searchExperts = async (req, res, next) => { 

// 	const total = await ExpertModel.find({ 
// 		"$or":[
// 			{"firstname": req.body.firstname ? { "$regex": req.body.firstname, "$options": "i" }:null} ,
// 			{"lastname": req.body.lastname ? { "$regex": req.body.lastname, "$options": "i" }:null},
// 			{"expertise": req.body.expertise ? { "$regex": req.body.expertise, "$options": "i" } : null}    
// 		] 
// 	}).countDocuments(); 
// 	try {
// 		const response = await ExpertModel.find({   
// 			"$or":[
// 				{"firstname": req.body.firstname ? { "$regex": req.body.firstname, "$options": "i" }:null} ,
// 				{"lastname": req.body.lastname ? { "$regex": req.body.lastname, "$options": "i" }:null},
// 				{"expertise": req.body.expertise ? { "$regex": req.body.expertise, "$options": "i" } : null} 
// 			],
// 			// "isActive":req.body.isActive ? req.body.isActive : "true"
// 		})
// 		res.json({status:200,total,message: 'Search results', response });  
// 	} catch (error) {
// 		next({ status: 404, message: error });  
// 	}
// };

 
exports.getWithQuery = async (req, res, next) => {
	try {
		const query = 
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
		const { page = 1, limit } = req.query;
		const response = await ExpertModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 })
			.populate('socialMediaId', 'title link description')
			.populate('mediaId', 'url title alt');
		const total = await ExpertModel.find(query).countDocuments(); 
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({
			message: 'Filtered expert',
			total,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		next({ status: 404, message: error });
	}
};

exports.createExpert = async (req, res, next) => {
	if (req.body.socialMediaId) { 
		const newSocialMedia =
			typeof req.body.socialMediaId === 'string'
				? await JSON.parse(req.body.socialMediaId).map((sm) => {
						return new SocialMediaModel({
							title: sm.title || '',
							link: sm.link || '',
							iconName: sm.iconName || '',
						});
				  })
				: req.body.socialMediaId.map((sm) => {
						return new SocialMediaModel({
							title: sm.title || '',
							link: sm.link || '',
							iconName: sm.iconName || '',
						});
				  });

		newSocialMedia.map((sm) => sm.save());

		const socialMediaIds = newSocialMedia.map((sm) => sm._id);

		if (req.files) {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'expert',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { firstname, lastname, expertise, isActive, isDeleted } = req.body;

				const newExpert = await new ExpertModel({
					firstname,
					lastname,
					expertise,
					content,
					mediaId: newMedia._id,
					socialMediaId: socialMediaIds,
					isActive,
					isDeleted,
				});
				newExpert
					.save()
					.then((response) =>
						res.json({
							status: 200,
							message: 'Added new expert successfully.', 
							response,
						})
					)
					.catch((error) => next({ status: 404, message: error }));
			};
			await S3.uploadNewMedia(req, res, data);
		} else if (req.body.mediaId) {
			const { firstname, lastname, expertise, isActive, isDeleted, mediaId } =
				req.body;

			const newExpert = await new ExpertModel({
				firstname,
				lastname,
				expertise,
				mediaId,
				content,
				socialMediaId: socialMediaIds,
				isActive,
				isDeleted,
			});
			newExpert
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Added new expert successfully.',
						response,
					})
				)
				.catch((error) => next({ status: 404, message: error }));
		} else {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'expert',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { firstname, lastname, expertise, isActive, isDeleted } = req.body;

				const newExpert = await new ExpertModel({
					firstname,
					lastname,
					expertise,
					content,
					mediaId: newMedia._id,
					socialMediaId: socialMediaIds,
					isActive,
					isDeleted,
				});
				newExpert
					.save()
					.then((response) =>
						res.json({
							status: 200,
							message: 'Added new expert successfully.',
							response,
						})
					)
					.catch((error) => next({ status: 404, message: error }));
			};

			await S3.uploadNewMedia(req, res, data);
		}
	} else {
		if (req.files) {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'expert',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { firstname, lastname, expertise, isActive, isDeleted } = req.body;

				const newExpert = await new ExpertModel({
					firstname,
					lastname,
					expertise,
					content,
					mediaId: newMedia._id,
					isActive,
					isDeleted,
				});
				newExpert
					.save()
					.then((response) =>
						res.json({
							status: 200,
							message: 'Added new expert successfully.',
							response,
						})
					)
					.catch((error) => next({ status: 404, message: error }));
			};

			await S3.uploadNewMedia(req, res, data);
		} else if (req.body.mediaId) {
			const { firstname, lastname, expertise, isActive, isDeleted, mediaId } =
				req.body;

			const newExpert = await new ExpertModel({
				firstname,
				lastname,
				expertise,
				content,
				mediaId,
				isActive,
				isDeleted,
			});
			newExpert
				.save()
				.then((response) =>
					res.json({
						status: 200,
						message: 'Added new expert successfully.',
						response,
					})
				)
				.catch((error) => next({ status: 404, message: error }));
		} else {
			const data = async (data) => {
				const newMedia = await new MediaModel({
					url: data.Location || null,
					title: 'expert',
					alt: req.body.alt || null,
					mediaKey: data.Key,
				});

				newMedia.save();

				const { firstname, lastname, expertise, isActive, isDeleted } = req.body;

				const newExpert = await new ExpertModel({
					firstname,
					lastname,
					expertise,
					content,
					mediaId: newMedia._id,
					isActive,
					isDeleted,
				});
				newExpert
					.save()
					.then((response) =>
						res.json({
							status: 200,
							message: 'Added new expert successfully.',
							response,
						})
					)
					.catch((error) => next({ status: 400, message: error }));
			};

			await S3.uploadNewMedia(req, res, data);
		}
	}
};

exports.getSingleExpert = async (req, res, next) => {
	if (mongoose.isValidObjectId(req.params.expertid)) {
		await ExpertModel.findById({ _id: req.params.expertid })
			.then(async (isExist) => {
				if (isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Experts Model.',
					});
				} else {
					await ExpertModel.findById(
						{ _id: req.params.expertid },
						(err, data) => {
							if (err) {
								next({ status: 404, message: err });
							} else {
								res.json({ status: 200, data });
							}
						}
					)
						.populate('socialMediaId', 'title link description')
						.populate('mediaId', 'url title alt');
				}
			})
			.catch((err) => next({ status: 500, message: err }));
	} else {
		next({ status: 400, message: 'Object Id is not valid.' });
	}
};
 



exports.updateExpert = async (req, res, next) => {
	if (mongoose.isValidObjectId(req.params.expertid)) {
		await ExpertModel.findById({ _id: req.params.expertid })
			.then(async (isExist) => {
				if (isExist === null) {
					next({
						status: 404,
						message: 'This Id does not exist in Experts Model.',
					});
				} else {
					if (req.files) {
						await ExpertModel.findById({ _id: req.params.expertid })
							.then(async (expert) => {
								await MediaModel.findById({ _id: expert.mediaId }).then(
									async (media) => {
										const data = async (data) => {
											await MediaModel.findByIdAndUpdate(
												{ _id: expert.mediaId },
												{
													$set: {
														url: data.Location || null,
														title: 'expert',
														mediaKey: data.Key,
														alt: req.body.alt,
													},
												},
												{ useFindAndModify: false, new: true }
											).catch((err) =>
												next({ status: 404, message: err })
											);
										};
										await S3.updateMedia(
											req,
											res,
											media.mediaKey,
											data
										);
									}
								);

								await expert.socialMediaId.map(async (SMId) => {
									await SocialMediaModel.findByIdAndDelete({
										_id: SMId,
									})
										.then((response) => console.log(response))
										.catch((err) => console.log(err));
								});

								const newSocialMedia =
									typeof req.body.socialMediaId === 'string'
										? await JSON.parse(req.body.socialMediaId).map(
												(sm) => {
													return new SocialMediaModel({
														title: sm.title || null,
														link: sm.link || null,
														iconName: sm.iconName || null,
													});
												}
										  )
										: req.body.socialMediaId.map((sm) => {
												return new SocialMediaModel({
													title: sm.title || null,
													link: sm.link || null,
													iconName: sm.iconName || null,
												});
										  });

								newSocialMedia.map((sm) => sm.save());

								const socialMediaIds = newSocialMedia.map((sm) => sm._id);

								const { firstname, lastname, expertise } = req.body;
								await ExpertModel.findByIdAndUpdate(
									{ _id: req.params.expertid },
									{
										$set: {
											firstname: req.body.firstname ? req.body.firstname : expert.firstname,
											lastname: req.body.lastname ? req.body.lastname : expert.lastname,
											expertise: req.body.expertise ? req.body.expertise : expert.expertise,
											content: req.body.content ? req.body.content : expert.content,
											mediaId: req.files
												? expert.mediaId
												: req.body.mediaId,
											socialMediaId: socialMediaIds,
											isActive: !req.body.isActive
												? expert.isActive
												: req.body.isActive,
											isDeleted: !req.body.isDeleted
												? expert.isDeleted
												: req.body.isDeleted,
										},
									},
									{ useFindAndModify: false, new: true } 
								)

									.then((data) =>
										res.json({
											status: 200,
											message: 'Expert is updated successfully',
											data,
										})
									)
									.catch((err) => next({ status: 404, message: err }));
							})
							.catch((err) => next({ status: 404, message: err }));
					} else {
						await ExpertModel.findById({ _id: req.params.expertid })
							.then(async (expert) => {
								await expert.socialMediaId.map(async (SMId) => {
									await SocialMediaModel.findByIdAndDelete({
										_id: SMId,
									})
										.then((response) => console.log(response))
										.catch((err) => console.log(err));
								});

								const newSocialMedia =
									typeof req.body.socialMediaId === 'string'
										? await JSON.parse(req.body.socialMediaId).map(
												(sm) => {
													return new SocialMediaModel({
														title: sm.title || null,
														link: sm.link || null,
														iconName: sm.iconName || null,
													});
												}
										  )
										: req.body.socialMediaId.map((sm) => {
												return new SocialMediaModel({
													title: sm.title || null,
													link: sm.link || null,
													iconName: sm.iconName || null,
												});
										  });

								newSocialMedia.map((sm) => sm.save());

								const socialMediaIds = newSocialMedia.map((sm) => sm._id);

								const { firstname, lastname, expertise, mediaId } =
									req.body;
								await ExpertModel.findByIdAndUpdate(
									{ _id: req.params.expertid },
									{
										$set: {
											firstname: req.body.firstname ? req.body.firstname : expert.firstname,
											lastname: req.body.lastname ? req.body.lastname : expert.lastname,
											expertise: req.body.expertise ? req.body.expertise : expert.expertise,
											content: req.body.content ? req.body.content : expert.content,
											mediaId: !mediaId ? expert.mediaId : mediaId,
											socialMediaId: socialMediaIds,
											isActive: !req.body.isActive
												? expert.isActive
												: req.body.isActive,
											isDeleted: !req.body.isDeleted
												? expert.isDeleted
												: req.body.isDeleted,
										},
									},
									{ useFindAndModify: false, new: true }
								)
									.then((data) =>
										res.json({
											status: 200,
											message: 'Expert is updated successfully',
											data,
										})
									)
									.catch((err) => next({ status: 400, message: err }));
							})
							.catch((err) => next({ status: 400, message: err }));
					}
				}
			})
			.catch((err) => next({ status: 500, message: err }));
	} else {
		next({ status: 400, message: 'Object Id is not valid.' });
	}
};

exports.removeExpert = async (req, res, next) => {
	if (mongoose.isValidObjectId(req.params.expertid)) {
		await ExpertModel.findById({ _id: req.params.expertid })
			.then(async (isExist) => {
				if (isExist === null) {
					next({
						status: 404,
						message: 'This Id is not exist in Experts Model.',
					});
				} else {
					await ExpertModel.findById({ _id: req.params.expertid })
						.then(async (expert) => {
							await MediaModel.findByIdAndUpdate(
								{ _id: expert.mediaId },
								{
									$set: {
										isActive: false,
									},
								},
								{ useFindAndModify: false, new: true }
							);
							await ExpertModel.findByIdAndDelete({
								_id: req.params.expertid,
							})
								.then(async (data) => {
									res.json({
										status: 200,
										message: 'Expert is deleted successfully',
										data,
									});
								})
								.catch((err) => { 
									next({ status: 404, message: err });
								});
						})
						.catch((err) => next({ status: 404, message: err }));
				}
			})
			.catch((err) => next({ status: 500, message: err }));
	} else {
		next({ status: 400, message: 'Object Id is not valid.' });
	}
};
