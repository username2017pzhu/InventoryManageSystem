<template>
  <div class="bg">
    <div class="flex-container">
      <div class="login">
        <h1>超市进销存管理系统</h1>
        <el-tabs class="tabs">
          <el-tab-pane label="登录">
            <el-form :model="loginForm" :rules="rules" ref="loginForm">
              <el-form-item label="用户名" prop="userName" label-width="80px">
                <el-input placeholder="请输入用户名" v-model="loginForm.userName" clearable></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password" label-width="80px">
                <el-input placeholder="请输入密码" v-model="loginForm.password" clearable type="password"></el-input>
              </el-form-item>
              <el-form-item label-width="80px">
                <el-button type="primary" @click="submitForm('loginForm')">登录</el-button>
                <el-button @click="clearForm('loginForm')">重置</el-button>
              </el-form-item>
              <el-form-item label-width="30px">
        <span>管理员账号：admin1，密码：admin1</span>

              </el-form-item>
              <el-form-item label-width="30px">
        <span>用户账号：editor1，密码：editor1</span>

              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="注册">
            <register></register>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

  </div>
</template>

<script>
  import axios from 'axios'
  import instance from '@/axios'
  import Register from './Register.vue'
  import createToken from '@/token/createToken'
  import checkToken from '@/token/checkToken'
  export default {
    data() {
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
          ],
          password: [{
            required: true,
            message: '请输入密码',
            trigger: 'blur'
          }, {
              min: 6,
              max: 20,
              message: '长度在 6 到 20个字符',
              trigger: 'blur'
            }]
        },
        loginForm: {
          userName: '',
          password: ''
        }
      }
    },
    methods: {
      updateToken(token, admName) {
        instance.post('api/admin/updateToken', {
            token,
            admName
          })
          .then(res=>{
            if(res.data.code===200){
              this.$router.push('/home');
            }
            else{
              this.$store.dispatch('userLogout');
              this.$router.push('/login')
              this.$message.info('无效登录')
            }
          })
          .catch(err => console.log(err))
      },
      submitForm(formName) {
        let admName = this.loginForm.userName
        let admPassword = this.loginForm.password
        this.$refs[formName].validate((valid) => {
          if (valid) { //验证通过
            axios.post('api/admin/login', {
                admName,
                admPassword
              })
              .then(res => {
                if (res.data.code=== 400) {
                  this.$message.info('用户名不存在或密码错误')
                }
                if (res.data.code === 200) {
                  this.$store.dispatch('userLogin', res.data.user[0].token);
                  this.$message.success('登录成功')
                  const role = res.data.user[0].role
                  const newToken = createToken(admName, role)
                  this.updateToken(newToken, admName)
                }
              })
              .catch(err => {
                console.log(err)
              })
          }
        })
      },
      clearForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
    components: {
      Register
    }
  }

</script>

<style>
  .bg {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background-color: #0F2540;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .flex-container {
    width: 400px;
    height: 65%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: white;
    margin: 0 auto;
    border-radius: 5px;

  }

  .login {
    width: 300px;
    height: 380px;
  }

</style>
