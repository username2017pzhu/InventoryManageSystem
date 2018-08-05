<template>
  <div class="supplierTable">
    <!-- 操作区 -->
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="filters.supName" clearable @keydown.enter.native="handleKey" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.supNo" clearable @keydown.enter.native="handleKey" placeholder="请输入供应商编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" size="mini">
          <i class="el-icon-search"></i>查找</el-button>
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
    <el-table :data="suppliers" max-height="540" @selection-change="handleSelection" style="margin-top:-10px" v-loading="loading">
      <el-table-column type="selection">
      </el-table-column>
     <template v-for="item in tableItems">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" sortable>
        </el-table-column>
      </template>
    </el-table>
  </div>
</template>
<script>
  import axios from 'axios'
  import tableItems from '@/assets/data/supplier.json'
  import {
    setTimeout
  } from 'timers';
  export default {
    name: 'supplierTable',
    data() {
      return {
        tableItems:tableItems.infoTableColumn,
        fileName: '',
        suppliers: [],
        filters: {
          supNo:'',
          supName: ''
        },
        multipleSelection: [],
        loading: false,
      }
    },
    methods: {
      _handleExport(val) {
        this.loading = true
        import ('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['供应商编号', '公司名', '法人代表', '电话','供应商地址','状态']
          const filterVal = ['supNo','supName','supLawyer','supTel','supAddress','supState']
          const list = val
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel(tHeader, data, this.fileName)
          this.loading = false
        })
      },
      handleExportAll() {
        if (this.fileName == '') {
          this.$confirm('使用默认文件名？', '提示', {}).then(() => {
              this._handleExport(this.suppliers)
            })
            .catch(() => this.$message.warning('请输入文件名'))
        } else {
          this._handleExport(this.suppliers)
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
       handleSearch() {
        if (!this.filters.supName && !this.filters.supNo) {
          this.$message.warning('请输入关键字')
        }
        if (!this.filters.supName) {
          this.filters.supName =null
        }
        if (!this.filters.supNo && this.filters.supName ===null) {
          this.queryAll()
        }
        axios.post('api/supplier/queryByName', {
            supName: this.filters.supName,
            supNo: this.filters.supNo
          })
          .then(res => {
            this.suppliers = res.data
          })
          .catch(err => console.log(err))
      },
      handleKey() {
        this.handleSearch()
      },
      queryAll() {
        axios.get('api/supplier/queryAll').then(res=>{
          this.suppliers=res.data
        })
      },
    },
    created() {
      this.queryAll()
    },
  }

</script>
