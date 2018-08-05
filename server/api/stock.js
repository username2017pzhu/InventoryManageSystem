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

  queryAll(req,res) {
    let sql = $sql.stock.queryAll;
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
  queryByName(req, res) {
    let sql = $sql.stock.queryByName;
    let params = req.body;
    conn.query(sql, [params.stockNo,'%' + params.stockAddTime + '%'], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        result=formatDate(result)
        res.json(result)
      }
    })
  },
  queryFetch(req, res) {
    let sql = $sql.stock.queryFetch;
    let params = req.body;
    conn.query(sql,[params.stockNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  add(req, res) {
    let sql = $sql.stock.add;
    let params = req.body;
    conn.query(sql,
      [
        params.stockNo,
        params.goodsNo,
        params.goodsName,
        params.supName,
        params.stockPrice,
        params.goodsPrice,
        params.stockCount,
        params.stockMoney,
      ], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  update(req, res) {
    let sql = $sql.stock.update;
    let params = req.body;
    conn.query(sql,
      [
        params.stockCount,
        params.stockMoney,
        params.goodsNo
      ], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

}
