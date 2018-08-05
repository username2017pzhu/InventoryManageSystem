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
    let addTime = moment(row.stockAddTime).format('YYYY-MM-DD  HH:mm');
    let obj = {};
    return Object.assign({}, row, {
      stockAddTime: addTime 
    }, obj)
  })
}
module.exports = {
  queryAll(req, res) {
    let sql = $sql.stock_summary.queryAll;
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
    let sql = $sql.stock_summary.add;
    let params = req.body;
    conn.query(sql,
      [params.goodsGroup,params.stockCountSum,params.stockMoneySum,params.stockAddTime], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  update(req, res) {
    let sql = $sql.stock_summary.update;
    let params = req.body;
    conn.query(sql,
      [params.stockCountSum,params.stockMoneySum,params.stockNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  queryByName(req, res) {
    let sql = $sql.stock_summary.queryByName;
    let params = req.body;
    conn.query(sql, [params.stockNo,'%'+params.stockAddTime+'%'], function (err, result) {
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
    let sql = $sql.stock_summary.stateChange;
    let params = req.body;
    conn.query(sql,[params.stockState,params.stockNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  multiStateChange(req,res){
    let sql = $sql.stock_summary.multiStateChange;
    let params = req.body;
    conn.query(sql, [params.stockState,params.stockNo], function (err, result) {
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
    let sql=$sql.stock_summary.pagination
    conn.query(sql,[params.page],(err,result)=>{
      if(err) throw err
      result=formatDate(result)
      res.json(result)
    })
  }
}
