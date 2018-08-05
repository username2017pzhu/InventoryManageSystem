<template>
  <div class="employee">
    <!-- 操作区 -->
    <el-form :inline="true">
      <el-form-item >
        <el-input v-model="filters.empName" clearable @keydown.enter.native="handleKey" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.empNo" clearable @keydown.enter.native="handleKey" placeholder="请输入员工编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleSearch">
          <i class="el-icon-search"></i>查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-input v-model="fileName" placeholder="请输入文件名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleExportAll">全部导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleExportSelect">导出所选</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="users" max-height="540" @selection-change="handleSelection" style="margin-top:-10px" v-loading="loading">
      <el-table-column type="selection">
      </el-table-column>
      <template v-for="item in tableItems">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" width="100" sortable>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
import axios from 'axios'
  import tableItems from '@/assets/data/employee.json'
  import {
    setTimeout
  } from 'timers';
  export default {
    name: 'employee',
    data() {
      return {
        tableItems: tableItems.infoTableColumn,
        fileName: '',
        users: [],
        filters: {
          empNo:'',
          empName: ''
        },
        multipleSelection: [],
        loading: false,
      }
    },
    methods: {
      _handleExport(val) {
        this.loading = true
        import ('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['员工编号', '姓名', '年龄', '性别', '生日', '身份证', '电话', 'QQ', '地址', '入职时间','状态']
          const filterVal = ['empNo', 'empName', 'empAge', 'empSex', 'empBirthday', 'empIdCard', 'empTel', 'empQQ',
            'empAddress', 'empEntryDate','empState']
          const list = val
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel(tHeader, data, this.fileName)
          this.loading = false
        })
      },
      handleExportAll() {
        if (this.fileName == '') {
          this.$confirm('使用默认文件名？', '提示', {}).then(() => {
              this._handleExport(this.users)
            })
            .catch(() => this.$message.warning('请输入文件名'))
        } else {
          this._handleExport(this.users)
        }
      },
      handleExportSelect() {
        if (this.fileName == '') {
          this.$confirm('使用默认文件名？', '提示', {}).then(() => {
            if (this.multipleSelection.length == 0)
              this.$message.warning('请选择')
            else this._handleExport(this.multipleSelection)
          })
        } else {
          if (this.multipleSelection.length == 0)
            this.$message.warning('请选择')
          else this._handleExport(this.multipleSelection)
        }
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => {
          if (j === 'timestamp') {
            return parseTime(v[j])
          } else {
            return v[j]
          }
        }))
      },
      handleSelection(val) {
        this.multipleSelection = val
      },
      queryAll() {
        axios.get('api/employee/queryAll').then(res => {
          this.users = res.data
        })
      },
       handleSearch() { 
        if (!this.filters.empName&&!this.filters.empNo) {
          this.$message.warning('请输入关键字')
            this.queryAll()
        }
        if(!this.filters.empName){
          this.filters.empName=null
        }
        if(!this.filters.empNo&&this.filters.empName===null){
          this.queryAll()
        }
        axios.post('api/employee/queryByName', {
          empNo:this.filters.empNo,
            empName:  this.filters.empName
          })
          .then(res => {
            this.users = res.data
          })
          .catch(err=>console.log(err))
      },
      handleKey() {
        this.handleSearch()
      },
    },
    created() {
      setTimeout(this.queryAll(), 100)

    },
  }

</script>
