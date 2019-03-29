var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//创建Schema
var detailSchema = new Schema({
  item: String,
  list: Array
})

module.exports = detailSchema;