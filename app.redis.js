'use strict';
const seneca = require('seneca');
const schedule = require('node-schedule');
const apollo = require('node-apollo');

const config = {
  configServerUrl: process.env.APOLLO,
  appId: 'node-api',
  clusterName: 'default',
  namespaceName: ['application']
};

apollo.remoteConfigServiceSkipCache(config).then(result => {
  console.log('成功获取配置信息');
  console.log(result);
  for (let k in result) {
    process.env[k] = result[k];
  }
  let redisService = seneca({
    debug: {undead: true},
    timeout: 360000
  });
  redisService
    .use('basic')
    .use('seneca-standard-query')
    .use('seneca-store-query')
    .use('entity');
  if(process.env.REDIS) {
    redisService.use('redis-store', {
      uri: process.env.REDIS,
      options: {
        disable_resubscribing: false,
        no_ready_check: true
      }
    });
  }
  redisService.use(require('./service/micro/redis')).listen({port: process.env.REDIS_PORT, pin: 'role:redis'});
  redisService.ready(() => {
    redisService.log.info('+++++++++++++ Redis 服务启动 ++++++++++++');
    schedule.scheduleJob('XXXX', function() {
      redisService.make('api-redis').native$((err, connectionPool) => {
        connectionPool.get('heart_detection', (err, t) => {
          console.log(t);
        })
      })
    })
  })
})


