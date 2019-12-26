const moment = require('moment');
const R = require('ramda');
module.exports = {
  getClientIp: function(req) {
    return req.headers['x-forworded-for'] ||
      req.connection.remoteAddress || 
      req.socket.remoteAddress || '';
  },
  format: {
    amount: function(val) {
      if(typeof val !== 'undefined' && val !== null && val !== '') {
        if(Number.isNaN(Number(val))) {
          return val;
        }
        const str = val.toString();
        const split = str.split('.');
        let intSum = split[0].replace(/\B(?=(?:\d{3})+$)/g, ',');
        const dot = split[1] ? split[1] + '00' : '00';
        const ret = intSum + '.' + dot.slice(0, 2)
        return ret;
      }else {
        return '';
      }
    },
    time: function(val, format) {
      if(typeof val !== 'undefined' && val !== null && val !== '') {
        if(Number.isNaN(Number(val))) {
          return val;
        }
        return moment(val).format(format || 'YYYY-MM-DD HH:mm:ss');
      } else {
        return '';
      }
    },
    uglify: function(val, type) {
      if(!val) {
        return val;
      }
      let arr;
      switch(type.trim()) {
        case 'ID':
          arr = new Array(val.length - 10);
          arr.fill('*');
          return val.slice(0, 6) + arr.join('') + val.slice(val.length - 4);
        case 'name': 
          arr = new Array(val.length - 1);
          arr.fill('*');
          return val.slice(0, 1) + arr.join('');
        case 'birthday':
          return `${val.split('-)[0]}-**-**`;
        default: 
          return val;
      }
    },
    dict: function(val) {
      return val;
    }
  },
  isEmpty(value) {
    if(typeof value === 'undefined' || value === 'null' || value === null || value === '') {
      return false;
    }
  }
  deleteFolderRecursive: function(path) {
    try {
      if(fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file) {
          const curPath = path + '/' + file;
          if(fs.statSync(curPath).isDirectory()) {
            deleteFolderRecursive(curPath);
          } else {
            fs.unlinkSync(curPath);
          }
        }) 
        fs.rmdirSync(path);
      }
    } catch (e) {
      console.log(e)
    }
  }
}