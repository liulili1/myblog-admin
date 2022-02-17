const express = require('express')
//express-validator 验证http 请求体中的参数是否符合预期，如username必须是string
const {body, validationResult} = require('express-validator') 
const boom = require('boom')
const { md5, decode } = require('../utils')
const { PWS_SALL, PRIVATE_KEY, JWT_EXPIRES } = require('../utils/constant')
const { login, getInfo } = require('../server/user')
const Result = require('../utils/model/result')
const jwt = require('jsonwebtoken')

const router = express.Router();

router.get('/test', (req, res) => {
  res.send('test')
})

router.post('/login', [body('username').isString().withMessage('username类型不正确')], (req, res, next) => {
  
  let err = validationResult(req);
  //1、验证参数类型是否正确
  if(!err.isEmpty()) {
    const [{msg}] = err.errors
    next(boom.badRequest(msg))
  } else {
    //2、 登陆
    let {username, password} = req.body
    //利用md5加密算法对password加密
    password = md5(`${password}${PWS_SALL}`)
    login(username, password).then(data => {
      if(!data || data.length === 0) {
        new Result(null, '登录失败，用户名或者密码不正确').fail(res)
      } else {
       const token = jwt.sign(
          {username},PRIVATE_KEY, {expiresIn: JWT_EXPIRES}
        )
        new Result( {token}, '登录成功').success(res)
      }
    })
    
  }
})
router.get('/getInfo', (req, res, next) => {
  const result = decode(req)
  if(!result){
    return new Result('用户未登录').success(res)
  }
  let username = result['username']
  getInfo(username).then(data => {
    return new Result(data, '查询用户信息成功').success(res)
  }).catch( error => {
    next(boom.badImplementation(error))
  })
})

module.exports = router
