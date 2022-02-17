const express = require('express')
const router = require('./router/index.js')
const cors = require('cors')
var bodyParser = require('body-parser')
const app = express()
const port = 3000

app.use(express.static('public'))
// 设置服务器静态文件夹,里面的文件都是呈现给人们看的网页
app.use(bodyParser.urlencoded({ extended: true}))
app.use(bodyParser.json())
// const router = express.Router();

app.use(cors())
app.use('/', router)

app.listen(port, () => {
  console.log(`http://localhost:3000已启动`);
})
