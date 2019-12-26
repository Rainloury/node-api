'use strict';

const seneca = require('seneca');
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
  let oracleSevice = seneca({
    debug: {undead: true},
    timeout: 360000
  });
  oracleSevice.use('./service/micro/oracle').listen({port: process.env.ORACAL_PORT, pin: 'role: oracle'});
  oracleSevice.ready(() => {
    oracleSevice.log.info('++++++++++++++ Oracle服务启动 +++++++++++++')
  })
}) 