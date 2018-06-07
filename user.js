var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
  name: String,
    username: String,
    passHash: String
});


var User = mongoose.model('User', UserSchema);

module.exports = User;

