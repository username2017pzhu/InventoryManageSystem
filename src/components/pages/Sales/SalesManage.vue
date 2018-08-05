<template>
  <el-row>
    <el-col :span="24">
      <!-- 操作区 -->
      <el-form :inline="true" :model="filters">
        <el-form-item>
          <el-input v-model="filters.salesNo" clearable @keydown.enter.native="handleKey" placeholder="请输入订单编号"></el-input>
        </el-form-item>
        <el-form-item>
          <el-form-item>
            <el-date-picker type="date" v-model="filters.salesAddTime" clearable @keydown.enter.native="handleKey" placeholder="请选择日期"></el-date-picker>
          </el-form-item>
          <el-button type="primary" @click="handleSearch" size="mini">
            <i class="el-icon-search"></i>查找</el-button>
            <el-button type="danger" size="mini" @click="handleMultiDel">批量删除</el-button>
        </el-form-item>
        <el-form-item>
          <el-pagination @current-change="handleCurrentChange" background layout="prev, pager,next" :page-count="pageCount">
          </el-pagination>
        </el-form-item>
      </el-form>
      <!-- 表格 -->
      <el-table :data="salesSumInfo" max-height="540" @selection-change="handleSelection" style="margin-top:-10px">
        <el-table-column type="selection">
        </el-table-column>
        <template v-for="item in tableItems">
          <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" sortable>
          </el-table-column>
        </template>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="queryFetch(scope.row)">查看</el-button>
            <el-button type="danger" size="mini" @click="handelDel(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 信息 -->
      <el-dialog title="查看订单详情" width="80%" :visible.sync="seeVisible">
        <el-table :data="salesInfo" border>
          <el-table-column label="订单编号" prop="salesNo"></el-table-column>
          <el-table-column label="商品编号" prop="goodsNo"></el-table-column>
          <el-table-column label="商品名" prop="goodsName"></el-table-column>
          <el-table-column label="价格" prop="goodsPrice"></el-table-column>
          <el-table-column label="销售数量" prop="salesCount"></el-table-column>
          <el-table-column label="应收金额" prop="deserveMoney"></el-table-column>
        </el-table>
      </el-dialog>
    </el-col>
  </el-row>
</template>
<script>
  import tableItems from '@/assets/data/sales.json'
  import axios from 'axios'
  import moment from 'moment'
  export default {
    name: 'salesMange',
    data() {
      return {
        tableItems: tableItems.tableColumn,
        salesInfo: [],
        salesSumInfo: [],
        pageCount: 0,
        page: 0,
        multipleSelection: [],
        filters: {
          goodsGroup: '',
          salesNo: ''
        },
        seeVisible: false,
      }
    },
    methods: {
      handleSelection(val) {
        this.multipleSelection = val
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      _stateChange(){
 
      },
      handleStateChange(salesNo,cb){
       axios.post('api/salesSum/stateChange', {
            salesNo: salesNo
          }).then(cb)
          .catch(err => console.log(err))
      },
      handleMultiStateChange(salesNo,cb){
            axios.post('api/salesSum/multiStateChange', {
                salesNo:salesNo
              })
              .then(cb)
              .catch(err => console.log(err))
      },
      handelDel(row){
        axios.post('api/sales/del',{
          salesNo:row.salesNo
        })
        .then(res=>{
          console.log(row.salesNo)
          this.handleStateChange(row.salesNo,res=>{
            this.$message.success('已删除')
            this.queryCompleted()
          })
        })
      },
      handleMultiDel(val) {
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择')
        } else {let multi = this.multipleSelection
          this.$confirm('你确定？', '提示', {}).then(() => {
              
              let salesNo = multi.map(el => el.salesNo)
              axios.post('api/sales/multiDel', {
                  salesNo: salesNo
                })
                .then(res => {
                  console.log(salesNo)
                  this.handleMultiStateChange(salesNo,res=>{
                    this.$message.success('删除成功')
                    this.queryCompleted()
                  })
                })
                .catch(err => console.log(err))
            })
            .catch(() => {
              this.$message.info('删除取消')
            })
        }
      },
      queryFetch(row) {
        this.seeVisible = true
        let salesNo = row.salesNo
        axios.post('api/sales/queryFetch', {
            salesNo: salesNo
          })
          .then(res => {
            this.salesInfo = res.data
            console.log(this.salesInfo)
          })
          .catch(err => console.log(err))
      },
      queryCompleted() {
        axios.get('api/salesSum/queryCompleted')
          .then(res => {
            this.salesSumInfo = res.data
            this.pageCount = Math.ceil(this.salesSumInfo.length / 10)
          })
          .catch(err => console.log(err))
      },
      handleSearch() {
        if (!this.filters.salesNo && !this.filters.salesAddTime) {
          this.$message.warning('请输入关键字')
          this.querySum()
        }
        let salesAddTime = moment(this.filters.salesAddTime).format('YYYY-MM-DD')
        axios.post('api/salesSum/queryByName', {
            salesNo: this.filters.salesNo,
            salesAddTime: salesAddTime,
          })
          .then(res => {
            this.salesSumInfo = res.data
          })
          .catch(err => console.log(err))
      },
      handleKey() {
        this.handleSearch()
      },
      handleCurrentChange(val) {
        this.page = (val - 1) * 10
        axios.post('/api/salesSum/pagination', {
            page: (val - 1) * 10
          }).then(res => {
            this.salesSumInfo = res.data
          })
          .catch(err => console.log(err))
      },

    },
    created() {
      this.queryCompleted()
    },
  }

</script>
