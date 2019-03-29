require("babel-register");
const express = require("express");
const router = express.Router();
const https = require("https");
const User = require('../models/User');

//Api 

router.post('/mockService/v1/query', (req, res, next) => {
  const data = (sum) => {
    const temp = [];
    var i = 0;
    while (i < sum) {
      temp.push(new User({
        item: 'test'+ i
      }));
      i++;
    }
    return temp;
  }
  const response = {
    code: 0,
    data: data(10)
  }
  res.send(JSON.stringify(response));
})
router.post('/mockService/v1/detail', (req, res, next) => {
  const response = {
    code: 0,
    data: new User({
      name: 'detail'
    })
  }
  res.send(JSON.stringify(response));
})
module.exports = router;