<template>
  <div class="change-container">
    <div class="change-info">
      <el-form :model="changeForm" :rules="rules" ref="changeForm">
        <el-form-item>
          <span>当前登录[{{admin}}],</span>
          <span>当前身份[{{admRole}}]</span>
        </el-form-item>
        <el-form-item label="用户名" prop="userName" label-width="80px">
          <el-input placeholder="请输入用户名" v-model="changeForm.userName" clearable></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password" label-width="80px">
          <el-input placeholder="请输入密码" v-model="changeForm.password" clearable type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword" label-width="80px">
          <el-input placeholder="请再次输入密码" v-model="changeForm.checkPassword" clearable type="password"></el-input>
        </el-form-item>
        <el-form-item label-width="80px">
          <el-button type="primary" @click="submitForm('changeForm')">提交</el-button>
          <el-button @click="clearForm('changeForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>

</template>

<script>
  import axios from 'axios'
  import moment from 'moment'
  import createToken from '@/token/createToken'
  import checkToken from '@/token/checkToken'
  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (value !== this.changeForm.password) {
          callback(new Error('两次密码输入不一致'));
        } else {
          callback();
        }
      }
      return {
        admin: '',
        admRole: '',
        rules: { //验证规则
          userName: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 20,
              message: '长度在 3 到 20个字符',
              trigger: 'blur'
            }
          ],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }],
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
              validator: validatePass,
              trigger: 'blur'
            }
          ],
          role: [{
            required: true,
            message: '请选择',
            trigger: 'blur'
          }]
        },
        changeForm: {
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
        let oldName = checkToken(localStorage.getItem('token'), 'cysto').admName
        let role= checkToken(localStorage.getItem('token'), 'cysto').role
        let admName = this.changeForm.userName
        let admPassword = this.changeForm.password
        let admEditTime = moment().format('YYYY-MM-DD HH:mm')
        this.$refs[formName].validate((valid) => {
          if (valid) { //验证通过
            let token = createToken(admName, role)
            axios.post('api/admin/update', {
                admName,
                admPassword,
                admEditTime,
                token,
                oldName
              })
              .then(res => {
                if (res.data.code === 200) {
                  this.$message.success('修改成功')
                  this.changeForm = {
                    userName: '',
                    password: '',
                  }
                  this.$store.dispatch('userLogout');
                  if (!this.$store.state.token) {
                    this.$router.push('/login')
                    this.$message.success('已退出')
                  }
                } else {
                  this.$message.info('修改失败')
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
    created() {
      let token = localStorage.getItem('token')
      let decoded = checkToken(token, 'cysto')
      this.admin = decoded.admName
      this.admRole = decoded.role
    }
  }

</script>

<style>
  .change-container {
    height: 80vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .change-info {
    width: 300px;
    height: auto;
  }

</style>
