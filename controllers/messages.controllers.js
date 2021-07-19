const MessagesModel = require('../model/Messages.model');

exports.getAll = async (req, res) => {
	try {
		const { page = 1, limit } = req.query;
		const response = await MessagesModel.find()
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const total = await MessagesModel.find().countDocuments();
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({ total, pages, status: 200, response });
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.getWithQuery = async (req, res) => {
	try {
		const query =
			typeof req.body.query === 'string'
				? JSON.parse(req.body.query)
				: req.body.query;
		const { page = 1, limit } = req.query;
		const response = await MessagesModel.find(query)
			.limit(limit * 1)
			.skip((page - 1) * limit)
			.sort({ createdAt: -1 });
		const pages = limit === undefined ? 1 : Math.ceil(total / limit);
		res.json({
			message: 'Filtered messages',
			total: response.length,
			pages,
			status: 200,
			response,
		});
	} catch (error) {
		res.json({ status: 404, message: error });
	}
};

exports.create = async (req, res) => {
	const {
		firstname,
		lastname,
		subject,
		content,
		email,
		phoneNumber,
		isActive,
		isRead,
		isDeleted,
		isReplied,
	} = req.body;

	const newMessage = await new MessagesModel({
		firstname,
		lastname,
		subject,
		content,
		email,
		phoneNumber,
		isActive,
		isRead,
		isDeleted,
		isReplied,
	});
	newMessage
		.save()
		.then((response) =>
			res.json({
				status: 200,
				message: 'New message is created successfully',
				response,
			})
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.getSingleMessage = async (req, res) => {
	await MessagesModel.findById({ _id: req.params.id }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ status: 200, data });
		}
	});
};

exports.getMessagesBySubject = async (req, res) => {
	const { page, limit } = req.query;
	const total = await MessagesModel.find().countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);

	await MessagesModel.find({ subject: req.params.subject }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.sort({ createdAt: -1 });
};

exports.getMessagesByEmail = async (req, res) => {
	const { page, limit } = req.query;
	const total = await MessagesModel.find().countDocuments();
	const pages = limit === undefined ? 1 : Math.ceil(total / limit);

	await MessagesModel.find({ email: req.params.email }, (err, data) => {
		if (err) {
			res.json({ status: 404, message: err });
		} else {
			res.json({ total, pages, status: 200, data });
		}
	})
		.limit(limit * 1)
		.skip((page - 1) * limit)
		.sort({ createdAt: -1 });
};

exports.updateMessage = async (req, res) => {
	await MessagesModel.findByIdAndUpdate({ _id: req.params.id }, { $set: req.body })
		.then((data) =>
			res.json({ status: 200, message: 'Message is updated successfully', data })
		)
		.catch((err) => res.json({ status: 404, message: err }));
};

exports.removeSingleMessage = async (req, res) => {
	await MessagesModel.findByIdAndDelete({ _id: req.params.id })
		.then((data) =>
			res.json({ status: 200, message: 'Message is deleted successfully', data })
		)
		.catch((err) => res.json({ status: 404, message: err }));
};
