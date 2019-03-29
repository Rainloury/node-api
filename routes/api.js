require("babel-register");
const express = require("express");
const router = express.Router();
const https = require("https");
const User = require('../models/User');
const Detail = require('../models/Detail');

//Api 

router.post('/mockService/v1/query', (req, res, next) => {
  const metadata = (sum) => {
    const temp = [];
    var i = 0;
    while (i < sum) {
      temp.push(new User({
        item: 'test' + i
      }));
      i++;
    }
    return temp;
  }
  const response = {
    code: 0,
    data: {
      pageNo: req.body.pageNo,
      pageSize: req.body.pageSize,
      count: 23,
      list: metadata(23)
    },
    err: null,
    success: true,
    sys: 'node-api'
  }
  res.send(JSON.stringify(response));
})
router.post('/mockService/v1/detail', (req, res, next) => {
  const response = {
    code: 0,
    data: new Detail({
      item: 'detail'
    }),
    err: null,
    success: true,
    sys: 'node-api'
  }
  res.send(JSON.stringify(response));
})
module.exports = router;