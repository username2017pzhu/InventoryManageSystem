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
    let birth = moment(row.empBirthday).format('YYYY-MM-DD');
    let entry = moment(row.empEntryDate).format('YYYY-MM-DD');
    let obj = {};
    return Object.assign({}, row, {
      empBirthday: birth ,
      empEntryDate: entry
    }, obj)
  })
}
module.exports = {
  queryAll(req, res) {
    let sql = $sql.employee_info.queryAll
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
    let sql = $sql.employee_info.add;
    let params = req.body;
    conn.query(sql,
      [
      params.empName,
      params.empAge,
      params.empSex,
      params.empBirthday,
      params.empIdCard,
      params.empTel,
      params.empQQ,
      params.empAddress,
      params.empEntryDate], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  del(req, res) {
    let sql = $sql.employee_info.del;
    let params = req.body;
    conn.query(sql, [params.empNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  multiDel(req, res) {
    let sql = $sql.employee_info.multiDel;
    let params = req.body;
    conn.query(sql, [params.empNo], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  },

  queryByName(req, res) {
    let sql = $sql.employee_info.queryByName;
    let params = req.body;
    conn.query(sql, [params.empNo,'%' + params.empName + '%'], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        result=formatDate(result)
        res.json(result)
      }
    })
  },

  update(req, res) {
    let sql = $sql.employee_info.update;
    let params = req.body;
    conn.query(sql,  
      [
      params.empName,
      params.empAge,
      params.empSex,
      params.empBirthday,
      params.empIdCard,
      params.empTel,
      params.empQQ,
      params.empAddress,
      params.empEntryDate,
      params.empNo,], function (err, result) {
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
    let sql=$sql.employee_info.pagination
    conn.query(sql,[params.page],(err,result)=>{
      if(err) throw err
      result=formatDate(result)
      res.json(result)
    })
  }
}
