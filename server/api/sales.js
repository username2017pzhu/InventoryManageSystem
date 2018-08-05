const db = require('../db/db');
const express = require('express');
const moment =require('moment')
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../sql/sqlMap');
const conn = mysql.createConnection(db);
conn.connect();
module.exports = {
  queryFetch(req, res) {
    let sql = $sql.sales.queryFetch;
    let params = req.body;
    conn.query(sql,[params.salesNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  add(req, res) {
    let sql = $sql.sales.add;
    let params = req.body;
    conn.query(sql,
      [
        params.salesNo,
        params.goodsNo,
        params.goodsName,
        params.goodsPrice,
        params.salesCount,
        params.deserveMoney,
        params.salesProfit
      ], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  del(req,res){
    let sql = $sql.sales.del;
    let params = req.body;
    conn.query(sql,
      [params.salesNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })

  },
  multiDel(req,res){
    let sql = $sql.sales.multiDel;
    let params = req.body;
    conn.query(sql,
      [params.salesNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json({code:200,msg:'成功'})
      }
    })

  }
 

}
