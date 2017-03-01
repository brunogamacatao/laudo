var mongoose = require('mongoose');
var passportLocalMongoose = require('passport-local-mongoose');

var User = new mongoose.Schema({
  nome: String,
  admin: Boolean,
  username: String,
  password: String
});

User.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', User);