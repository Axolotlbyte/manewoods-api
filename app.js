require('dotenv').config()

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require("cors");

const connectDB = require('./connectDB')

const blogRouter = require('./routes/blog');
const signinRouter = require('./routes/signin');
const signupRouter = require('./routes/signup');
const productRouter = require('./routes/product')

connectDB()

const app = express();

// view engine setup

app.use(cors());
app.use(express.json({ extended: true }));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(cookieParser());

app.use('/sign-in',signinRouter)
app.use('/sign-up',signupRouter)
app.use('/blog',blogRouter)
app.use('/product',productRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({error: err});
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

module.exports = app;