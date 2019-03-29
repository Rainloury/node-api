var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var detailSchema = new Schema({
  item: String
})

module.exports = detailSchema;