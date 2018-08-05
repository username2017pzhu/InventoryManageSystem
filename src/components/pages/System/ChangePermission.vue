<template>
  <div>
    <el-table :data="editors">
      <el-table-column prop="admName" label="用户名" width="150px"></el-table-column>
      <el-table-column prop="admAddTime" label="添加" width="150px"></el-table-column>
      <el-table-column prop="admEditTime" label="修改时间" width="150px"></el-table-column>
      <el-table-column prop="role" label="身份" width="150px"></el-table-column>
      <el-table-column>
        <template slot-scope="scope">
          <el-button type="primary" @click="changeRole(scope)">切换权限</el-button>
        </template>
      </el-table-column>
    </el-table>

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
        <el-button @click="handleReturn">退出</el-button>
        <el-button type="primary" @click="checkSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>


</template>

<script>
  import axios from 'axios'
  import createToken from '@/token/createToken'
  import checkToken from '@/token/checkToken'
  export default {
    data() {
      let validatePass = (rule, value, callback) => {
        if (value !== this.checkForm.password) {
          callback(new Error('两次密码输入不一致'));
        } else {
          callback();
        }
      }
      return {
        editors: [],
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
      queryUsers() {
        axios.get('api/admin/queryAll')
          .then(res => {
            this.editors = res.data
          })
      },
      updateToken(token, admName) {
        axios.post('api/admin/updateUserToken', {
            token,
            admName
          })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('修改成功')
            } else {
              this.$message.info('修改失败')
            }
          })
          .catch(err => console.log(err))
      },
      changeRole(row) {
        let role = row.row.role
        let newRole = role === 'admin' ? 'editor' : 'admin'
        axios.post('api/admin/updateRole', {
            role: newRole,
            admName: row.row.admName
          })
          .then(res => {
            if (res.data.code === 200) {
              let token = localStorage.getItem('token')
              let decoded = checkToken(token, 'cysto')
              let admName = decoded.admName
              if (admName === row.row.admName) {
                 const newToken = createToken(row.row.admName, newRole)
                this.updateToken(newToken, row.row.admName)
                this.$store.dispatch('userLogout');
                if (!this.$store.state.token) {
                  this.$router.push('/login')
                  this.$message.success('已退出')
                }
              } else {
                const newToken = createToken(row.row.admName, newRole)
                this.updateToken(newToken, row.row.admName)
                this.queryUsers()
              }

            } else {
              this.$message.info('修改失败')
            }
          })
          .catch(err => console.log(err))
      },
      validatePass() {
        this.checkVisible = true
      },
      checkSubmit() {
        let token = localStorage.getItem('token')
        let decoded = checkToken(token, 'cysto')
        let admName = decoded.admName
        let admPassword = this.checkForm.password
        axios.post('api/admin/login', {
            admName,
            admPassword
          })
          .then(res => {
            if (res.data.code === 200) {
              this.$message.success('密码正确')
              this.queryUsers()
              this.checkVisible = false
            } else {
              this.$message.info('密码错误')
              return false
            }
          })
      },
      handleReturn() {
        this.$router.push('/goods')
      }
    },
    created() {
      this.validatePass()
    }
  }

</script>

<style>


</style>
