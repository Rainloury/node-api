'use strict';

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const schema = new Schema({
  ip: String,
  username: String,
  pwd: String
})
const model = mongoose.model('user', schema);

module.exports = model;

