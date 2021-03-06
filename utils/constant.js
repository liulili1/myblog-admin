const { env } = require('./env')
const UPLOAD_PATH = env === 'dev' ? '/Users/liulili/upload/myblog' : '/root/upload/myblog'
const UPLOAD_URL = env === 'dev' ? 'http://localhost:8089/myblog': 'http://120.79.24.96/myblog'
module.exports = {
  SUCCESS_CODE: 0,
  ERROR_CODE: -1,
  CODE_TOKEN_EXPIRED: -2,
  PWS_SALL: 'liulili_blog_admin',
  debug: false,
  PRIVATE_KEY: 'liulili_blog_admin_key',
  JWT_EXPIRES: 60 * 60,
  UPLOAD_PATH: UPLOAD_PATH,
  UPLOAD_URL: UPLOAD_URL
}