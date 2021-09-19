var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload');
// const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.routes');

const iconBoxRouter = require('./routes/iconBox.routes');
const companyIntroductionRouter = require('./routes/companyIntroductions.routes');
const sliderRouter = require('./routes/slider.routes');
const mediasRouter = require('./routes/medias.routes');
const expertsRouter = require('./routes/experts.routes');
const messagesRouter = require('./routes/messages.routes');
const subscribersRouter = require('./routes/subscribers.routes');
const staticPagesRouter = require('./routes/staticPage.routes');
const menusRouter = require('./routes/menus.routes');
const rolesRouter = require('./routes/roles.routes');
const productsRouter = require('./routes/products.routes');
const socialMediaRouter = require('./routes/socialMedia.routes');
const companyProfileRouter = require('./routes/companyProfile.routes');
const commentsRouter = require('./routes/comments.routes');
const sectionsRouter = require('./routes/sections.routes');
const blogsRouter = require('./routes/blogs.routes');
const videosRouter = require('./routes/videos.routes');

//middlewares
// const verifyToken = require('./auth/verifyToken');
const errorHandling = require('./middlewares/errorHandling')

var app = express();
app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Credentials', true);
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
	res.header(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept'
	);
	next();
});

// app.use(function(req, res, next) {
// 	res.header("Access-Control-Allow-Origin", '*');
// 	res.header("Access-Control-Allow-Credentials", true);
// 	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
// 	res.header("Access-Control-Allow-Headers", 'Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
// 	next();
//   });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//DB connection
require('./config/db.config')();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
// app.use(cors());

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', mediasRouter);
app.use('/', iconBoxRouter);
app.use('/', companyIntroductionRouter);
app.use('/', sliderRouter);
app.use('/', expertsRouter);
app.use('/', messagesRouter);
app.use('/', subscribersRouter);
app.use('/', staticPagesRouter);
app.use('/', menusRouter);
app.use('/', rolesRouter);
app.use('/', socialMediaRouter);
app.use('/', companyProfileRouter);
app.use('/', productsRouter);
app.use('/', commentsRouter);
app.use('/', sectionsRouter);
app.use('/', blogsRouter);
app.use('/', videosRouter); 


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(errorHandling);

module.exports = app;
