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
    let addTime = moment(row.goodsAddTime).format('YYYY-MM-DD');
    let obj = {};
    return Object.assign({}, row, {
      goodsAddTime: addTime ,
    }, obj)
  })
}
module.exports = {
  queryAll(req, res) {
    let sql = $sql.goods_info.queryAll;
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
  queryUsedGoods(req, res) {
    let sql = $sql.goods_info.queryUsedGoods;
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
    let sql = $sql.goods_info.add;
    let params = req.body;
    conn.query(sql,
      [ 
        params.goodsName,
        params.goodsType,
        params.goodsUnit,
        params.goodsModel,
        params.goodsSpec,
        params.stockPrice,
        params.goodsPrice,
        params.supName,
        params.goodsAddTime
      ], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  del(req, res) {
    let sql = $sql.goods_info.del;
    let params = req.body;
    conn.query(sql, [params.goodsNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  multiDel(req, res) {
    let sql = $sql.goods_info.multiDel;
    let params = req.body;
    conn.query(sql, [params.goodsNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  queryByName(req, res) {
    let sql = $sql.goods_info.queryByName;
    let params = req.body;
    conn.query(sql, [params.goodsNo,'%' + params.goodsName + '%','%' + params.goodsType + '%'], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        result=formatDate(result)
        res.json(result)
      }
    })
  },
  queryById(req, res) {
    let sql = $sql.goods_info.queryById;
    let params = req.body;
    conn.query(sql, [params.goodsNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  update(req, res) {
    let sql = $sql.goods_info.update;
    let params = req.body;
    conn.query(sql,[
      params.goodsName,
      params.goodsType,
      params.goodsUnit,
      params.goodsModel,
      params.goodsSpec,
      params.stockPrice,
      params.goodsPrice,
      params.supName,
      params.goodsAddTime,
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
  stateChange(req, res){
    let sql = $sql.goods_info.stateChange;
    let params = req.body;
    conn.query(sql,[params.goodsState,params.goodsNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
  multiStateChange(req,res){
    let sql = $sql.goods_info.multiStateChange;
    let params = req.body;
    conn.query(sql, [params.goodsState,params.goodsNo], function (err, result) {
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
    let sql=$sql.goods_info.pagination
    conn.query(sql,[params.page],(err,result)=>{
      if(err) throw err
      result=formatDate(result)
      res.json(result)
    })
  }
}
