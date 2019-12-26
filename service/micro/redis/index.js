'use strict';

const {ERRORS} = require('../../constant');

module.exports = function() {
  // 插入redis
  this.add('role: redis', {action: 'add'}, (data, respond) => {
    this.make('redis_db').native$((err, pool) => {
      if(err) {
        return respond(err);
      }
      pool.set(`${data.key}`, data.value);
      if(data.timeout) {
        pool.expire(`${data.key}`, data.timeout);
      }
      respond(null, {success: true});
    });
  });

  // 查询redis
  this.add('role: redis', {action: 'get'}, (data, respond) => {
    if(!data.key) {
      return respond(ERRORS.REDIS_NO_KEY_ERROR);
    }
    this.make('redis_db').native$((err, pool) => {
      if(err) {
        return respond(err);
      }
      pool.get(`${data.key}`, (err, value) => {
        if(err) {
          return respond(err);
        }
        respond(null, {value});
      });
    });
  });

  // 删除redis
  this.add('role: redis', {action: 'delete'}, (data, respond) => {
    if(!data.key) {
      return respond(ERRORS.REDIS_NO_KEY_ERROR);
    }
    this.make('redis_db').native$((err, pool) => {
      if(err) {
        return respond(err);
      }
      pool.del(`${data.key}`, err => {
        if(err) {
          return respond(err);
        }
        respond(null, {success: true});
      });
    });
  });
  this.log.info('REDIS SERVICE 加载完毕！;
}