const expressJwt = require('express-jwt')
const { PRIVATE_KEY } = require('../utils/constant')

const jwtAuth = expressJwt({
  secret: PRIVATE_KEY,
  credentialsRequired: true, //开启token验证
  algorithms: ['HS256']
}).unless({
  path: [
    '/',
    '/user/login',
    '/blog/getList',
    '/blog/getDetail',
    '/comment/pushComment',
    '/comment/getCommentByBlog',
    '/user/getInfo',
    '/blog/getCategory',
    '/blog/getHotList',
    '/blog/blogEval',
    '/blog/getBlogEvalInfo',
    '/blog/getCatetoryList'
  ]
})

module.exports = jwtAuth