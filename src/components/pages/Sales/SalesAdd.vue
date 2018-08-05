<template>
  <el-row>
    <el-col :span="1">
      <div class="grid"></div>
    </el-col>
    <el-col :span="16">
      <el-form class="sales-area" :model="addForm">
        <el-table :data="goods" border size="mini" height="150px">
          <el-table-column label="编号" prop="goodsNo"></el-table-column>
          <el-table-column label="商品名" width="150px" prop="goodsName"></el-table-column>
          <el-table-column label="价格" prop="goodsPrice"></el-table-column>
          <el-table-column label="数量" prop="goodsSalesCount"></el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button type="primary" size="mini" @click="regret(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-form class="vvv" label-position="left">

          <el-form-item class="vc">
            <el-form-item label="商品编号" label-width="5em">
              <el-input placeholder="请输入商品编号" clearable v-model="addForm.goodsNo" @blur="handleGoodsSearch"></el-input>
            </el-form-item>
            <el-form-item label="数量" label-width="5em">
              <el-input v-model="addForm.goodsSalesCount" clearable>
              </el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="addGoods">添加</el-button>
            </el-form-item>
            <el-form-item label="实收金额" label-width="5em">
              <el-input v-model="addForm.reciveMoney" clearable></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="success" @click="addSubmit">结账</el-button>
              <el-button type="warning" @click="clearForm">重置</el-button>
            </el-form-item>
          </el-form-item>
          <el-form-item class="vc">
            <el-form-item label="商品名">
              <span>{{addForm.goodsName}}</span>
            </el-form-item>
            <el-form-item label="商品价格">
              <span>{{addForm.goodsPrice}}</span>
              <span v-show="addForm.goodsPrice">元</span>
            </el-form-item>
            <el-form-item label="应收金额">
              <span>{{deserveMoney}}</span>
              <span v-show="deserveMoney">元</span>
            </el-form-item>
            <el-form-item label="应收总金额">
              <span style="color:red;font-size:20px">{{addForm.sum}}</span>
              <span v-show="addForm.sum">元</span>
            </el-form-item>
            <el-form-item label="找零">
              <span>{{changeMoney}}</span>
              <span v-show="changeMoney">元</span>
            </el-form-item>
          </el-form-item>
        </el-form>
      </el-form>
    </el-col>

  </el-row>
</template>

