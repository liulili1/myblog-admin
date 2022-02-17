const { env } = require('./env')
// const UPLOAD_PATH = env === 'dev' ? '/Users/liulili/upload/myblog' : '/root/upload/myblog'
// const UPLOAD_URL = env === 'dev' ? 'http://localhost:8089/myblog/blog': 'http://www.sosoleona.xyz/book/res/img'
module.exports = {
  SUCCESS_CODE: 0,
  ERROR_CODE: -1,
  CODE_TOKEN_EXPIRED: -2,
  PWS_SALL: 'liulili_blog_admin',
  debug: false,
  PRIVATE_KEY: 'liulili_blog_admin_key',
  JWT_EXPIRES: 60 * 60,
  UPLOAD_PATH: env==='env'?'/Users/liulili/upload/myblog':'/root/upload/myblog',
  UPLOAD_URL: env==='env'?'http://localhost:8089/myblog':'http://www.sosoleona.xyz/book/res/img'
}