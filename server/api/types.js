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
    let addTime = moment(row.typeAddTime).format('YYYY-MM-DD HH:mm');
    let obj = {};
    return Object.assign({}, row, {
      typeAddTime: addTime ,
    }, obj)
  })
}
module.exports = {
  queryAll(req, res) {
    let sql = $sql.types.queryAll;
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
  queryUsedTypes(req, res) {
    let sql = $sql.types.queryUsedTypes;
    let params = req.body;
    conn.query(sql, function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  add(req, res) {
    let sql = $sql.types.add;
    let params = req.body;
    conn.query(sql,[params.goodsType,params.typeAddTime], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  del(req, res) {
    let sql = $sql.types.del;
    let params = req.body;
    conn.query(sql, [params.goodsTypeNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  multiDel(req, res) {
    let sql = $sql.types.multiDel;
    let params = req.body;
    conn.query(sql, [params.goodsTypeNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },


  update(req, res) {
    let sql = $sql.types.update;
    let params = req.body;
    conn.query(sql,[params.goodsType,params.goodsTypeNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  stateChange(req, res){
    let sql = $sql.types.stateChange;
    let params = req.body;
    conn.query(sql,[params.goodsTypeState,params.goodsTypeNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  multiStateChange(req,res){
    let sql = $sql.types.multiStateChange;
    let params = req.body;
    conn.query(sql, [params.goodsTypeState,params.goodsTypeNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  }
}
