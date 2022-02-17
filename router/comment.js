const express = require('express')
//express-validator 验证http 请求体中的参数是否符合预期，如username必须是string

const boom = require('boom')

const Result = require('../utils/model/result')
const {pushComment, getCommentByBlog} = require('../server/comment')
const { decode } = require('../utils/index')
const router = express.Router();
const Comment = require('../model/Comment')


router.post('/pushComment',  (req, res, next) => {
  const result = decode(req)
  let from = '游客'
  if(result) {
    from = result['username']
  }
  const {blogId, feelId, content, to, commentId, messageType} = req.body
  let comment = new Comment(blogId, feelId, content, to, messageType)
  if(!to) {
    comment.commentId = Math.floor(Math.random()*1000)
  } else {
    comment.commentId = commentId
  }
    comment.from = from
    pushComment(comment).then(data => {
      return new Result('评论成功').success(res)
    }).catch(err => {
      next(boom.badImplementation(err))
    })
})
router.get('/getCommentByBlog', (req, res, next) => {
  const {id, type} = req.query
  if(!type) next(boom.badRequest('请求参数有误'))
  getCommentByBlog(id, type).then(data => {
    //将一维数组转成二维数组
    let newArr = []
    for(let i =0; i< data.length;i++) {
      if(!data[i].to){
        newArr.push({father:data[i]})
      }
    }
     for(let j =0;j< newArr.length; j++){
        let children = []
        for(let i =0;i< data.length;i++){
         
          if( newArr[j].father.commentId === data[i].commentId && data[i].to ) {
            children.push(data[i])
          }
        }
        newArr[j].children = children
     }
    
    return new Result(newArr, '查询成功').success(res)
  }).catch(err => {
    next(boom.badRequest(err))
  })
})
module.exports = router
