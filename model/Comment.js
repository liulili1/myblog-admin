
class Comment {
  constructor (blogId, feelId, content, to, messageType) {
    this.blogId = blogId
    this.feelId = feelId
    this.content = content
    this.createDt = new Date().getTime()
    this.to = to
    this.messageType = messageType
  }
  toComment() {
    return {
      blogId: this.blogId,
      feelId: this.feelId,
      content: this.content,
      createDt: this.createDt,
      from: this.from,
      to: this.to,
      commentId: this.commentId,
      messageType: this.messageType
    }
  }
}
module.exports = Comment