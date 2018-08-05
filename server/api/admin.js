const db = require('../db/db');
const express = require('express');
const moment = require('moment')
const router = express.Router();
const mysql = require('mysql');
const $sql = require('../sql/sqlMap');
const conn = mysql.createConnection(db);
const createToken = require('../token/createToken')
const checkToken = require('../token/checkToken')
const bcrypt = require('bcrypt')
conn.connect();

function formatDate(rows) {
  return rows.map(row => {
    let addTime = moment(row.admAddTime).format('YYYY-MM-DD HH:mm');
    let editTime = moment(row.admEditTime).format('YYYY-MM-DD HH:mm');
    let obj = {};
    return Object.assign({}, row, {
      admAddTime: addTime,
      admEditTime: editTime
    }, obj)
  })
}
module.exports = {
  login(req, res) {
    let sql = $sql.admin_info.login
    let params = req.body;
    let admPass = params.admPassword
    conn.query(sql, [params.admName], function (err, result) {
      if (err) console.log(err);
      if (!result.length) {
        res.json({
          code: 400,
          msg: '密码错误2'
        })
      } else {
        const hashPass = result[0].admPassword
        bcrypt.compare(admPass, hashPass, (err, sure) => {
          if (sure) {
            res.json({
              code: 200,
              msg: '登录成功',
              user: result
            })
          } else {
            res.json({
              code: 400,
              msg: '密码错误1'
            })
          }
        })
      }
    })
  },
  loginCheck(req,res){
    let sql = $sql.admin_info.loginCheck
    let params = req.body;
    conn.query(sql, [params.admName], function (err, result) {
      if (err) console.log(err);
      if (result) {
        if(!result.length){
          res.json({code:400,msg:'失败'})
        }
        else{
          res.json(result)   
        }
      }
    })
  },
  register(req, res) {
    let sql = $sql.admin_info.register
    let params = req.body;
    const token = createToken(params.admName, params.token)
    bcrypt.hash(params.admPassword, 10, (err, hash) => {
      if (err) console.log(err)
      params.admPassword = hash
      conn.query(sql, [
        params.admName,
        params.admPassword,
        params.admAddTime,
        params.admEditTime,
        token,
        params.role
      ], function (err, result) {
        if (err) console.log(err);
        if (result) res.json({
          code: 200,
          msg: '成功'
        })
      })
    })

  },
  updateToken(req, res) {
    let sql = $sql.admin_info.updateToken
    let params = req.body;
    conn.query(sql, [
      params.token,
      params.admName
    ], function (err, result) {
      if (err) console.log(err);
      if (result) {
        const token = req.header('cy-token')
        let decoded = checkToken(token, 'cysto')
        if (!token || decoded.exp <= new Date() / 1000) {
          res.json({
            code: 401,
            msg: 'token过期'
          })
        } else {
          res.json({
            code: 200,
            msg: '登录成功'
          })
        }
      }
    })
  },
  updateUserToken(req, res) {
    let sql = $sql.admin_info.updateToken
    let params = req.body;
    conn.query(sql, [
      params.token,
      params.admName
    ], function (err, result) {
      if (err) console.log(err);
      if (result) {
        res.json({
          code: 200,
          msg: '登录成功'
        })
      } else {
        res.json({
          code: 401,
          msg: 'token过期'
        })
      }
    })
  },
  updateRole(req, res) {
    let sql = $sql.admin_info.updateRole
    let params = req.body;
    conn.query(sql, [
      params.role,
      params.admName
    ], function (err, result) {
      if (err) console.log(err);
      if (result) {
        if (result) {
          res.json({
            code: 200,
            msg: '成功'
          })
        } else {
          res.json({
            code: 400,
            msg: '失败'
          })
        }
      }
    })
  },
  update(req, res) {
    let sql = $sql.admin_info.update
    let params = req.body;
    bcrypt.hash(params.admPassword, 10, (err, hash) => {
      if (err) console.log(err)
      params.admPassword = hash
      conn.query(sql, [
        params.admName,
        params.admPassword,
        params.admEditTime,
        params.token,
        params.oldName
      ], function (err, result) {
        if (err) console.log(err);
        if (result) {
          res.json({
            code: 200,
            msg: '成功'
          })
        } else {
          res.json({
            code: 400,
            msg: '失败'
          })
        }
      })
    })

  },
  queryAll(req, res) {
    let sql = $sql.admin_info.queryAll
    conn.query(sql, function (err, result) {
      if (err) console.log(err);
      if (result) {
        result = formatDate(result)
        res.json(result)
      }
    })
  },
  queryName(req, res) {
    let sql = $sql.admin_info.queryName
    let params = req.body;
    conn.query(sql, [params.admName], function (err, result) {
      if (err) {
        console.log(err);
      }
      if (result) {
        res.json(result)
      }
    })
  }
}
