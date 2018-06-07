const express = require('express')
const bodyParser = require('body-parser')
const app = express()

var userTable = {'jaigupta': {passhash:'purvi1', name:'Jai'}};

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Hello World!');
});

var loginForm = 
'<form method="POST" action="/login">' +
  '<input type="text" name="username">' +
  '<input type="password" name="password">' +
  '<input type="submit" value="Submit">'+
  '</form>';

var signupForm = 
  '<form method="POST" action="/signup">' +
  'Name: <input type="text" name="name"><br>' +
  'Username: <input type="text" name="username"><br>' +
  'Password: <input type="password" name="password"><br>' +
  '<input type="submit" value="Submit">'+
  '</form>';

function hash(password) {
	return password+"1";
}

function isAlphanumeric(val) {
  var regex = /[A-Za-z0-9]+/;
  return val.match(regex) != undefined;
}

function isAlpha(val) {
  var regex = /[A-Za-z]+/;
  return val.match(regex) != undefined;
}

app.get('/login', function(req, res) {
  res.send(loginForm);
});

app.post('/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  if (username && userTable[username] && userTable[username].passhash == hash(password)) {
    var name = userTable[username].name;
    res.send('Welcome ' + name + '!');
    return;
  }
  res.send('Login Failed! <hr>' + loginForm);
});

app.get('/signup', function(req, res) {
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
  if(password.length < 5 && !isAlphanumeric(password)) {
  	error += "Password must be at least 5 alphanumeric chars. <br/>";
  }
  if(name.length < 2 && isAlpha(name)) {
  	error += "Name must be atleast 2 chars. <br/>";
  }
  if(userTable[username] != undefined) {
	error += "Username already exists! Please try again. <br/>";
  }
  // if error is not empty return early.
  if (error != "" ) {
	res.send('SignUp Failed! <hr>' + error + '<hr>' + signupForm);
	return;
  }

  // otherwise register this user.
  userTable[username] = {
	passhash: hash(password),
	name: name,
  };
  res.send('Successfully registered! Please sign in:<br/>' + loginForm);

});

app.listen(3000, () => console.log('Listening...'));

