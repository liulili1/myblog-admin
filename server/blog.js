const Blog = require("../model/Blog");
const {insert, update, querySql, queryOne, andSql, likeSql} = require('../db/index')

 function saveBlog (blog) {
    return new Promise(async (resolve, reject) => {
      try {
        if(blog instanceof Blog) {
        const result = await insert(blog.toBlog(), 'blog')
        resolve(result)
        } else {
          reject(new reject('新增失败'))
        }
      } catch (error) {
        reject(error)
      }
    })
}
function editBlog (blog) {
  return new Promise(async (resolve, reject) => {
    try {
      if(blog instanceof Blog) {
      const result = await update(blog.toBlog(), 'blog')
      resolve(result)
      } else {
        reject(new reject('修改失败'))
      }
    } catch (error) {
      reject(error)
    }
  })
}
function getList(categoryId,key,page,size) {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = 'select b.id,b.title,b.content,b.categoryId,b.createDate,b.createUser,b.updateDate,COUNT(c.blogId) as commentNum,'
       + 'g.categoryText from blog as b LEFT JOIN blog_comment AS c ON b.id = c.blogId LEFT JOIN blog_category as g ON b.categoryId = g.category'
      let where = 'where'
      categoryId && (where = andSql(where,'categoryId',categoryId, 'b'))
      key && likeSql(where = likeSql(where, 'content', key, 'b'))
      let group = 'GROUP BY b.id ORDER BY b.createDate desc'
      let limit = ''
      if(page&&size){
        let offset = (page-1)*size
         limit = `LIMIT ${size} OFFSET ${offset}`
      }
      if(where === 'where' && limit){
        sql = `${sql} ${group} ${limit}`
      }else if(where !== 'where' && limit) {
        sql = `${sql} ${where} ${group} ${limit}`
      } else if(where === 'where' && !limit){
        sql = `${sql} ${group}`
      }else if(where !== 'where' && !limit){
        sql = `${sql} ${where} ${group}`
      }
      let countSql = `select count(*) as total from blog as b`
      if(where !== 'where'){
        countSql = `${countSql} ${where}`
      }
      const count = await querySql(countSql)
      const result =await querySql(sql)
      resolve({result,total:count[0].total})
    } catch (error) {
      reject(error)
    }
  })
  
}
function deleteBlog(id) {
  return  new Promise(async (resolve, reject) => {
    try {
      let sql = `delete from blog where id = '${id}'`
      const result = await querySql(sql)
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
function getDetail(id) {
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `select b.id,b.title,b.content,b.categoryId,b.createDate,b.createUser,COUNT(c.blogId) as commentNum from blog as b 
      LEFT JOIN blog_comment AS c ON b.id = c.blogId where b.id='${id}' GROUP BY b.id ORDER BY b.createDate desc`
      const result = await queryOne(sql)
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
function getCatetory() {
  return new Promise(async (resolve,reject) => {
    try {
      let sql = `SELECT b.categoryId,COUNT(1) as num, c.categoryText from blog as b LEFT JOIN blog_category as c ON b.categoryId = c.id GROUP BY b.categoryId`
      const result = await querySql(sql);
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
function getHotList() {
  return new Promise(async (resolve,reject) => {
    try {
      let sql = `SELECT b.id, b.title, count(1) as watchNum from blog as b LEFT JOIN blog_evaluate as e on b.id = e.blogId where type = 'watch'  GROUP BY b.id limit 0,10 `
      const result = await querySql(sql);
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
function updateBlogEval(ip, id, type) {
  return new Promise(async (resolve, reject) => {
    //先查询数据库判断是否点赞或收藏
    let evalObj = {}
    if(ip && id && type){
      try {
        let sql = `SELECT * from blog_evaluate where blogId = '${id}' and userIp = '${ip}' and type = '${type}' `
        const data = await querySql(sql);
        if(!data || data.length < 1){
          evalObj = {
            blogId:id,
            userIp:ip,
            type
          }
          const result = await insert(evalObj, 'blog_evaluate')
          resolve(result)
        }
        resolve()
      } catch (error) {
        reject(error)
      }
    }else {
      reject("新增失败")
    }
  })
}
function getBlogEvalInfo(id){
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `SELECT count(type) as num,type from blog_evaluate where blogId = '${id}' GROUP BY type`
      let result = await querySql(sql)
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
function getCategoryList(){
  return new Promise(async (resolve, reject) => {
    try {
      let sql = `select * from blog_category`
      let result = await querySql(sql)
      resolve(result)
    } catch (error) {
      reject(error)
    }
  })
}
module.exports = {
  saveBlog,
  editBlog,
  getList,
  deleteBlog,
  getDetail,
  getCatetory,
  getHotList,
  updateBlogEval,
  getBlogEvalInfo,
  getCategoryList
}