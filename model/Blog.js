class Blog {
  constructor (title, category, content) {
    this.title = title
    this.categoryId = category
    this.content = content
    this.createDate = new Date().getTime()
    
  }
  toBlog() {
    return {
      id: this.id,
      title: this.title,
      categoryId: Number(this.categoryId),
      content: this.content,
      createDate: this.id?'':new Date().getTime(),
      createUser: this.id?'':this.createUser,
      updateDate: this.id?new Date().getTime():''
    }
  }
}
module.exports = Blog