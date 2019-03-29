require("babel-register");
const express = require("express");
const router = express.Router();
const https = require("https");
const User = require('../models/User');
const Detail = require('../models/Detail');

//Api 
 const metadata = (sum) => {
   const temp = [];
   var i = 0;
   while (i < sum) {
     temp.push(new User({
       item: `test${i}`
     }));
     i++;
   }
   return temp;
 }

router.post('/mockService/v1/query', (req, res, next) => {
 
  const count = req.body.count ? req.body.count : 23;
  const response = {
    code: 0,
    data: {
      company: '上汽财务',
      feeAmount: 100000,
      data: {
        pageNo: req.body.pageNo,
        pageSize: req.body.pageSize,
        count,
        list: metadata(count)
      }
    },
    err: null,
    success: true,
    sys: 'node-api'
  }
  res.send(JSON.stringify(response));
})
router.post('/mockService/v1/detail', (req, res, next) => {
  const list = metadata(5);
  const response = {
    code: 0,
    data: new Detail({
      item: '上汽财务',
      list
    }),
    err: null,
    success: true,
    sys: 'node-api'
  }
  res.send(JSON.stringify(response));
})
module.exports = router;