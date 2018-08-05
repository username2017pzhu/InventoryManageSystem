const db = require('../db/db');
const express = require('express');
const moment =require('moment')
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../sql/sqlMap');
const conn = mysql.createConnection(db);
conn.connect();
module.exports = {
  queryAll(req,res){
    let sql = $sql.goods_sales_summary.queryAll;
    conn.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  add(req,res){
    let sql = $sql.goods_sales_summary.add;
    let params=req.body
    conn.query(sql,[
 params.goodsNo,
 params.goodsName,
 params.salesCount,
 params.salesMoney,
 params.goodsPrice,
 params.stockPrice,
 params.salesProfit
    ]
     , function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  update(req,res){
    let sql = $sql.goods_sales_summary.update;
    let params=req.body
    conn.query(sql,[
 params.salesCount,
 params.salesMoney,
 params.salesProfit,
 params.goodsNo
    ]
     , function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  queryById(req,res){
    let sql = $sql.goods_sales_summary.queryById;
    let params=req.body
    conn.query(sql,[params.goodsNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  }

}
