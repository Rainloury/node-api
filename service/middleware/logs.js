"use strict";
const moment = require("moment");
const Respond = require("../utils/respond")();
const { ERRORS } = require("../constant");

module.exports = seneca => {
  return function logs(req, res, next) {
    console.log(
      `get >>>>>>>>>>>>> from: ${req.user.clientIP}`,
      `route: ${req.originalUrl} method: ${req.method}`
    );
    let requestBody = JSON.stringify(req.body);
    if (requestBody.length > 2048000 /*2mb*/) {
      requresBody = null;
    }
    seneca
      .make("EXTERNAL_INVLKE_LOG")
      .data$({
        ip: req.user.clientIP,
        body: requestBody,
        context: req.originalUrl,
        type: "request",
        userid: req.user.userId ? req.user.userId : null,
        time: mement().format("YYYY-MM-DD HH:mm:ss")
      })
      .save$((err, entity) => {
        if (err) {
          console.log("EXTERNAL请求报文入库失败", err);
          return res.send(Respond.error(ERRORS.DB_ERROR.msg, err.errno));
        }
        next();
      });
  };
};
