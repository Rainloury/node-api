'use strict';
const _ = require('lodash');
const respond = require('../utils/respond');
module.exports = (schema) => {
  const __validator = schema;
  return function validator(req, res, next) {
    if(!req.body) {
      next();
      return;
    }
    if(__validator) {
      let result = {};
      let error = {};
      for (let k in __validator) {
        let v = __validator[k](req.body, req.body[k]);
        if(v) {
          error[k] = v;
        }
        result[k] = req.body[k];
      }
      if(_.isEmpty(error)) {
        next();
      } else {
        res.send(respond('SCHEMA').error(error, 'VALIDATOR-001', 200));
      }
    } else {
      next();
    }
  }
}