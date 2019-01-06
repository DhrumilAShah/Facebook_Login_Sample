var express = require('express');
var passport = require('passport');
var Strategy = require('passport-facebook').Strategy;

passport.use(new Strategy({
    clientID: '1123926834453807',
    clientSecret: '9e07c9f7c0b78282fa1cf670a2610206',
    callbackURL: 'http://localhost:3000/login/facebook/return'
  },(accessToken, refreshToken, profile, cb) => {
    return cb(null, profile);
  }));

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});

var app = express();

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use(require('morgan')('tiny'));
app.use(require('cookie-parser')());
app.use(require('body-parser').urlencoded({ extended: true }));
app.use(require('express-session')({ secret: 'dasnadas', resave: true, saveUninitialized: true }));

app.use(passport.initialize());
app.use(passport.session());

app.get('/',(req, res) => {
    res.render('home', { user: req.user });
  });

app.get('/login',(req, res)=>{
    res.render('login');
  });

app.get('/login/facebook', passport.authenticate('facebook'));

app.get('/login/facebook/return',
  passport.authenticate('facebook', { failureRedirect: '/login' }),(req, res) => {
    res.redirect('/');
  });

app.get('/profile',
  require('connect-ensure-login').ensureLoggedIn(),(req, res) => {
    res.render('profile', { user: req.user });
  });

app.listen(3000,()=>{console.log('Server Started on port 3000')});
