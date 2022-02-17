const Comment = require("../model/Comment");
const {insert, querySql, deleteOne, queryOne} = require('../db/index')

 function pushComment(comment) {
    return new Promise(async (resolve, reject) => {
      try {
        if(comment instanceof Comment) {
        const result = await insert(comment.toComment(), 'blog_comment')
        resolve(result)
        } else {
          reject(new reject('新增失败'))
        }
      } catch (error) {
        reject(error)
      }
    })
}
function getCommentByBlog(id, type) {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = ""
      if(id){
        sql = `select * from blog_comment where blogId = '${id}' and messageType = '${type}' order by createDt desc `
      }else {
        sql = `select * from blog_comment where messageType = '${type}' order by createDt desc `
      }
      const result = await querySql(sql)
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  pushComment,
  getCommentByBlog
}