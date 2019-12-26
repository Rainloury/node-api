'use strict';

const _ = require('lodash');
module.exports = {
  "login": {
    captcha: (body, value) => {
      if(_.isNil(value)) {
        return '验证码不可以为空';
      }
      if(!/^\d{6}/.test(value)) {
        return '验证码错误';
      }
      return null;
    }
  }
}