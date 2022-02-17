const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { PRIVATE_KEY } = require('./constant');

function md5 (s) {
 return crypto.createHash('md5')
  .update(String(s)).digest('hex')
}

/**
 * 解析token
 */
function decode(req) {
  let authoriaztion = req.get('Authorization')
  let token = ''
  if(authoriaztion && authoriaztion.indexOf('Bearer') >= 0) {
    token =  authoriaztion.replace('Bearer ','')
    return jwt.verify(token,PRIVATE_KEY)
  }else {
    token = authoriaztion
    return null
  }
  
}

function getClientIp(req) {
  return req.headers['x-forwarded-for'] ||
  req.connection.remoteAddress ||
  req.socket.remoteAddress ||
  req.connection.socket.remoteAddress;
};
module.exports = {
  md5,
  decode,
  getClientIp
}