'use strict';

const oracledb = require('oracledb');
const Respond = require('../../utils/respond')();

function Oracle$ () {
  console.log('构建Oracle连接');
  Oracle$.prototype.getConnection = function() {
    return oracledb.getConnection({
      user: process.env.ORACLE_DATABASE_USER,
      password: process.env.ORACLE_DATABASE_PWD,
      connectString: process.env.ORACLE_DATABASE_HOST + ':' + process.env.ORACLE_DATABASE_PORT + '/' + process.env.ORACLE_DATABASE_SERVICE
    })
  }
  const oracle$ = new Oracle$();
  module.exports = function () {
    this.add('role: oracle', {action: 'execute-sql'}, async (data, response) => {
      const connection = await oracle$.getConnection();
      try {
        const sql = data.sql;
        console.log(sql);
        const res = await connection.execute(sql);
        await connection.commit();
        if (connection) {
          await connection.close();
        }
        response(Respond.body(res));
      } catch(e) {
        if(connection) {
          try{
            await connection.close();
          } catch(err) {
            console.error(err);
          }
        }
        response(Respond.error(e.message, e.errno));
      }
    });

    this.add('role: oracle', {action: 'execute-proc'}, async (data, response) => {
      const connection = await oracle$.getConnection();
      try {
        const result = await connection.execute(
          `BEGIN ${data.proc} END`,
          data.procParam
        );
        if(result.outBinds === 'SUCCESS') {
          response(Respond.body(true));
        } else {
          response(Respond.error('存储过程执行失败', -1));
        }
      } catch(e) {
        if(connection) {
          try {
            await connection.close();
          }catch(err) {
            console.log(err);
          }
        }
        response(Respond.error(e.message, e.errno));
      }
    })
  }
  this.log.info('ORACLE SERVICE 加载完毕！');
}