class Blog {
  constructor (title, category, content) {
    this.title = title
    this.categoryId = category
    this.content = content
    this.createDate = new Date().getTime()
    
  }
  toBlog() {
    return {
      title: this.title,
      categoryId: Number(this.categoryId),
      content: this.content,
      createDate: new Date().getTime(),
      createUser: this.createUser
    }
  }
}
module.exports = Blog