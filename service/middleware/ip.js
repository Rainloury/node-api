const {getClientIp} = require('../utils/tool');
module.exports = {
  ip: function(req, res, next) {
    req.user = {clientIP: getClientIp(req).replace('::ffff:', '')};
    next();
  }
}