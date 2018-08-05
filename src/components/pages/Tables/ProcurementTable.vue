<template>
  <div class="stock">
    <!-- 操作区 -->
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.stockNo" clearable @keydown.enter.native="handleKey" placeholder="请输入订单编号"></el-input>
      </el-form-item>
        <el-form-item>
          <el-date-picker type="date" v-model="filters.stockAddTime" clearable @keydown.enter.native="handleKey" placeholder="请选择日期"></el-date-picker>
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
    <el-table :data="stockInfo" max-height="540" @selection-change="handleSelection" style="margin-top:-10px" v-loading="loading">
      <el-table-column type="selection">
      </el-table-column>
      <template v-for="item in tableItems">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" sortable>
        </el-table-column>
      </template>
      <el-table-column prop="tag" label="状态" width="100" :filters="[{ text: '待审核', value: '待审核' }, { text: '已完成', value: '已完成' }]"
        :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <span>{{scope.row.stockState}}</span>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>


<script>
  import tableItems from '@/assets/data/stock.json'
  import axios from 'axios'
  import moment from 'moment'
  import {
    setTimeout
  } from 'timers';
  export default {
    name: 'stockTable',
    data() {
      return {
        tableItems: tableItems.stockTableColumn,
        stockInfo: [],
         fileName: '',
        loading: false,
        multipleSelection: [],
        filters: {
          stockNo: '',
          stockAddTime:''
        },
      }
    },
    methods: {
      _handleExport(val) {
        this.loading = true
        import ('@/vendor/Export2Excel').then(excel => {
          const tHeader = ['订单编号', '商品编号', '商品名', '供应商名','进价(￥)','价格(￥)','采购数量','采购金额','采购时间','状态']
          const filterVal = ['stockNo','goodsNo','goodsName','supName','stockPrice','goodsPrice','stockCount','stockMoney','stockAddTime','stockState']
          const list = val
          const data = this.formatJson(filterVal, list)
          excel.export_json_to_excel(tHeader, data, this.fileName)
          this.loading = false
        })
      },
      handleExportAll() {
        if (this.fileName == '') {
          this.$confirm('使用默认文件名？', '提示', {}).then(() => {
              this._handleExport(this.stockInfo)
            })
            .catch(() => this.$message.warning('请输入文件名'))
        } else {
          this._handleExport(this.stockInfo)
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
      filterTag(value, row) {
        return row.stockState === value;
      },
      handleSelection(val) {
        this.multipleSelection = val
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      queryAll() {
        axios.get('api/stock/queryAll')
          .then(res => {
            this.stockInfo = res.data
          })
          .catch(err => console.log(err))
      },
      handleSearch() {
        if (!this.filters.stockNo && !this.filters.stockAddTime) {
          this.$message.warning('请输入关键字')
          this.queryAll()
        }
        let stockAddTime = moment(this.filters.stockAddTime).format('YYYY-MM-DD')
        axios.post('api/stock/queryByName', {
            stockNo: this.filters.stockNo,
            stockAddTime: stockAddTime,
          })
          .then(res => {
            this.stockInfo = res.data
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
