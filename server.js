var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var md5 = require('md5');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/userDB');

var User = require('./user');

app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));


app.get('/', function(req, res) {
  res.send('Hello World!');
});

var loginForm =
'<form method="POST" action="/login">' +
'<input type="text" name="username">' +
'<input type="password" name="password">' +
'<input type="submit" value="Submit">' +
'</form>';

var signupForm =
'<form method="POST" action="/signup">' +
'Name: <input type="text" name="name"><br>' +
'Username: <input type="text" name="username"><br>' +
'Password: <input type="password" name="password"><br>' +
'<input type="submit" value="Submit">' +
'</form>';

function hash(password) {
  return md5(password);
}

function isAlphanumeric(val) {
  var regex = /[A-Za-z0-9]+/;
  return val.match(regex) !== undefined;
}

function isAlpha(val) {
  var regex = /[A-Za-z]+/;
  return val.match(regex) !== undefined;
  app.get('/login', function(req, res) {
    res.send(loginForm);
  });
}

app.get('/login', loginMiddleware, function(req, res) {
  res.send(loginForm);
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var passwordHash = md5(password);
  User.findOne({
    username: username,
    passHash: passwordHash
  }, function(err, user) {
    if (err) {
      res.send('Error in login: ' + err);
      return;
    }
    if (!user) {
      res.send('User does not exist! <a href="/signup"> Please signup! </a>');
      return;
    }
    res.send('Login successful!');
  });
});

app.get('/signup', function(ignore_req, res) {
  res.send(signupForm);
});

app.post('/signup', function(req, res) {
  var username = req.body.username;
  var name = req.body.name;
  var password = req.body.password;
  var error = "";
  if (username.length < 5) {
    error += "Username must be atleast 5 chars.<br/>";
  }
  if (password.length < 5 && !isAlphanumeric(password)) {
    error += "Password must be at least 5 alphanumeric chars. <br/>";
  }
  if (name.length < 2 && isAlpha(name)) {
    error += "Name must be atleast 2 chars. <br/>";
  }

  // if error is not empty return early.
  if (error !== "") {
    res.send('SignUp Failed! <hr>' + error + '<hr>' + signupForm);
    return;
  }

  // otherwise register this user.
  var newUser = new User({
    name: name,
    username: username,
    passHash: md5(password)
  });
  newUser.save(function(err) {
    if (err) {
      res.send('Signup failed with an err ' + err + " Please try again <a href='signup'> here </a>");
      return;
    }
  });

  res.send('Successfully registered! Please sign in:<br/>' + loginForm);

});

app.listen(3000, function() {
  console.log('Listening...');
});
