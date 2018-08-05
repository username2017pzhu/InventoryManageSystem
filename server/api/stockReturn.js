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
    let addTime = moment(row.returnAddTime).format('YYYY-MM-DD');
    let obj = {};
    return Object.assign({}, row, {
      returnAddTime: addTime ,
    }, obj)
  })
}
module.exports = {
  queryAll(req, res) {
    let sql = $sql.stock_return.queryAll;
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
    let sql = $sql.stock_return.add;
    let params = req.body;
    conn.query(sql,
      [ 
        params.goodsNo,
        params.supName,
        params.goodsPrice,
        params.returnStockCount,
        params.returnStockMoney,
        params.returnStockReason,
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
del(req,res){
  let sql = $sql.stock_return.del;
    let params = req.body;
    conn.query(sql,[params.returnStockNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
},
  queryByName(req, res) {
    let sql = $sql.stock_return.queryByName;
    let params = req.body;
    conn.query(sql, [params.returnStockNo,'%' + params.returnAddTime + '%'], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        result=formatDate(result)
        res.json(result)
      }
    })
  },

  stateChange(req, res){
    let sql = $sql.stock_return.stateChange;
    let params = req.body;
    conn.query(sql,[params.returnStockState,params.returnStockNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  multiStateChange(req,res){
    let sql = $sql.stock_return.multiStateChange;
    let params = req.body;
    conn.query(sql, [params.returnStockState,params.returnStockNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  pagination(req,res){
    let params=req.body
    let sql=$sql.stock_return.pagination
    conn.query(sql,[params.page],(err,result)=>{
      if(err) throw err
      result=formatDate(result)
      res.json(result)
    })
  }
}
