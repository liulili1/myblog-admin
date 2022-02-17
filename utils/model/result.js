const {SUCCESS_CODE, ERROR_CODE, CODE_TOKEN_EXPIRED} = require('../constant')
class Result {
  constructor(data, msg='操作成功', option) {
    if(arguments.length === 0) {
      this.msg = '操作成功'
    }else if(arguments.length === 1) {
      this.msg = data
    }else {
      this.data = data
      this.msg = msg
      if(option) {
        this.option = option
      }
    }
  }
  createData() {
    if(!this.code) {
      this.code = SUCCESS_CODE
    }
    let base = {
      code: this.code,
      msg: this.msg
    }
    if(this.data) {
      base.data = this.data
    }
    if(this.option) {
      base = {...base,...this.option}
    }
    return base
  }
  fail(res) {
    this.code = ERROR_CODE
    res.json(this.createData())
  }
  success(res) {
    this.code = SUCCESS_CODE
    res.json(this.createData())

  }
  expired(res) {
    this.code = CODE_TOKEN_EXPIRED,
    res.json(this.createData())
  }
}
module.exports = Result