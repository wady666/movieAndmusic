const express = require('express')
const multer = require('multer')
const {db} = require("./db/DbUtils")
const app = express()
const path = require('path')
const port = 8080

app.use(function (req,res,next){
  // 设置允许跨域的域名，*代表任意域名
  res.header("Access-Control-Allow-Origin","*")
  // 设置允许的header类型
  res.header("Access-Control-Allow-Headers","*")
  // 设置允许的请求方式
  res.header("Access-Control-Allow-Methods","DELETE,PUT,POST,GET,OPTIONS")
  if(req.method == "OPTIONS") res.sendStatus(200)
  else next()
})

app.use(express.json())
const update = multer({
  dest:'./public/upload/temp'
})
app.use(update.any())
app.use(express.static(path.join(__dirname,"public")))

// 校验token中间件
const ADMIN_TOKEN_PATH = "/_token"
app.all("*",async (req,res,next)=>{
  if(req.path.indexOf(ADMIN_TOKEN_PATH)>-1){

    let {token} = req.headers
    let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?"
    let adminResult = await db.async.all(admin_token_sql,[token])
    if(adminResult.err != null ||adminResult.rows.length == 0){
      res.send({
        code:403,
        msg:"请先登录"
      })
      return
    }else{
      next()
    }
  }else{
    next()
  }
})

// 测试接口
app.use("/test",require("./routers/TestRouters"))
// 用户接口
app.use("/admin",require("./routers/AdminRouter"))
// 分类接口
app.use("/category",require("./routers/CategoryRouter"))
// 博客接口
app.use("/blog",require("./routers/BlogRouter"))
// 上传接口
app.use("/upload",require("./routers/UploadRouter"))

app.get("/",(req,res)=>{
  res.send("Hello")
})
app.listen(port,()=>{
  console.log(`执行成功：http://localhost:${port}/`)
})