<template>
  <div class="inventory">
    <!-- 操作区 -->
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.goodsName" clearable @keydown.enter.native="handleKey" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.goodsNo" clearable @keydown.enter.native="handleKey" placeholder="请输入商品编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch" size="mini">
          <i class="el-icon-search"></i>查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-pagination @current-change="handleCurrentChange" background layout="prev, pager,next" :page-count="pageCount">
        </el-pagination>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="inventory" max-height="540" style="margin-top:-10px" >
      <template v-for="item in tableItems">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" width="200" sortable>
        </el-table-column>
      </template>
      <el-table-column prop="tag" label="状态" width="100" :filters="[{ text: '充足', value: '充足' },
        { text: '库存不足', value: '库存不足' },
        { text: '售罄', value: '售罄' }]" :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <template v-if="scope.row.goodsInv >=50">
            <el-tag type="success" close-transition>充足</el-tag>
          </template>
          <template v-else-if="scope.row.goodsInv>0&&scope.row.goodsInv<50">
<el-tag type="danger" close-transition>库存不足</el-tag>
          </template>
          <el-tag v-else type="info" close-transition>售罄</el-tag>
        </template>
      </el-table-column >
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button v-show="scope.row.goodsInv>=0&&scope.row.goodsInv<50||scope.row.goodsInv <= 0" type="danger" plain size="mini" @click="toStock">去进货</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import tableItems from '@/assets/data/inventory.json'
  import axios from 'axios'
  export default {
    name: 'goods',
    data() {
      return {
        tableItems: tableItems.tableColumn,
        inventory: [],
        pageCount: 0,
        page: 0,
        loading: false,
        filters: {
          goodsNo: '',
          goodsName: ''
        },
      }
    },
    methods: {
      filterTag(value, row) {
        return row.goodsInv === value;
      },
      queryAll() {
        axios.get('api/inventory/queryAll')
          .then(res => {
            this.inventory = res.data
            this.pageCount = Math.ceil(this.inventory.length / 10)
          })
          .catch(err => console.log(err))
      },
      handleSearch() {
        if (!this.filters.goodsName && !this.filters.goodsNo) {
          this.$message.warning('请输入关键字')
          this.queryAll()
        }
        if (!this.filters.goodsName) {
          this.filters.goodsName = ' '
        }
        if (!this.filters.goodsNo && this.filters.goodsName == ' ') {
          this.queryAll()
        }
        axios.post('api/inventory/queryByName', {
            goodsNo: this.filters.goodsNo,
            goodsName: this.filters.goodsName.trim()
          })
          .then(res => {
            this.inventory = res.data
          })
          .catch(err => console.log(err))
      },
      handleKey() {
        this.handleSearch()
      },
      toStock(){
        this.$router.push('stock')
      },
      handleCurrentChange(val) {
        this.page = (val - 1) * 10
        axios.post('/api/inventory/pagination', {
            page: (val - 1) * 10
          }).then(res => {
            this.inventory = res.data
          })
          .catch(err => console.log(err))
      }
    },
    created() {
      this.queryAll()
      this.handleCurrentChange(1)
    },
  }

</script>
