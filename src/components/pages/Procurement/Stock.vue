<template>
  <div class="stock">
    <!-- 操作区 -->
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.stockNo" clearable @keydown.enter.native="handleKey" placeholder="请输入订单编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-form-item>
          <el-date-picker type="date" v-model="filters.stockAddTime" clearable @keydown.enter.native="handleKey" placeholder="请选择日期"></el-date-picker>
        </el-form-item>
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
    <el-table :data="stockSumInfo" max-height="540" @selection-change="handleSelection" style="margin-top:-10px" v-loading="loading">
      <el-table-column type="selection">
      </el-table-column>
      <template v-for="item in tableItems">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" sortable>
        </el-table-column>
      </template>
      <el-table-column prop="tag" label="状态" width="100" :filters="[{ text: '待审核', value: '待审核' }, { text: '已完成', value: '已完成' }]"
        :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.stockState === '待审核' ? 'success':'danger'" close-transition>{{scope.row.stockState}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230">
        <template slot-scope="scope">
          <el-button type="peimary" size="mini" @click="queryFetch(scope.row)">查看</el-button>
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-dropdown>
            <el-button type="danger" size="mini">审核</el-button>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item>
                <el-button type="text" :disabled="scope.row.stockState==='已完成'" size="mini" @click="handleStopUse(scope.row)">完成</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增框 -->
    <el-dialog title="添加信息" width="80%" :visible.sync="addVisible">
      <el-table :data="usedGoods" max-height="320" @selection-change="handleSelection">
        <el-table-column type="selection"></el-table-column>
        <el-table-column prop="goodsNo" label="商品编号" max-width="150" sortable> </el-table-column>
        <el-table-column prop="goodsName" label="商品名" max-width="150" sortable> </el-table-column>
        <el-table-column prop="supName" label="供应商名" max-width="150" sortable> </el-table-column>
        <el-table-column prop="stockPrice" label="进价" max-width="150" sortable>
        </el-table-column>
        <el-table-column prop="goodsPrice" label="价格" max-width="150" sortable>
        </el-table-column>
        <el-table-column prop="stockCount" label="数量" max-width="100" sortable>
          <template slot-scope="scope">
            <el-input style="width:90px" size="mini" v-model="scope.row.stockCount"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="stockMoney" label="采购金额" max-width="150" :formatter="stockSum1" sortable>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 编辑框 -->
    <el-dialog title="编辑信息" width="80%" :visible.sync="editVisible">
      <el-table :data="stockedGoods" max-height="320">
        <el-table-column prop="goodsNo" label="商品编号" max-width="150" sortable> </el-table-column>
        <el-table-column prop="goodsName" label="商品名" max-width="150" sortable> </el-table-column>
        <el-table-column prop="supName" label="供应商名" max-width="150" sortable> </el-table-column>
        <el-table-column prop="stockPrice" label="进价" max-width="150" sortable>
        </el-table-column>
        <el-table-column prop="goodsPrice" label="价格" max-width="150" sortable>
        </el-table-column>
        <el-table-column prop="stockCount" label="数量" max-width="100" sortable>
          <template slot-scope="scope">
            <el-input style="width:90px" size="mini" v-model="scope.row.stockCount"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="stockMoney" label="采购金额" max-width="150" :formatter="stockSum2" sortable>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible=false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 查看详情 -->
    <el-dialog title="查看订单详情" width="80%" :visible.sync="seeVisible">
      <el-table :data="stockInfo" border>
        <el-table-column label="订单编号" prop="stockNo"></el-table-column>
        <el-table-column label="商品编号" prop="goodsNo"></el-table-column>
        <el-table-column label="商品名" prop="goodsName"></el-table-column>
        <el-table-column label="供应商" prop="supName"></el-table-column>
        <el-table-column label="进价" prop="stockPrice"></el-table-column>
        <el-table-column label="价格" prop="goodsPrice"></el-table-column>
        <el-table-column label="采购数量" prop="stockCount"></el-table-column>
        <el-table-column label="采购金额" prop="stockMoney"></el-table-column>
      </el-table>
    </el-dialog>
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
    name: 'goods',
    data() {
      return {
        tableItems: tableItems.tableColumn,
        stockInfo: [],
        stockSumInfo: [],
        usedGoods: [],
        stockedGoods: [],
        loading: false,
        pageCount: 0,
        page: 0,
        multipleSelection: [],
        filters: {
          stockNo: '',
          stockAddTime: ''
        },
        addVisible: false,
        editVisible: false,
        seeVisible: false,
        editForm: tableItems.editform,
      }
    },
    methods: {
      stockSum1(row) {
        return row.stockMoney = row.stockCount * 1000 * row.stockPrice / 1000
      },
      stockSum2(row) {
        return row.stockMoney = row.stockCount * 1000 * row.stockPrice / 1000
      },
      filterTag(value, row) {
        return row.stockState === value;
      },
      handleSelection(val) {
        this.multipleSelection = val
      },
      _stateChange(state, stockNo, cb) {
        axios.post('api/stockSum/stateChange', {
            stockState: state,
            stockNo: stockNo
          }).then(cb)
          .catch(err => console.log(err))
      },
      _handleSearchInv(goodsNo, cb) {
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
        let multi = this.stockInfo

        let vals = multi.map(el => Object.values(el))
        vals.map(el => {
          el.splice(0, 2)
          el.splice(2, 3)
          el.splice(3, 1)
          this._handleSearchInv(el[0], res => {
            el[2] += res.data[0].goodsInv
            this._handleChangeInv(el[2], el[0])
          })
        })
        //原数组砍掉无关信息插入inventory表中
        //小本本先记着 用replace方法更新数组信息可以提高性能但是异步逻辑控制还没有找到解决方法
      },
      handleStopUse(row) {
        this.queryFetch(row)
        this.seeVisible = false
        this.editForm = Object.assign({}, row);
        this._stateChange('已完成', this.editForm.stockNo, res => {
          this._invChange(row)
          this.$message.success('完成')
          this.querySum()
        })
      },
      _multiStateChange(state, cb) {
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择')
        } else {
          let multi = this.multipleSelection
          multi.map(el => {
            axios.post('api/stockSum/multiStateChange', {
                stockState: state,
                stockNo: el.stockNo
              })
              .then(cb)
              .catch(err => console.log(err))
          })
        }
      },
      handleMultiStopUse() {
        this._multiStateChange('已完成', res => {
          let multi = this.multipleSelection
          multi.map(el => {
            axios.post('api/stock/queryFetch', {
                stockNo: el.stockNo
              })
              .then(res => {
                res.data.map(e => {
                  axios.post('api/inventory/queryById', {
                      goodsNo: e.goodsNo
                    })
                    .then(res => {
                      // 如果库存为0，直接存入
                      axios.post('api/inventory/update', {
                          goodsInv: parseInt(e.stockCount) + parseInt(res.data[0].goodsInv),
                          goodsNo: e.goodsNo
                        })
                        .catch(err => console.log(err))
                    })
                    .catch(err => console.log(err))
                })
              })
              .catch(err => console.log(err))
          })
          this.$message.success('已全部完成')
          this.querySum()
        })

      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      queryFetch(row) {
        this.seeVisible = true
        let stockNo = row.stockNo
        axios.post('api/stock/queryFetch', {
            stockNo: stockNo
          })
          .then(res => {
            this.stockInfo = res.data
          })
          .catch(err => console.log(err))
      },
      querySum() {
        axios.get('api/stockSum/queryAll')
          .then(res => {
            this.stockSumInfo = res.data
            this.pageCount = Math.ceil(this.stockSumInfo.length / 8)
          })
          .catch(err => console.log(err))
      },
      queryUsedGoods() {
        axios.get('api/goods/queryUsedGoods')
          .then(res => {
            this.usedGoods = res.data
          })
          .catch(err => console.log(err))
      },
      handleSearch() {
        if (!this.filters.stockNo && !this.filters.stockAddTime) {
          this.$message.warning('请输入关键字')
        }
        let stockAddTime = moment(this.filters.stockAddTime).format('YYYY-MM-DD')
        axios.post('api/stockSum/queryByName', {
            stockNo: this.filters.stockNo,
            stockAddTime: stockAddTime,
          })
          .then(res => {
            this.stockSumInfo = res.data
          })
          .catch(err => console.log(err))
      },
      handleKey() {
        this.handleSearch()
      },
      handleAdd() {
        this.addVisible = true;
        this.queryUsedGoods()
      },
      addStock() {
        axios.get('api/stockSum/queryAll')
          .then(res => {
            console.log(res.data.length)
            let multi = this.multipleSelection
            let stockNo = 0
            multi.map(el => {
              stockNo = res.data.length === 0 ? 1 : parseInt(res.data.length) + 1
              axios.post('api/stock/add', {
                stockNo: stockNo,
                goodsNo: el.goodsNo,
                goodsName: el.goodsName,
                supName: el.supName,
                stockPrice: el.stockPrice,
                goodsPrice: el.goodsPrice,
                stockCount: el.stockCount,
                stockMoney: el.stockMoney
              })
            })
          })

      },
      addStockSum() {
        let multi = this.multipleSelection
        let goodsGroup = multi.map(el => el.goodsName).toString()
        let stockCountSum = 0
        multi.map(el => stockCountSum += parseInt(el.stockCount))
        let stockMoneySum = 0
        multi.map(el => stockMoneySum += el.stockMoney)
        let stockAddTime = moment().format('YYYY-MM-DD HH:mm')
        axios.post('api/stockSum/add', {
          goodsGroup: goodsGroup,
          stockCountSum: stockCountSum,
          stockMoneySum: stockMoneySum,
          stockAddTime: stockAddTime
        })
      },
      addInventory() {
        let multi = this.multipleSelection
        let vals = multi.map(el => Object.values(el))
        vals.map(el => {
          el.splice(2, 5)
          el.push(null)
          //原数组砍掉无关信息插入inventory表中
        })
        axios.post('api/inventory/add', {
          values: vals
        }).then().catch(err => console.log(err))
      },
      addSubmit() {
        let multi = this.multipleSelection
        if (multi.length === 0) this.$message.warning('请选择商品')
        else {
          axios.all([this.addStock(), this.addStockSum(), this.addInventory()])
            .then(axios.spread(() => {
              this.$message.success('添加成功')
              this.querySum()
              this.addVisible = false
            }));
        }
      },
      handleEdit(row) {
        this.editVisible = true
        axios.post('api/stock/queryFetch', {
            stockNo: row.stockNo
          })
          .then(res => {
            this.stockedGoods = res.data
          })
          .catch(err => console.log(err))
      },
      editSubmit() {
        let stockCountSum = 0
        let stockMoneySum = 0
        let stockNo = 0
        this.stockedGoods.map(el => {
          stockCountSum += parseInt(el.stockCount)
          stockMoneySum += el.stockMoney
          stockNo = el.stockNo
          axios.post('api/stock/update', {
              stockCount: el.stockCount,
              stockMoney: el.stockMoney,
              goodsNo: el.goodsNo
            })
            .then(res => {
              this.$message.success('修改成功')
              this.editVisible = false
            })
        })
        axios.post('api/stockSum/update', {
          stockCountSum: stockCountSum,
          stockMoneySum: stockMoneySum,
          stockNo: stockNo
        })
        this.querySum()
      },
      handleCurrentChange(val) {
        this.page = (val - 1) * 8
        axios.post('/api/stockSum/pagination', {
            page: (val - 1) * 8
          }).then(res => {
            this.stockSumInfo = res.data
          })
          .catch(err => console.log(err))
      },

    },

    created() {
      this.querySum()
      this.handleCurrentChange(1)
    },
  }

</script>
