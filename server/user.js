const { queryOne, querySql } = require("../db")

function login(username, password) {
  const sql = `select * from admin_user where username = '${username}' and password = '${password}'`
  return queryOne(sql)
}
function getInfo(username) {
  const sql = `select username, nickname, role from admin_user where username = '${username}'`
  return queryOne(sql)
}
module.exports = {
  login,
  getInfo
}
