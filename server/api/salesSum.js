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
    let addTime = moment(row.salesAddTime).format('YYYY-MM-DD  HH:mm');
    let obj = {};
    return Object.assign({}, row, {
      salesAddTime: addTime 
    }, obj)
  })
}
module.exports = {
  queryAll(req, res) {
    let sql = $sql.sales_summary.queryAll;
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
  queryCompleted(req,res){
    let sql = $sql.sales_summary.queryCompleted;
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
  stateChange(req,res){
    let sql = $sql.sales_summary.stateChange;
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
  add(req, res) {
    let sql = $sql.sales_summary.add;
    let params = req.body;
    conn.query(sql,
      [params.goodsGroup,params.reciveMoney,params.changeMoney,params.salesCountSum,params.salesMoneySum,params.salesProfitSum,params.salesAddTime,params.editor], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  queryByName(req, res) {
    let sql = $sql.sales_summary.queryByName;
    let params = req.body;
    conn.query(sql, [params.salesNo,'%'+params.salesAddTime+'%'], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        result=formatDate(result)
        res.json(result)
      }
    })
  },
update(req,res){
  let sql = $sql.sales_summary.update;
    let params = req.body;
    conn.query(sql,[
      params.salesMoneySum,
      params.salesProfitSum,
      params.salesNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
},
  stateChange(req, res){
    let sql = $sql.sales_summary.stateChange;
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
  multiStateChange(req,res){
    let sql = $sql.sales_summary.multiStateChange;
    let params = req.body;
    conn.query(sql, [params.salesNo], function (err, result) {
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
    let sql=$sql.sales_summary.pagination
    conn.query(sql,[params.page],(err,result)=>{
      if(err) throw err
      result=formatDate(result)
      res.json(result)
    })
  },
  today(req,res){
    let sql = $sql.sales_summary.today;
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
  yesterday(req,res){
    let sql = $sql.sales_summary.yesterday;
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
  lastWeek(req,res){
    let sql = $sql.sales_summary.lastWeek;
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
  lastMonth(req,res){
    let sql = $sql.sales_summary.lastMonth;
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
  profitAn(req, res) {
    let sql = $sql.sales_summary.profitAn;
    conn.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  empSalesAn(req,res){
    let sql = $sql.sales_summary.empSalesAn;
    conn.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  }
}
