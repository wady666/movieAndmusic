const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");

// 添加博客接口 { title, categoryId, content }
router.post("/_token/add", async (req, res) => {
  let { title, categoryId, content, desc, cover } = req.body;
  let id = genid.NextId();
  let create_time = new Date().getTime();

  const insert_sql =
    "INSERT INTO `blog`(`id`,`title`,`category_id`,`content`,`create_time`,`desc`,`cover`) VALUES (?,?,?,?,?,?,?)";
  let params = [id, title, categoryId, content, create_time, desc, cover];
  let { err, rows } = await db.async.run(insert_sql, params);

  if (err == null) {
    res.send({
      code: 200,
      msg: "添加成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "添加失败",
    });
  }
});

// 修改博客接口  { id, title, categoryId, content }
router.put("/_token/update", async (req, res) => {
  let { id, title, categoryId, content, desc, cover } = req.body;

  const update_sql =
    "UPDATE `blog` SET `title` = ?,`content` = ? , category_id = ? , `desc` = ?, `cover`=? WHERE `id` = ?";
  let params = [title, content, categoryId, id, desc, cover];
  let { err, rows } = await db.async.run(update_sql, params);

  if (err == null) {
    res.send({
      code: 200,
      msg: "修改成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "修改失败",
    });
  }
});

// 删除博客接口  id
router.delete("/_token/delete", async (req, res) => {
  let id = req.query.id;

  const delete_sql = "DELETE FROM `blog` WHERE `id` = ?";
  let { err, rows } = await db.async.run(delete_sql, [id]);

  if (err == null) {
    res.send({
      code: 200,
      msg: "删除成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "删除失败",
    });
  }
});

// 查询接口 {keyword,categoryId,page,pageSize}
router.get("/search", async (req, res) => {
  /**
   * keyword 关键字
   * categoryId 分类编号
   *
   * 分页：
   * page 页码
   * pageSize 分页大小
   *
   */
  let { keyword, categoryId, page, pageSize } = req.query;

  page = page == null ? 1 : page;
  pageSize = pageSize == null ? 10 : pageSize;
  categoryId = categoryId == null ? 0 : categoryId;
  keyword = keyword == null ? "" : keyword;

  let params = [];
  let whereSqls = [];
  if (categoryId != 0) {
    whereSqls.push(" `category_id` = ? ");
    params.push(categoryId);
  }

  if (keyword != "") {
    whereSqls.push(" (`title` LIKE ? OR `content` LIKE ?) ");
    params.push("%" + keyword + "%");
    params.push("%" + keyword + "%");
  }

  let whereSqlStr = "";
  if (whereSqls.length > 0) {
    whereSqlStr = " WHERE " + whereSqls.join(" AND ");
  }

  //查分页数据
  let searchSql =
    " SELECT `id`,`category_id`,`create_time`,`title`,substr(`content`,0,50) AS `content`,desc,cover FROM `blog` " +
    whereSqlStr +
    " ORDER BY `create_time` DESC LIMIT ?,? ";
  // 1 10  2,10    3,5
  // 0,10  10,10   10,5
  let searchSqlParams = params.concat([(page - 1) * pageSize, pageSize]);

  //查询数据总数
  let searchCountSql = " SELECT count(*) AS `count` FROM `blog` " + whereSqlStr;
  let searchCountParams = params;

  //分页数据
  let searchResult = await db.async.all(searchSql, searchSqlParams);
  let countResult = await db.async.all(searchCountSql, searchCountParams);

  if (searchResult.err == null && countResult.err == null) {
    res.send({
      code: 200,
      msg: "查询成功",
      data: {
        keyword,
        categoryId,
        page,
        pageSize,
        rows: searchResult.rows,
        count: countResult.rows[0].count,
      },
    });
  } else {
    res.send({
      code: 500,
      msg: "查询失败",
    });
  }
});

// 查询单篇博客接口  id
router.get("/detail", async (req, res) => {
  let { id } = req.query;
  let detail_sql = "SELECT * FROM `blog` WHERE `id` = ?";
  let { err, rows } = await db.async.all(detail_sql, [id]);
  if (err == null) {
    res.send({
      code: 200,
      msg: "查找成功",
      rows,
    });
  } else {
    res.send({
      code: 500,
      msg: "查找失败",
    });
  }
});
module.exports = router;