<script>
  import axios from 'axios'
  import tebleItems from '@/assets/data/sales.json'
  import moment from 'moment'
  import checkToken from '@/token/checkToken'
  export default {
    data() {
      return {
        addForm: tebleItems.addform,
        goods: [],
        salesSumInfo: []
      }
    },
    methods: {
      handleGoodsSearch() {
        axios.post('api/goods/queryById', {
            goodsNo: this.addForm.goodsNo
          })
          .then(res => {
            let obj = Object.assign({}, res.data)
            this.addForm = Object.assign({}, obj[0])
            if (res.data.length === 0) {
              this.$message.warning('没有商品')
            }
          })
          .catch(err => console.log(err))
      },
      regret(row) {
        let index = this.goods.indexOf(row)
        this.addForm.sum -= row.deserveMoney
        this.goods.splice(index, 1)
      },
      addGoods() {
        if (!this.addForm.goodsNo) {
          this.$message.warning('请输入商品编号')
          return
        } else if (!this.addForm.goodsSalesCount) {
          this.$message.warning('请输入数量')
          return
        } else {
          this.addForm['deserveMoney'] = this.deserveMoney
          let sum = 0,
            salesCountSum = 0
          let temp = Object.assign({}, this.addForm)
          this.goods.push(temp)
          this.goods.forEach(el => sum += el.deserveMoney)
          this.goods.forEach(el => salesCountSum += parseInt(el.goodsSalesCount))
          this.addForm['sum'] = sum
          this.addForm['salesCountSum'] = salesCountSum
          this.addForm.goodsNo = ''
        }
      },
      addGoodsSalesSum() {
        this.goods.map(el => {
          axios.post('api/goodsSalesSum/queryById', {
              goodsNo: el.goodsNo
            })
            .then(res => {
              if (res.data.length === 0) {
                axios.post('api/goodsSalesSum/add', {
                    goodsNo: el.goodsNo,
                    goodsName: el.goodsName,
                    salesCount: el.goodsSalesCount,
                    salesMoney: el.deserveMoney,
                    goodsPrice: el.goodsPrice,
                    stockPrice: el.stockPrice,
                    salesProfit: el.deserveMoney - parseFloat(el.stockPrice) * parseInt(el.goodsSalesCount)
                  })
              } else {
                let oldCount = parseInt(res.data[0].salesCount)
                let oldMoney = parseFloat(res.data[0].salesMoney)
                let oldProfit = parseFloat(res.data[0].salesProfit)
                axios.post('api/goodsSalesSum/update', {
                    salesCount: oldCount + parseInt(el.goodsSalesCount),
                    salesMoney: oldMoney + parseInt(el.deserveMoney),
                    salesProfit: oldProfit + parseFloat(el.deserveMoney) - parseFloat(el.stockPrice) * parseInt(
                      el.goodsSalesCount),
                    goodsNo: el.goodsNo,
                  })
              }
            })
        })
      },
      addSales() {
         this.querySum()
        console.log(this.salesSumInfo)
          let salesNo = 1
          if (this.salesSumInfo.length === 0) {
            salesNo =1
          } else {
            salesNo = parseInt(this.salesSumInfo.pop().salesNo) + 1
          }
        this.goods.map(el => {
          axios.post('api/sales/add', {
            salesNo: salesNo,
            goodsNo: el.goodsNo,
            goodsName: el.goodsName,
            goodsPrice: el.goodsPrice,
            salesCount: el.goodsSalesCount,
            deserveMoney: el.deserveMoney,
            salesProfit: el.deserveMoney - parseFloat(el.stockPrice) * parseInt(el.goodsSalesCount)
          })
        })

      },
      addSalesSum() {
        let nameSet = new Set()
        let salesProfitSum = 0
        let salesCountSum = 0
        let salesMoneySum = 0
        this.goods.map(el => {
          nameSet.add(el.goodsName)
          salesCountSum += parseInt(el.goodsSalesCount)
          salesMoneySum += parseFloat(el.deserveMoney)
          salesProfitSum += el.deserveMoney - (parseFloat(el.stockPrice) * parseInt(el.goodsSalesCount))
        })
        let goodsGroup = [...nameSet].toString()
        let salesAddTime = moment().format('YYYY-MM-DD HH:mm')
        const editor=checkToken(localStorage.getItem('token'),'cysto').admName
        axios.post('api/salesSum/add', {
          goodsGroup: goodsGroup,
          reciveMoney: this.addForm.reciveMoney,
          changeMoney: this.changeMoney,
          salesCountSum: salesCountSum,
          salesMoneySum: salesMoneySum,
          salesProfitSum: salesProfitSum,
          salesAddTime: salesAddTime,
          editor:editor
        })
      },
      _handleChangeInv(goodsInv, goodsNo) {
        axios.post('api/inventory/update', {
          goodsInv: goodsInv,
          goodsNo: goodsNo
        }).catch(err => console.log(err))
      },
      _handleSearchInv(goodsNo, cb) {
        axios.post('api/inventory/queryById', {
            goodsNo: goodsNo
          }).then(cb)
          .catch(err => console.log(err))
      },
      reduceInv() {
        this.goods.map(el => {
          this._handleSearchInv(el.goodsNo, res => {
            let goodsInv = res.data[0].goodsInv - el.goodsSalesCount
            this._handleChangeInv(goodsInv, el.goodsNo)
          })
        })
      },
      addSubmit() {
        if (this.goods.length === 0) {
          this.$message.warning('请添加商品')
        }
        if (!this.addForm.reciveMoney) {
          this.$message.warning('请输入金额')
        } else {
          axios.all([this.addSales(), this.addSalesSum(), this.reduceInv()])
            .then(axios.spread(() => {
              this.addGoodsSalesSum()
              this.$message.success('添加成功')
              this.querySum()
              this.goods = []
              delete this.addForm.sum
              delete this.addForm.deserveMoney
              delete this.addForm.salesCountSum
              this.addForm = {
                goodsNo: "",
                goodsName: "",
                goodsPrice: 0,
                goodsSalesCount: 0,
                reciveMoney: 0,
                changeMoney: 0
              }
            }));
        }

      },
      querySum() {
        axios.get('api/salesSum/queryAll')
          .then(res => {
            this.salesSumInfo = res.data
            this.pageCount = Math.ceil(this.salesSumInfo.length / 10)
          })
          .catch(err => console.log(err))
      },
      clearForm() {
        this.addForm = {
            goodsNo: "",
            goodsName: "",
            goodsPrice: 0,
            goodsSalesCount: 0,
            reciveMoney: 0,
            changeMoney: 0
          },
          this.goods = []
      }
    },
    created() {
      this.querySum()
    },
    computed: {
      deserveMoney: {
        get: function () {
          return this.addForm.goodsPrice * this.addForm.goodsSalesCount
        },
        set: function () {}
      },
      changeMoney: {
        get: function () {
          let sum = 0
          this.goods.forEach(el => sum += el.deserveMoney)
          return this.addForm.reciveMoney - sum
        }
      },
    }
  }

</script>

<style>
  .grid {
    height: 20px;
  }

  .vvv {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin-top: 20px;
  }

  .vc {
    width: 48%;
  }

</style>
