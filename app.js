var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const fileUpload = require('express-fileupload');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users.routes');
const postsRouter = require('./routes/posts.routes');
const companyDescriptionRouter = require('./routes/companyDescription.routes');
const companyIntroductionRouter = require('./routes/companyIntroductions.routes');
const sliderRouter = require('./routes/slider.routes');
const mediasRouter = require('./routes/medias.routes');
const expertsRouter = require('./routes/experts.routes');
const messagesRouter = require('./routes/messages.routes')
<<<<<<< HEAD
const footerRouter = require('./routes/footer.routes');
const productRouter =require('./routes/products.routes');
=======
const footerRouter = require('./routes/footer.routes')
const subscribersRouter = require('./routes/subscribers.routes')
const staticPagesRouter = require('./routes/staticPage.routes')
const menusRouter = require('./routes/menus.routes')
>>>>>>> 56c0e5f4a0e49ae178877b4d8cf76b8f488ee60a

//middlewares
// const verifyToken = require('./auth/verifyToken');

var app = express();

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
app.use(cors());

app.use('/', indexRouter);
app.use('/', usersRouter);
app.use('/', mediasRouter);
app.use('/', postsRouter);
app.use('/', postsRouter);
app.use('/', companyDescriptionRouter);
app.use('/', companyIntroductionRouter); 
app.use('/', sliderRouter);
app.use('/', expertsRouter);
app.use('/', messagesRouter);
<<<<<<< HEAD
app.use('/', footerRouter);
app.use('/', productRouter);
=======
app.use('/', footerRouter)
app.use('/', subscribersRouter)
app.use('/', staticPagesRouter)
app.use('/', menusRouter)


>>>>>>> 56c0e5f4a0e49ae178877b4d8cf76b8f488ee60a


// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
