'use strict';

const schema = require('./schema');
const validator = require('../../middleware/validator');
const logs = require('../../middleware/logs');
const response = require('../../middleware/response');
const {DICTS} = require('../../constant');

module.exports = function user(){
  this.add('role: dictservice, path: dict', function(params, respond) {
    this.act('role:dictservice', {
      cmd: 'dict',
      opt: 'get',
      user: params.args.user
    }, respond);
  });

  // api 开放的接口配置
  this.add({init: 'user'}, function(params, respond) {
    this.act('role: web', {
      routes: [
        {
          prefix: `${process.env.CONTEXT}/user`,
          pin: 'role: user, path: *',
          map: {
            "dict": {
              GET: true,
              middleware: [validator(schema['dict']), logs(this), response(this)]
            }
          }
        }
      ]
    });
    respond();
  });
  this.log.info('USER API 路由加载完毕！');
}