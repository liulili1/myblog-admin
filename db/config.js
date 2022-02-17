const {env} = require('../utils/env')
let host
let user
let password
let database
let charset = 'utf8mb4'
if(env === 'env'){
  host= 'localhost'
  user= 'root'
  password= '20180113lg'
  database= 'myblog'
}else {
  host= '120.79.24.96'
  user= 'root'
  password= '123456'
  database= 'myblog'
}
module.exports = {
  host,
  user,
  password,
  database,
  charset
}