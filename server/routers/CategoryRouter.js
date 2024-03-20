const express = require("express")
const router = express.Router()
const {db,genid} = require("../db/DbUtils")

// 添加类别接口 name
router.post("/_token/add",async (req,res)=>{
  let {name} = req.body
  const insert_sql = "INSERT INTO `category` (`id`,`name`) VALUES (?,?)"
  let {err,rows} = await db.async.run(insert_sql,[genid.NextId(),name])

  if(err == null){
    res.send({
      code:200,
      msg:"添加成功",
    })
  }else{
    res.send({
      code:500,
      msg:"添加失败"
    })

  }
})
// 修改类别接口 id name
router.put("/_token/update",async (req,res)=>{

  let {id,name} = req.body
  const update_sql = "UPDATE `category` SET `name` = ? WHERE `id` = ? "
  let {err,rows} = await db.async.run(update_sql,[name,id])

  if(err == null){
    res.send({
      code:200,
      msg:"修改成功",
    })
  }else{
    res.send({
      code:500,
      msg:"修改失败"
    })
  }
})
// 删除类别接口 id
router.delete("/_token/delete",async (req,res)=>{
  let id = req.query.id
  const delete_sql = "DELETE FROM `category` WHERE `id` = ?"
  let {err,rows} = await db.async.run(delete_sql,[ id])
  if(err == null){
    res.send({
      code:200,
      msg:"删除成功",
    })
  }else{
    res.send({
      code:500,
      msg:"删除失败"
    })
  }
})
// 获取类别列表接口 无
router.get("/list",async (req,res)=>{
  const search_sql = "SELECT * FROM `category`"
  let {err,rows} = await db.async.all(search_sql,[])
  if(err == null){
    res.send({
      code:200,
      msg:"查找成功",
      rows
    })
  }else{
    res.send({
      code:500,
      msg:"查找失败"
    })
  }
})
module.exports = router