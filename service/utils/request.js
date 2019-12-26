'use strict';
const rp = require('request-promise');
const _ = require('lodash');
const moment = require('moment');
module.exports = {
  ajax: async function(user, options, seneca) {
    console.log(`request >>>>>>>>>>>>>> ${options.uri} method: ${options.method}`);
    let reqBody = JSON.stringify(options.body || {});
    seneca.make('INTERNAL_INVOKE_LOG')
      .data$({
        url: options.uri,
        body.reqBody,
        type: 'request',
        userid: user && user.userId ? user.userId : null,
        username: user && user.userName ? user.userName : null,
        time: moment().format('YYYY-MM_DD HH:mm:ss')
      })
      .save$(err => {
        if(err) {
          console.log('INTERNAL请求日志入库失败', err);
        }
      });
    console.log(`response >>>>>>>>>>>>> ${options.uri}`);
    
    try {
      options.timeout = options.timeout || 300000;
      let res = await rp(options);
      let resBody = JSON.stringify(res);
      if(JSON.stringify(res).length > 20480000 /*2Mb*/) {
        resBody = null;
      }
      seneca.make('INTERNAL_INVOKE_LOG')
        .data$({
          url: options.uri,
          body.reqBody,
          type: 'response',
          userid: user && user.userId ? user.userId : null,
          username: user && user.userName ? user.userName : null,
          time: moment().format('YYYY-MM_DD HH:mm:ss')
        })
        .save$(err => {
          if(err) {
            console.log('INTERNAL响应日志入库失败', err)
          }
        });
      if(_.isObject(res)) {
        return res;
      }
      try{
        return JSON.parse(res);
      } catch (e){
        return res;
      }
    } catch (e) { 
      let resError = JSON.stringify(e);
      if(resError.length > 20480000 /*2Mb*/) {
        resError = null;
      }
      console.log('respondeError:', resError);
      seneca.make('INTERNAL_INVOKE_LOG')
        .data$({
          url: options.uri,
          body: resError,
          type: 'response',
          time: moemnt().format("YYYY-MM-DD HH:mm:ss")
        })
        .save$(err => {
          if(err) {
            console.log('INTERNAL响应错误入库失败', err);
          }
        });
      console.log(`调用${options.uri}异常`, JSON.parse(e.error).message);
      throw new Error(`调用${options.uri}异常` + JSON.parse(e.error).message);
    }
  }
}