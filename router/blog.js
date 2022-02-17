const express = require('express')
const {body, validationResult} = require('express-validator')
const {UPLOAD_PATH, UPLOAD_URL} = require('../utils/constant')
const boom = require('boom')
const path = require('path')
const router = express.Router()
const multer = require('multer')
const Result = require('../utils/model/result')
const Blog = require('../model/Blog')
const {saveBlog, getList, deleteBlog, getDetail, getCatetory, getHotList, updateBlogEval, getBlogEvalInfo, getCategoryList} = require('../server/blog')
const { decode } = require('../utils/index')

// 思路
// 上传内容并储存——1.设置存储的地方——2.设置存储时的名字{1.获取原来名字的后缀，2.再重新命名}
var headerConfig = multer.diskStorage({
    // destination目的地
    destination: `${UPLOAD_PATH}/blog`,
    // fliename 文件名 后面跟函数,函数有三个参数
    // file为当前上传的图片 
    filename: function (req, file, callback) {
        // 先获取原来图片的后缀名
        var index =Math.floor(Math.random()*1000)
   
        //  1.选找到图片的名字,并进行分割
        var nameArray = file.originalname.split('.')
        // 长度是从1开始的 索引是从0开始的
        // [1,2,3,4]长度4 -1 [nameArray.length - 1]索引
        var type = nameArray[nameArray.length - 1]

        // 新的名字 = 随机数组.照片类型
        var imageName = index + '.' + type;
       

        // 设置回调的内容,参数1：错误信息，参数2：图片新的名字
        callback(null, imageName)

    }
})
var upload = multer({storage:headerConfig})
router.post('/upload',upload.single('image'), function(req, res, next) {
  if(!req.file || req.file.length === 0){
    return new Result('上传图片失败').fail(res)
  }else {
    const url = `${UPLOAD_URL}/blog/${req.file.filename}`
    return new Result({url}, '上传图片成功').success(res)
  }
})
router.post('/saveData',[body('title').isString().withMessage('title类型不正确')], (req, res, next) => {

const err = validationResult(req)
if(err.isEmpty()) {
  const {msg} = err
  next(boom.badRequest(msg))
}else {
  const result = decode(req)
  let username = result? result['username']:''
  const {title, content, category} = JSON.parse(req.body.param)
  let blog = new Blog(title, category, content)
  blog.createUser = username
  console.log('blog:',blog);
  saveBlog(blog).then(data => {
   return new Result('新增成功').success(res)
  }).catch(err=>{
    next(boom.badRequest(err))
  })
}
})

router.get('/getList',(req, res, next) => {
  const {categoryId, key, page, size} = req.query
  getList(categoryId, key, page, size).then(data => {
    return new Result(data, '请求成功').success(res)
  }).catch(err => {
    next(boom.badRequest(err))
  })
})

router.get('/deleteBlog', (req, res, next) => {
  const {id} = req.query
  deleteBlog(id).then(data => {
    return new Result('删除博客成功').success(res)
  }).catch(err => {
    next(boom.badRequest(err))
  })
})
router.get('/getDetail', (req, res, next) => {
  const {id,ip,edit} = req.query
    if(!id) next(boom.badRequest('请求参数有误'))
      getDetail(id).then(data => {
      if(!edit){
        updateBlogEval(ip,id,'watch').catch(err => {
          next(boom.badImplementation(err))
        })
      }
      return new Result(data, '查询成功').success(res)
    }).catch(err => {
      next(boom.badRequest(err))
    })
})
router.get('/getCategory', (req, res, next) => {
  getCatetory().then(data => {
    return new Result(data,'请求成功').success(res)
  }).catch(err => {
    next(boom.badImplementation(err))
  })
})
router.get('/getCategoryList', (req, res, next) => {
  getCategoryList().then(data => {
    return new Result(data,'请求成功').success(res)
  }).catch(err => {
    next(boom.badImplementation(err))
  })
})
router.get('/getHotList', (req, res, next) => {
  getHotList().then(data => {
    return new Result(data, '请求成功').success(res)
  }).catch(err => {
    next(boom.badImplementation(err))
  })
})
router.get('/blogEval', (req, res, next) => {
  const {ip, id, type} = req.query
  
  if(!ip || !id || !type){
    next(boom.badRequest('请求参数有误'))
  }
  updateBlogEval(ip,id,type).then(()=> {
    return  new Result('点赞成功').success(res)
  }).catch(err => {
    next(boom.badImplementation(err))
  })
})
router.get('/getBlogEvalInfo', (req, res, next) => {
  const {id} = req.query
  if(!id){
    next(boom.badRequest('请求参数有误'))
  }
  getBlogEvalInfo(id).then(data => {
    return new Result(data, '请求成功').success(res)
  }).catch(err=> {
    next(boom.badImplementation(err))
  })
})
module.exports = router