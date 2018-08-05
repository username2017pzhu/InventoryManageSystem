<template>
  <div class="returnstock">

    <!-- 操作区 -->
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.returnStockNo" clearable @keydown.enter.native="handleKey" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="filters.returnAddTime" type="date" placeholder="请选择退货时间" clearable @keydown.enter.native="handleKey"></el-date-picker>
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
        <el-dropdown>
          <el-button type="danger" size="mini">批量操作</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item>
              <el-button type="text" @click="handleMultiStopUse" size="mini">批量审核</el-button>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-form-item>
      <el-form-item>
        <el-pagination @current-change="handleCurrentChange" background layout="prev, pager,next" :page-count="pageCount">
        </el-pagination>
      </el-form-item>
    </el-form>


    <!-- 表格 -->


    <el-table :data="returnStockInfo" max-height="540" @selection-change="handleSelection" style="margin-top:-10px" v-loading="loading">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column label="展开" type="expand">
        <template slot-scope="props">
          <el-form inline label-width="100px">
            <el-form-item label="退货原因:">
              <span>{{props.row.returnStockReason}}</span>
            </el-form-item>
            <el-form-item label="添加时间">
              <span>{{props.row.returnAddTime}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <template v-for="item in tableItems">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" sortable>
        </el-table-column>
      </template>
      <el-table-column prop="tag" label="状态" width="100" :filters="[{ text: '待审核', value: '待审核' }, { text: '已完成', value: '已完成' }]"
        :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.returnStockState === '待审核' ? 'success':'danger'" close-transition>{{scope.row.returnStockState}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150">
        <template slot-scope="scope">
          <el-dropdown>
            <el-button type="danger" size="mini">审核</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" :disabled="scope.row.returnStockState==='已完成'" @click="handleStopUse(scope.row)">完成</el-button>
              </el-dropdown-item>
              <el-dropdown-item v-show="scope.row.returnStockState==='待审核'">
                <el-button type="text" @click="handleDel(scope.row)">驳回</el-button>
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
            <el-input v-model="addForm.goodsName" @keydown.enter.native="handleGoodsKey" clearable placeholder="请输入商品名"></el-input>
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
          <el-form-item label="退货时间">
            <el-date-picker v-model="addForm.returnAddTime" type="datetime" placeholder="请选择退货时间"></el-date-picker>
          </el-form-item>
          <el-form-item label="商品价格:"  aria-placeholder="0.00">
            <span>{{addForm.goodsPrice}}</span>
          </el-form-item>
          <el-form-item label="退货数量" prop="returnStockCount">
            <el-input-number v-model="addForm.returnStockCount">
            </el-input-number>
          </el-form-item>
          <el-form-item>
            <el-button @click="handleReturnAll" type="danger">全退了</el-button>
          </el-form-item>
          <el-form-item label="退货金额:">
            <el-form-item>{{returnStockMoney}}</el-form-item>
          </el-form-item>
        </div>
        <el-form-item label="退货原因" prop="returnStockReason">
          <el-input v-model="addForm.returnStockReason" type="textarea" style="width:800px;" :autosize="{ minRows: 3, maxRows: 8}"
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
  import tableItems from '@/assets/data/returnStock.json'
  import moment from 'moment'
  export default {
    data() {
      return {
        suppliers: [],
        goods: [],
        returnStockInfo: [],
        value: '',
        addForm: tableItems.addform,
        editForm: tableItems.editform,
        tableItems: tableItems.tableColumn,
        rules: tableItems.rules,
        addVisible: false,
        pageCount: 0,
        page: 0,
        multipleSelection: [],
        loading: false,
        filters: {
          returnStockNo: '',
          returnAddTime: '',
        },
      }
    },
    methods: {
      filterTag(value, row) {
        return row.returnStockState === value;
      },
      handleSelection(val) {
        this.multipleSelection = val
      },
      _stateChange(state, returnStockNo, cb) {
        axios.post('api/stockReturn/stateChange', {
            returnStockState: state,
            returnStockNo: returnStockNo
          }).then(cb)
          .catch(err => console.log(err))
      },
      _handleSearchInv(goodsNo, cb) {
        if (!goodsNo) {
          this.$message.warning('请输入编号')
        }
        axios.post('api/inventory/queryById', {
            goodsNo: goodsNo
          }).then(cb)
          .catch(err => console.log(err))
      },
      _handleChangeInv(goodsInv, goodsNo) {
        axios.post('api/inventory/update', {
          goodsInv: goodsInv,
          goodsNo: goodsNo
        }).catch(err => console.log(err))
      },
      _invChange(row) {
        this._handleSearchInv(row.goodsNo, res => {
          let count = res.data[0].goodsInv - row.returnStockCount
          this._handleChangeInv(count, row.goodsNo)
        })
      },
      handleStopUse(row) {
        this.editForm = Object.assign({}, row);
        this._stateChange('已完成', this.editForm.returnStockNo, res => {
          this._invChange(row)
          this.$message.success('完成')
          this.queryAll()
        })
      },
      handleDel(row) {
        axios.post('api/stockReturn/del', {
            returnStockNo: row.returnStockNo
          })
          .then(res => {
            this.$message.success('退货申请已取消')
            this.queryAll()
          })
      },
      _multiStateChange(state, cb) {
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择')
        } else {
          let multi = this.multipleSelection
          let returnStockNo = multi.map(el => el.returnStockNo)
          axios.post('api/stockReturn/multiStateChange', {
              returnStockState: state,
              returnStockNo: returnStockNo
            })
            .then(cb)
            .catch(err => console.log(err))
        }
      },
      handleMultiStopUse() {
        this._multiStateChange('已完成', res => {
          this.$message.success('完成')
          this.queryAll()
        })
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      handleAdd() {
        this.addVisible = true
        this.queryUsedSup()
      },
      _handleClear() {
        this.addForm = {
          goodsNo: '',
          supName: '',
          goodsPrice: '',
          returnStockCount: '',
          returnStockMoney: '',
          returnStockReason: '',
          returnAddTime: '',
        }
      },
      addSubmit() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            this._handleSearchInv(this.addForm.goodsNo, res => {
              if (res.data[0].goodsInv < this.addForm.returnStockCount) {
                this.$message.info('与库存数据不符')
                this._handleClear()
                return
              } else {
                let params = Object.assign({}, this.addForm);
                let returnAddTime = moment(params.returnAddTime).format('YYYY-MM-DD HH:mm')
                axios.post('api/stockReturn/add', {
                    goodsNo: params.goodsNo,
                    supName: params.supName,
                    goodsPrice: params.goodsPrice,
                    returnStockCount: params.returnStockCount,
                    returnStockMoney: this.returnStockMoney,
                    returnStockReason: params.returnStockReason,
                    returnAddTime: returnAddTime,
                  })
                  .then(res => {
                    this.$message.success('添加成功')
                    this._handleClear()
                    this.goods = []
                    this.addVisible = false
                    this.queryAll()
                    let page = Math.ceil(this.page / 10) + 1
                    this.handleCurrentChange(page)
                  })
                  .catch(err => console.log(err))
              }
            })
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
            let obj = Object.assign({}, this.goods)
            delete obj[0].goodsType
            delete obj[0].goodsAddTime
            delete obj[0].goodsModel
            delete obj[0].goodsSpec
            delete obj[0].goodsUnit
            delete obj[0].goodsState
            this.addForm = Object.assign({}, obj[0])
          })
          .catch(err => console.log(err))
      },
      handleKey() {
        this.handleSearch()
      },
      handleGoodsKey() {
        this.handleGoodsSearch()
      },
      handleReturnAll() {
        this._handleSearchInv(this.addForm.goodsNo, res => {
          if (res.data[0].goodsInv === 0) {
            this.$message.info('商品售罄')
            this.addForm.returnStockCount = 0
            this._handleClear()
          } else {
            this.addForm.returnStockCount = res.data[0].goodsInv
          }
        })
      },
      handleSearch() {
        if (!this.filters.returnStockNo && !this.filters.returnAddTime) {
          this.$message.warning('请输入关键字')
          this.queryAll()
        }
        if (!this.filters.returnAddTime) {
          this.filters.returnAddTime = null
        }
        let returnAddTime = moment(this.filters.returnAddTime).format('YYYY-MM-DD')
        axios.post('api/stockReturn/queryByName', {
            returnStockNo: this.filters.returnStockNo,
            returnAddTime: returnAddTime,
          })
          .then(res => {
            this.returnStockInfo = res.data
          })
          .catch(err => console.log(err))
      },
      queryAll() {
        axios.get('api/stockReturn/queryAll')
          .then(res => {
            this.returnStockInfo = res.data
          })
          .catch(err => console.log(err))
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
        axios.post('/api/stockReturn/pagination', {
            page: (val - 1) * 10
          }).then(res => {
            this.returnStockInfo = res.data
          })
          .catch(err => console.log(err))
      },
    },
    computed: {
      returnStockMoney: {
        get: function () {
          return this.addForm.goodsPrice * this.addForm.returnStockCount
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
