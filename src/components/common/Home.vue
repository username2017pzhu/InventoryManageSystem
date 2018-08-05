<template>
  <div class="wrapper">
    <div class="cc">
      <div class="c">
        <div class="sider">
          <sider-bar></sider-bar>
        </div>
        <div class="content">
          <Header></Header>
          <div class="view">
            <!-- <keep-alive> -->
            <router-view></router-view>
            <!-- </keep-alive> -->
          </div>
        </div>
      </div>
    </div>

     <el-dialog title="请输入密码" :visible.sync="checkVisible" :close-on-click-modal="false" :close-on-press-escape="false" :show-close="false">
      <el-form :model="checkForm" :rules="rules">
        <el-form-item label="密码" prop="password" label-width="80px">
          <el-input placeholder="请输入密码" v-model="checkForm.password" clearable type="password"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="checkPassword" label-width="80px">
          <el-input placeholder="请再次输入密码" v-model="checkForm.checkPassword" clearable type="password"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import Header from './Header'
  import SiderBar from './SiderBar'
  import checkToken from '@/token/checkToken'
  import axios from 'axios';
  export default {
    data(){
      const validatePass = (rule, value, callback) => {
        if (value !== this.checkForm.password) {
          callback(new Error('两次密码输入不一致'));
        } else {
          callback();
        }
      }
      return {
        checkForm: {
          password: '',
          checkPassword: ''
        },
        checkVisible: false,
        rules: { //验证规则
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
          ]
        },
      }
    },
    methods: {
      checkSubmit() {
        let token = this.$store.state.user.token
        let decoded = checkToken(token, 'cysto')
        let admName = decoded.admName
        let admPassword = this.checkForm.password
        axios.post('api/admin/login', {
            admName,
            admPassword
          })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.info('算你厉害')
              this.checkVisible = false
            } else {
              this.$message.info('不可以哦')
              return false
            }
          })
      },
      loginCheck() {
        const token = localStorage.getItem('token')
        const decoded = checkToken(token, 'cysto')
        if (token) {
          axios.post('api/admin/loginCheck', {
              admName: decoded.admName
            })
            .then(res => {
              if (res.data.code === 400) {
                this.$store.dispatch('userLogout');
                if (!this.$store.state.user.token) {
                  this.$router.push('/login')
                  this.$message.info('请登录')
                }
              }
             else if (res.data[0].token !== token) {
                this.$store.dispatch('userLogout');
                if (!this.$store.state.token) {
                  this.$router.push('/login')
                  this.$message.info('请登录')
                }
              }
              else{
                this.checkVisible = true
              }
            })

        }
      }
    },
    created() {
      // this.loginCheck()
    },
    components: {
      Header,
      SiderBar
    }
  }

</script>
<style scoped>
  .cc {
    width: 100%;
    height: 100%;
    position: absolute;
    left: 0;
    bottom: 0
  }

  .c {
    display: flex;
    height: 100%;
  }

  .sider {
    width: auto;
    height: 100%;
    flex: 0 0 65px;
  }

  .content {
    flex: 1;
    background-color: #f1f1f1
  }

  .view {
    padding-top: 10px;
    padding-left: 20px;
  }

</style>
