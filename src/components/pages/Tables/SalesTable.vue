<template>
  <div class="sales">
    <!-- 操作区 -->
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-dropdown>
          <el-button type="primary"><i class="el-icon-time"></i> 按时间查询</el-button>
          <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item>
              <el-button type="text" size="mini" @click="queryAll">全部</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" size="mini" @click="today">今天</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" size="mini" @click="yesterday">昨天</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" size="mini" @click="lastWeek">上周</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" size="mini" @click="lastMonth">上月</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
       <el-form-item>
        <el-input v-model="fileName" clearable placeholder="请输入文件名"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleExportAll">全部导出</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleExportSelect">导出所选</el-button>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="salesInfo" max-height="540" @selection-change="handleSelection" style="margin-top:-10px" v-loading="loading">
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
  import tableItems from '@/assets/data/sales.json'
  import axios from 'axios'
  import moment from 'moment'
  import {
    setTimeout
  } from 'timers';
  export default {
    name: 'salesTable',
    data() {
      return {
        tableItems: tableItems.tableColumn,
        salesInfo: [],
         fileName: '',
        loading: false,
        multipleSelection: [],
        filters: {
          salesNo: '',
          salesAddTime:''
        },
      }
    },
    methods: {
      _handleExport(val) {
        this.loading = true
        import ('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['销售编号', '销售商品', '应收金额', '实收金额','找零','数量汇总','销售时间']
          const filterVal = ['salesNo','goodsGroup','salesMoneySum','reciveMoney','changeMoney','salesCountSum','salesAddTime']
          const list = val
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel(tHeader, data, this.fileName)
          this.loading = false
        })
      },
      handleExportAll() {
        if (this.fileName == '') {
          this.$confirm('使用默认文件名？', '提示', {}).then(() => {
              this._handleExport(this.salesInfo)
            })
            .catch(() => this.$message.warning('请输入文件名'))
        } else {
          this._handleExport(this.salesInfo)
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
      _changeDate(time){
        axios.get(`api/salesSum/${time}`)
        .then(res=>this.salesInfo=res.data)
        .catch(err=>console.log(err))
      },
      today(){
        this._changeDate('today')
      },
      yesterday(){
        this._changeDate('yesterday')
      },
      lastWeek(){
        this._changeDate('lastWeek')
      },
      lastMonth(){
        this._changeDate('lastMonth')
      },
      filterTag(value, row) {
        return row.salesState === value;
      },
      handleSelection(val) {
        this.multipleSelection = val
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      queryAll() {
        axios.get('api/salesSum/queryAll')
          .then(res => {
            this.salesInfo = res.data
          })
          .catch(err => console.log(err))
      },
      handleSearch() {
        if (!this.filters.salesNo && !this.filters.salesAddTime) {
          this.$message.warning('请输入关键字')
          this.queryAll()
        }
        let salesAddTime = moment(this.filters.salesAddTime).format('YYYY-MM-DD')
        axios.post('api/sales/queryByName', {
            salesNo: this.filters.salesNo,
            salesAddTime: salesAddTime,
          })
          .then(res => {
            this.salesInfo = res.data
          })
          .catch(err => console.log(err))
      },
      handleKey() {
        this.handleSearch()
      },
    },

    created() {
      this.queryAll()
    },
  }

</script>
<style scoped>
.el-dropdown-menu--small{
 display: grid;
 grid-template-columns: 50px 50px 50px;
 grid-template-rows: 25px 25px;
}
</style>
