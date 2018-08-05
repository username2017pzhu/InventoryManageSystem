const db = require('../db/db');
const express = require('express');
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../sql/sqlMap');
const conn = mysql.createConnection(db);
conn.connect();
module.exports = {
  queryAll(req, res) {
    let sql = $sql.supplier_info.queryAll;
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
  queryUsedSup(req, res) {
    let sql = $sql.supplier_info.queryUsedSup;
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
    let sql = $sql.supplier_info.add;
    let params = req.body;
    conn.query(sql,
      [params.supName,params.supLawyer,params.supTel,params.supAddress], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  del(req, res) {
    let sql = $sql.supplier_info.del;
    let params = req.body;
    conn.query(sql, [params.supNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  multiDel(req, res) {
    let sql = $sql.supplier_info.multiDel;
    let params = req.body;
    conn.query(sql, [params.supNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  queryByName(req, res) {
    let sql = $sql.supplier_info.queryByName;
    let params = req.body;
    conn.query(sql, [params.supNo,'%' + params.supName + '%'], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  update(req, res) {
    let sql = $sql.supplier_info.update;
    let params = req.body;
    conn.query(sql,[params.supName,params.supLawyer,params.supTel,params.supAddress,params.supNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },
stateChange(req, res){
  let sql = $sql.supplier_info.stateChange;
  let params = req.body;
  conn.query(sql,[params.supState,params.supNo], function (err, result) {
    if (err) {
      console.log(err);
    }
    if (result) {
      res.json(result)
    }
  })
},
multiStateChange(req,res){
  let sql = $sql.supplier_info.multiStateChange;
  let params = req.body;
  conn.query(sql, [params.supState,params.supNo], function (err, result) {
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
    let sql=$sql.supplier_info.pagination
    conn.query(sql,[params.page],(err,result)=>{
      if(err) throw err
      res.json(result)
    })
  }
}
