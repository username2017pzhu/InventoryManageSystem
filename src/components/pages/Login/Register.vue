<template>
  <div class="register">
    <el-form :model="regForm" :rules="rules" ref="regForm">
      <el-form-item label="用户名" prop="userName" label-width="80px">
        <el-input placeholder="请输入用户名" v-model="regForm.userName" clearable></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" label-width="80px">
        <el-input placeholder="请输入密码" v-model="regForm.password" clearable type="password"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPassword" label-width="80px">
        <el-input placeholder="请再次输入密码" v-model="regForm.checkPassword" clearable type="password"></el-input>
      </el-form-item>
      <el-form-item label="身份" prop="role" label-width="80px">
        <el-select v-model="regForm.role" clearable placeholder="请选择">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label-width="80px">
        <el-button type="primary" @click="submitForm('regForm')">注册</el-button>
        <el-button @click="clearForm('regForm')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  export default {
    data() {
      let validateUser = (rule, value, callback) => {
        axios.post('api/admin/queryName', {
            admName: value
          })
          .then(res => {
            if (res.data.length != 0) {
              callback(new Error('用户名已存在'));
            } else {
              callback()
            }
          })
          .catch(err => console.log(err))
      }
      let validatePass = (rule, value, callback) => {
        // 6-16位, 数字, 字母, 字符至少包含两种, 同时不能包含中文和空格
        let reg = /(?!^[0-9]+$)(?!^[A-z]+$)(?!^[^A-z0-9]+$)^[^\s\u4e00-\u9fa5]{6,16}$/;
        if (!reg.test(value)) {
          callback(new Error('密码长度需6-16位，且包含字母和字符'));
        } else {
          callback();
        }
      };
      let validateCheckPass = (rule, value, callback) => {
        if (value !== this.regForm.password) {
          callback(new Error('两次密码输入不一致'));
        } else {
          callback();
        }
      }
      return {
        rules: { //验证规则
          userName: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 20,
              message: '长度在 6 到 20个字符',
              trigger: 'blur'
            },
            {
              validator: validateUser,
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              validator: validatePass,
              trigger: 'blur'
            }
          ],
          checkPassword: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 20,
              message: '长度在 6 到 20个字符',
              trigger: 'blur'
            },
            {
              validator: validateCheckPass,
              trigger: 'blur'
            }
          ],
          role: [{
            required: true,
            message: '请选择',
            trigger: 'blur'
          }]
        },
        regForm: {
          userName: '',
          password: '',
          checkPassword: '',
          role: ''
        },
        options: [{
          value: 'admin',
          label: 'admin'
        }, {
          value: 'editor',
          label: 'editor'
        }],
      }
    },
    methods: {
      submitForm(formName) {
        let admName = this.regForm.userName
        let admPassword = this.regForm.password
        let admAddTime = moment().format('YYYY-MM-DD HH:mm:ss')
        let admEditTime = admAddTime
        let role = this.regForm.role
        this.$refs[formName].validate((valid) => {
          if (valid) { //验证通过
            axios.post('api/admin/register', {
                admName,
                admPassword,
                admAddTime,
                admEditTime,
                role
              })
              .then(res => {
                this.$message.success('注册成功')
                this.regForm = {
                  userName: '',
                  password: '',
                  role: ''
                }
              })
              .catch(err => {
                console.log(err)
              })
          } else {
            this.$message.warning('请输入正确的用户名或密码')
          }
        })
      },
      clearForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    mounted: function () {
      let redirectUrl = decodeURIComponent(this.$route.path);
    },
    created() {
      let redirectUrl = decodeURIComponent(this.$route.query.redirect || '/');
      //跳转到指定的路由
      this.$router.push({
        path: redirectUrl
      });
    },
  }

</script>

<style>
  .register {
    width: 300px;
  }

</style>
