'use strict'
const moment = require('moment');
module.exports = (seneca) => {
  return function response(req, res, next) {
    let _send = res.send;
    res.send = function (body) {
      res.statusCode = body.http ? body.http : 200;
      delete body.http;
      delete res.send;
      console.log(`send >>>>>>>>>>> to: ${req.user.clientIP}`);
      let responseBody = JSON.stringify(body);
      if(responseBody.length > 2048000 /*2Mb*/) {
        responseBody = null;
      }
      seneca.make('EXTERNAL_INVOKE_LOG')
        .data$({
          ip: req.user.clientIP,
          body: responseBody,
          context: req.originalUrl,
          type: 'response',
          userid: req.user.userId ? req.user.userId : null
        })
        .save$((err, entity) => {
          if(err) {
            console.log(`EXTERNAL响应报文入库失败`, err);
          }
        });
      _send.call(res, body);
    }
    next();
  }
}