"use strict";
const rp = require("request-promise");
const CONSTANT = require("../constant");
const Respond = require("../utils/respond")();

function respond401(response) {
  response.send(
    Respond.error(
      CONSTANT.ERRORS.NO_AUTH.msg,
      CONSTANT.ERRORS.NO_AUTH.code,
      401
    )
  );
}

module.exports = {
  auth: seneca => {
    return function auth(req, res, next) {
      const token = req.headers["x-auth"];
      if (token) {
        const options = {
          method: "GET",
          timeout: 60000,
          uri: (process.env.SERVICE || "") + "/usa/v1/user/getLoginInfoByToken",
          headers: { "X-Auth": token }
        };
        rp(options)
          .then(function(parseBody) {
            let result = JSON.parse(parseBody);
            if (result.success) {
              req.user = Object.assign(req.user || {}, result.data.loginInfo);
              next();
            } else {
              respond401(res);
            }
          })
          .catch(function(e) {
            respond401(res);
          });
      }
    };
  }
};
