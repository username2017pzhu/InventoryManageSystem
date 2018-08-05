const db = require('../db/db');
const express = require('express');
const moment =require('moment')
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../sql/sqlMap');
const conn = mysql.createConnection(db);
conn.connect();
function formatDate(rows) {
  return rows.map(row => {
    let addTime = moment(row.returnAddTime).format('YYYY-MM-DD HH:mm');
    let obj = {};
    return Object.assign({}, row, {
      returnAddTime: addTime ,
    }, obj)
  })
}
module.exports = {
  queryAll(req, res) {
    let sql = $sql.sales_return.queryAll;
    let params = req.body;
    conn.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        result=formatDate(result)
        res.json(result)
      }
    })
  },
  add(req, res) {
    let sql = $sql.sales_return.add;
    let params = req.body;
    conn.query(sql,
      [ 
        params.salesNo,
        params.goodsNo,
        params.supName,
        params.goodsPrice,
        params.returnGoodsCount,
        params.returnGoodsMoney,
        params.returnGoodsReason,
        params.returnAddTime,
      ], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
stateChange(req,res){
  let sql = $sql.sales_return.stateChange;
  let params = req.body;
  conn.query(sql,
    [ 
    params.returnGoodsNo
    ], function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.json(result)
    }
  })
},
  queryByName(req, res) {
    let sql = $sql.sales_return.queryByName;
    let params = req.body;
    conn.query(sql, [params.returnGoodsNo,'%' + params.returnAddTime + '%'], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        result=formatDate(result)
        res.json(result)
      }
    })
  },

  pagination(req,res){
    let params=req.body
    let sql=$sql.sales_return.pagination
    conn.query(sql,[params.page],(err,result)=>{
      if(err) throw err
      result=formatDate(result)
      res.json(result)
    })
  }
}
