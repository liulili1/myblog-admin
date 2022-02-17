const express = require('express')
const router = express.Router()
const boom = require('boom')
const Result = require('../utils/model/result.js')
const userRouter = require('./user')
const blogRouter = require('./blog')
const commentRouter = require('./comment')
const jwtAuth = require('./jwt')



router.use(jwtAuth)
router.use('/user', userRouter)
router.use('/blog',blogRouter)
router.use('/comment',commentRouter)
//集中处理404的中间件，404兜底，必须放在所有路由的后面，否则会拦截正常的请求

router.use((req, res, next) => {
  next(boom.notFound('接口不存在'))
})

router.use((err, req, res, next) => {
  console.log("err::::",err.name);
  if(err.name === 'TokenExpiredError') {
    return new Result('token 已失效，请重新登陆').expired(res)
  }
  let msg = (err&&err.message) || '系统错误'
  let statusCode = (err.output&&err.output.statusCode) || 500
  let errMsg = (err.output&&err.output.payload && err.output.payload.error) || err.message
  new Result(null, msg, {
    code: statusCode,
    errMsg
  }).fail(res.status(statusCode))
})

module.exports = router