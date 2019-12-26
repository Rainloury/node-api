'use strict';

module.exports = function(){
  return {
    error: function (message, sysCode, statusCode) {
      return {
        err: message,
        code: sysCode,
        statusCode: statusCode,
        success: false,
        sys: 'node-api',
      }
    },
    body: function (body) {
      return {
        err: null,
        data: body,
        code: 0,
        success: true,
        sys: 'node-api',
      }
    }
  }
}