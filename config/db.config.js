require('dotenv').config();
const mongoose = require('mongoose');
module.exports = () => {
	mongoose.connect(process.env.db_connection, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	});
	mongoose.connection.on('open', () => {
		console.log('DB connection established at http://localhost:5000/');
	});

	mongoose.connection.on('error', (err) => {
		console.log('Connection failed' + err);
	});
};
