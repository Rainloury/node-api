require("babel-register");
const express = require("express");
const router = express.Router();
const https = require("https");
const User = require('../models/User');

//Api 

router.post('/mockService/v1/query', (req, res, next) => {
    const response = {
        code: 0,
        data: {
            list: new User({
                name: 'test'
            })
        }
    }
    res.send(JSON.stringify(response));
})
router.post('/mockService/v1/detail', (req, res, next) => {
    const response = {
        code: 0,
        data: {
            list: new User({
                name: 'detail'
            })
        }
    }
    res.send(JSON.stringify(response));
})
module.exports = router;