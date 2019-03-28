var mongoose = require('mongoose');
var UserSchema = require('../schemas/UserSchema');
var User = mongoose.model('user', UserSchema);

module.exports = User;