var mongoose = require('mongoose');
var DetailSchema = require('../schemas/UserSchema');
var Detail = mongoose.model('detail', DetailSchema);

module.exports = Detail;