const db = require('../db/db');
const express = require('express');
const moment = require('moment')
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../sql/sqlMap');
const conn = mysql.createConnection(db);
conn.connect();
module.exports = {
  add(req, res) {
    let sql = $sql.inventory.add;
    let params = req.body;
    conn.query(sql, [params.values], (err, result) => {
      if (err) throw err
    })
  },
  queryAll(req, res) {
    let sql = $sql.inventory.queryAll;
    let params = req.body;
    conn.query(sql, (err, result) => {
      if (err) console.log(err);
      if (result) res.json(result)
    })
  },
  update(req,res) {
    let sql = $sql.inventory.update;
    let params = req.body;
    conn.query(sql, [params.goodsInv,params.goodsNo], (err, result) => {
      if (err) throw err
    })
  },
  queryByName(req, res) {
    let sql = $sql.inventory.queryByName;
    let params = req.body;
    conn.query(sql, [params.goodsNo, '%' + params.goodsName + '%'], (err, result) => {
      if (err) throw err
      if (result) res.json(result)
    })
  },
  queryById(req, res) {
    let sql = $sql.inventory.queryById;
    let params = req.body;
    conn.query(sql, [params.goodsNo], (err, result) => {
      if (err) throw err
      if (result) res.json(result)
    })
  },
  pagination(req, res) {
    let params = req.body
    let sql = $sql.inventory.pagination
    conn.query(sql, [params.page], (err, result) => {
      if (err) throw err
      if (result) res.json(result)
    })
  }
}
