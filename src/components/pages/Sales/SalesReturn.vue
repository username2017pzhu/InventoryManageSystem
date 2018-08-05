<template>
  <div class="returnstock">
    <!-- 操作区 -->
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.returnGoodsNo" clearable @keydown.enter.native="handleKey" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item>
       <el-date-picker v-model="filters.returnAddTime" type="date" placeholder="请选择退货时间" clearable @keydown.enter.native="handleKey" ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" size="mini">
          <i class="el-icon-search"></i>查找</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleAdd" size="mini">
          <i class="el-icon-plus"></i>新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-pagination @current-change="handleCurrentChange" background layout="prev, pager,next" :page-count="pageCount">
        </el-pagination>
      </el-form-item>
    </el-form>


<!-- 表格 -->


    <el-table :data="returnGoodsInfo" max-height="540" @selection-change="handleSelection" style="margin-top:-10px" v-loading="loading">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="展开" type="expand">
        <template slot-scope="props">
          <el-form inline label-width="100px">
            <el-form-item label="退货原因:">
              <span>{{props.row.returnGoodsReason}}</span>
            </el-form-item>
            <el-form-item label="添加时间">
              <span>{{props.row.returnAddTime}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <template v-for="item in tableItems">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" width="150" sortable>
        </el-table-column>
      </template>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="danger" size="mini">审核</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" :disabled="scope.row.returnState==='已完成'?true:false" @click="handleReturn(scope.row)">完成</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加框 -->
    <el-dialog width="1000px" :visible.sync="addVisible">
      <el-form :model="addForm" label-width="100px" :rules="rules" ref="addForm">
        <div class="top">
          <el-form-item label="商品编号" prop="goodsNo">
            <el-input v-model="addForm.goodsNo" @keydown.enter.native="handleGoodsKey" clearable placeholder="请输入商品编号"></el-input>
          </el-form-item>
          <el-form-item label="商品名称" prop="goodsName">
            <el-input v-model="addForm.goodsName" @keydown.enter.native="handleGoodsKey"  clearable placeholder="请输入商品名"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleGoodsSearch">查询商品</el-button>
          </el-form-item>
        </div>
        <el-form-item style="width:900px">
        </el-form-item>
        <div class="bottom">
          <el-form-item label="供应商名称" prop="supName">
            <el-select filterable v-model="addForm.supName">
              <el-option v-for="item in suppliers" :key="item.supNo" :value="item.supName" :label="item.supName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="退货数量" prop="returnGoodsCount">
            <el-input v-model="addForm.returnGoodsCount">
            </el-input>
          </el-form-item>
          <el-form-item label="商品价格:" aria-placeholder="0.00">
            <span>{{addForm.goodsPrice}}</span>
          </el-form-item>
           <el-form-item label="销售编号" prop="salesNo">
            <el-input v-model="addForm.salesNo" clearable></el-input>
          </el-form-item>
          <el-form-item label="退货金额:">
            <el-form-item>{{returnGoodsMoney}}</el-form-item>
          </el-form-item>
        </div>
        <el-form-item label="退货原因" prop="returnGoodsReason">
          <el-input v-model="addForm.returnGoodsReason" type="textarea" style="width:800px;" :autosize="{ minRows: 3, maxRows: 8}"
            placeholder="请输入退货原因"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="addSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

  </div>
</template>
<style>
  .top {
    width: 800px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start
  }

  .bottom {
    width: 800px;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: flex-start
  }

</style>

<script>
  import axios from 'axios'
  import tableItems from '@/assets/data/salesReturn.json'
  import moment from 'moment'
  export default {
    data() {
      return {
        suppliers: [],
        goods: [],
        returnGoodsInfo: [],
        value: '',
        addForm: tableItems.addform,
        tableItems: tableItems.tableColumn,
        rules: tableItems.rules,
        addVisible: false,
        pageCount: 0,
        page: 0,
        multipleSelection: [],
        loading: false,
        filters: {
          returnGoodsNo: '',
          returnAddTime: '',
        },
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
      handleAdd() {
        this.addVisible = true
        this.queryUsedSup()
      },
      addSubmit() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let params = Object.assign({}, this.addForm);
            let returnAddTime = moment().format('YYYY-MM-DD HH:mm')
            axios.post('api/salesReturn/add', {
                salesNo:params.salesNo,
                goodsNo: params.goodsNo,
                supName: params.supName,
                goodsPrice: params.goodsPrice,
                returnGoodsCount: params.returnGoodsCount,
                returnGoodsMoney: this.returnGoodsMoney,
                returnGoodsReason: params.returnGoodsReason,
                returnAddTime: returnAddTime,
              }).then(res => {
                this.$message.success('添加成功')
                this.addForm = {
                  salesNo:'',
                  goodsNo: '',
                  supName: '',
                  goodsPrice: '',
                  returnGoodsCount: '',
                  returnGoodsMoney: '',
                  returnGoodsReason: '',
                  returnAddTime: '',
                }
                 this.goods=[]
                this.addVisible = false
                this.queryAll()
                let page = Math.ceil(this.page / 10) + 1
                this.handleCurrentChange(page)
              })
              .catch(err => console.log(err))
          }
        })
      },
      handleGoodsSearch() {
        if (!this.addForm.goodsName && !this.addForm.goodsNo) {
          this.$message.warning('请输入关键字')
        }
        if (!this.addForm.goodsName) {
          this.addForm.goodsName = null
        }
        if (!this.addForm.goodsNo && this.addForm.goodsName === null) {
          this.$message.warning('请输入商品编号')
        }
        axios.post('api/goods/queryByName', {
            goodsNo: this.addForm.goodsNo,
            goodsName: this.addForm.goodsName
          })
          .then(res => {
            this.goods = res.data
            let obj=Object.assign({},this.goods)
            delete obj[0].goodsType
            delete obj[0].goodsAddTime
            delete obj[0].goodsModel
            delete obj[0].goodsSpec
            delete obj[0].goodsUnit
            delete obj[0].goodsState
            this.addForm=Object.assign({},obj[0])
          })
          .catch(err => console.log(err))
      },
      handleKey(){
        this.handleSearch()
      },
      handleGoodsKey(){
        this.handleGoodsSearch()
      },
      handleSearch() {
        if (!this.filters.returnGoodsNo && !this.filters.returnAddTime) {
          this.$message.warning('请输入关键字')
           this.queryAll()
        }
        if(!this.filters.returnAddTime){
          this.filters.returnAddTime=null
        }
        let returnAddTime = moment(this.filters.returnAddTime).format('YYYY-MM-DD')
        axios.post('api/salesReturn/queryByName', {
            returnGoodsNo: this.filters.returnGoodsNo,
            returnAddTime: returnAddTime,
          })
          .then(res => {
            this.returnGoodsInfo = res.data
          })
          .catch(err => console.log(err))
      },
      queryAll() {
        axios.get('api/salesReturn/queryAll')
          .then(res => {
            this.returnGoodsInfo = res.data
          })
          .catch(err => console.log(err))
      },
      stateChange(returnGoodsNo){
axios.post('api/salesReturn/stateChange',{
  returnGoodsNo:returnGoodsNo
})
      },
      handleReturn(row){
        axios.post('api/salesSum/queryByName',{
          salesNo:row.salesNo,
          salesAddTime:null
        })
        .then(res=>{
          axios.post('api/goods/queryById',{
            goodsNo:row.goodsNo
          })
          .then (e=>{
            let oldSalesSum=res.data[0].salesMoneySum
          let newSalesSum=parseInt(oldSalesSum)-parseInt(row.returnGoodsMoney)
          let returnGoodsProfit=parseInt(row.returnGoodsCount)*parseInt(e.data[0].stockPrice)
          let oldSalesProfit=res.data[0].salesProfitSum
          let newSalesProfit=parseInt(oldSalesProfit)-parseInt(returnGoodsProfit)
          axios.post('api/salesSum/update',{
            salesMoneySum:newSalesSum,
            salesProfitSum:newSalesProfit,
            salesNo:row.salesNo
          })
          .then(r=>{
            this.stateChange(row.returnGoodsNo)
            this.$message.success('已完成')
             this.queryAll()
          })
          })
        })
      },
      queryUsedSup() {
        axios.get('api/supplier/queryUsedSup')
          .then(res => {
            this.suppliers = res.data
          })
          .catch(err => console.log(err))
      },
      handleCurrentChange(val) {
        this.page = (val - 1) * 10
        axios.post('/api/salesReturn/pagination', {
            page: (val - 1) * 10
          }).then(res => {
            this.returnGoodsInfo = res.data
          })
          .catch(err => console.log(err))
      },
    },
    computed: {
      returnGoodsMoney: {
        get: function () {
          return this.addForm.goodsPrice * this.addForm.returnGoodsCount
        }
      }
    },
    created() {
      this.queryAll()
    }
  }

</script>

<style>


</style>
