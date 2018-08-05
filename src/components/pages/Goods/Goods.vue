<template>
  <div class="goods">
    <!-- 操作区 -->
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.goodsName" clearable @keydown.enter.native="handleKey" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.goodsNo" clearable @keydown.enter.native="handleKey" placeholder="请输入商品编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.goodsType" clearable @keydown.enter.native="handleKey" placeholder="请输入商品分类"></el-input>
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
              <el-button type="text" @click="handleMultiDel" size="mini">
                批量删除
              </el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" @click="handleMultiUse" size="mini">批量上架</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" @click="handleMultiStopUse" size="mini">批量下架</el-button>
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
    <el-table :data="goods" max-height="540" @selection-change="handleSelection" style="margin-top:-10px" v-loading="loading">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column type="expand" label="展开">
        <template slot-scope="props">
          <el-form inline label-width="100px">
            <el-form-item label="单位:">
              <span>{{props.row.goodsUnit}}</span>
            </el-form-item>
            <el-form-item label="供应商:">
              <span>{{props.row.supName}}</span>
            </el-form-item>
            <el-form-item label="添加时间">
              <span>{{props.row.goodsAddTime}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <template v-for="item in tableItems">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" width="95" sortable>
        </el-table-column>
      </template>
      <el-table-column prop="tag" label="状态" width="100" :filters="[{ text: '已上架', value: '已上架' }, { text: '已下架', value: '已下架' }]"
        :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.goodsState === '已上架' ? 'success':'danger'" close-transition>{{scope.row.goodsState}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="300">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button @click="handleDel(scope.row)" type="danger" size="mini">删除</el-button>
          <el-dropdown>
            <el-button type="warning" size="mini">审核</el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-if="scope.row.goodsState==='已上架'">
                <el-dropdown-item >
                <el-button type="text" @click="handleStopUse(scope.row)">下架</el-button>
              </el-dropdown-item>
              </template>
              <el-dropdown-item v-else>
                <el-button type="text" @click="handleUse(scope.row)">上架</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑框 -->
    <el-dialog title="编辑信息" :visible.sync="editVisible">
      <el-form :model="editForm" :inline="true" label-width="80px" :rules="rules" ref="editForm">
        <el-form-item label="商品名" prop="goodsName">
          <el-input v-model="editForm.goodsName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" prop="goodsType">
          <el-select v-model="editForm.goodsType"  placeholder="请选择">
            <el-option v-for="item in types" :key="item.goodsType" :value="item.goodsType" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="goodsUnit">
          <el-select v-model="editForm.goodsUnit" placeholder="请选择">
            <el-option v-for="item in units" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="goodsModel">
          <el-input v-model="editForm.goodsModel"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="goodsSpec">
          <el-input v-model="editForm.goodsSpec"></el-input>
        </el-form-item>
        <el-form-item label="进价" prop="stockPrice">
          <el-input v-model="editForm.stockPrice"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goodsPrice">
          <el-input v-model="editForm.goodsPrice"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supName">
          <el-select v-model="editForm.supName" placeholder="请选择">
            <el-option v-for="item in suppliers" :key="item.supName" :value="item.supName" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible=false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增框 -->
    <el-dialog title="添加信息" :visible.sync="addVisible">
      <el-form :model="addForm" :inline="true" label-width="80px" :rules="rules" ref="addForm">
        <el-form-item label="商品名" prop="goodsName">
          <el-input v-model="addForm.goodsName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="商品类型" prop="goodsType">
          <el-select v-model="addForm.goodsType" placeholder="请选择">
            <el-option v-for="item in types" :key="item.goodsType" :value="item.goodsType" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="单位" prop="goodsUnit">
          <el-select v-model="addForm.goodsUnit"  placeholder="请选择">
            <el-option v-for="item in units" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="型号" prop="goodsModel">
          <el-input v-model="addForm.goodsModel"></el-input>
        </el-form-item>
        <el-form-item label="规格" prop="goodsSpec">
          <el-input v-model="addForm.goodsSpec"></el-input>
        </el-form-item>
        <el-form-item label="进价" prop="stockPrice">
          <el-input v-model="addForm.stockPrice"></el-input>
        </el-form-item>
        <el-form-item label="价格" prop="goodsPrice">
          <el-input v-model="addForm.goodsPrice"></el-input>
        </el-form-item>
        <el-form-item label="供应商" prop="supName">
          <el-select v-model="addForm.supName" placeholder="请选择">
            <el-option v-for="item in suppliers" :key="item.supName" :value="item.supName" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<style>
  .avatar {
    font-size: 12px;
  }
</style>
<script>
  import tableItems from '@/assets/data/goods.json'
  import axios from 'axios'
  import cities from '@/assets/city/cities.json'
  import moment from 'moment'
  export default {
    name: 'goods',
    data() {
      return {
        tableItems: tableItems.tableColumn,
        goods: [],
        suppliers:[],
        loading: false,
        pageCount: 0,
        page: 0,
        multipleSelection: [],
        filters: {
          goodsNo: '',
          goodsName: '',
          goodsType:''
        },
        units: tableItems.units,
        types: [],
        editVisible: false,
        addVisible: false,
        rules: tableItems.rules,
        editForm: tableItems.editform,
        addForm: tableItems.addform,
        CityInfo: cities, //地区数据
        option: {
          edit: {
            addrCity: [],
            addrDetail: ''
          },
          add: {
            addrCity: [],
            addrDetail: ''
          },
        },
      }
    },
    methods: {
      filterTag(value, row) {
        return row.goodsState === value;
      },
      _stateChange(state, goodsNo, cb) {
        axios.post('api/goods/stateChange', {
            goodsState: state,
            goodsNo: goodsNo
          }).then(cb)
          .catch(err => console.log(err))
      },
      handleUse(row) {
        this.editForm = Object.assign({}, row);
        this._stateChange('已上架', this.editForm.goodsNo, res => {
          this.$message.success('已上架')
          this.queryAll()
        })
      },
      handleStopUse(row) {
        this.editForm = Object.assign({}, row);
        this._stateChange('已下架', this.editForm.goodsNo, res => {
          this.$message.success('已下架')
          this.queryAll()
        })
      },
      _multiStateChange(state, cb) {
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择')
        } else {
          let multi = this.multipleSelection
          let goodsNo = multi.map(el => el.goodsNo)
          axios.post('api/goods/multiStateChange', {
              goodsState: state,
              goodsNo: goodsNo
            })
            .then(cb)
            .catch(err => console.log(err))
        }
      },
      handleMultiUse() {
        this._multiStateChange('已上架', res => {
          this.$message.success('已上架')
          this.queryAll()
        })
      },
      handleMultiStopUse() {
        this._multiStateChange('已下架', res => {
          this.$message.success('已下架')
          this.queryAll()
        })
      },
      handleSelection(val) {
        this.multipleSelection = val
      },
     
      handleMultiDel(val) {
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择')
        } else {let multi = this.multipleSelection
          this.$confirm('你确定？', '提示', {}).then(() => {
              
              let goodsNo = multi.map(el => el.goodsNo)
              axios.post('api/goods/multiDel', {
                  goodsNo: goodsNo
                })
                .then(res => {
                  this.$message.success('删除成功');
                  multi.map(el => {
                    let i = this.goods.indexOf(el);
                    this.goods.splice(i, 1);
                  })
                  this.loading = true
                  this.queryAll()
                  this.loading = false
                })
                .catch(err => console.log(err))
            })
            .catch(() => {
              this.$message.info('删除取消')
            })
        }
      },
      filterHandler(value, row, column) {
        const property = column['property'];
        return row[property] === value;
      },
      queryAll() {
        axios.get('api/goods/queryAll')
          .then(res => {
            this.goods = res.data
            this.pageCount = Math.ceil(this.goods.length / 10)
          })
          .catch(err => console.log(err))
      },
      queryUsedTypes() {
        axios.get('api/types/queryUsedTypes')
          .then(res => {
            this.types = res.data
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
      handleSearch() {
        if (!this.filters.goodsName && !this.filters.goodsNo &&!this.filters.goodsType) {
          this.$message.warning('请输入关键字')
          this.queryAll()
        }
        if (!this.filters.goodsName) {
          this.filters.goodsName =null
        }
        if (!this.filters.goodsType) {
          this.filters.goodsType=null
        }
        // if (!this.filters.goodsNo && this.filters.goodsName ===null) {
        //   this.queryAll()
        // }
        // if (!this.filters.goodsNo && this.filters.goodsType===null) {
        //   this.queryAll()
        // }
        axios.post('api/goods/queryByName', {
            goodsNo: this.filters.goodsNo,
            goodsName: this.filters.goodsName,
            goodsType:this.filters.goodsType
          })
          .then(res => {
            this.goods = res.data
          })
          .catch(err => console.log(err))
      },
      handleKey() {
        this.handleSearch()
      },
      handleAdd() {
        this.addVisible = true;
        this.queryUsedSup()
        this.queryUsedTypes()
      },
      handleReflash() {
        this.loading = true
        this.queryAll()
        this.filters.goodsName = ''
        setTimeout(() => {
          this.loading = false
        }, 1000)
      },
      handleEdit(row) {
        this.editVisible = true;
        this.queryUsedSup()
        this.queryUsedTypes()
        this.editForm = Object.assign({}, row);
      },
      editSubmit() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.$confirm('你确定？', '提示', {}).then(() => {
                let params = Object.assign({}, this.editForm);
                let goodsAddTime = moment().format('YYYY-MM-DD HH:mm')
                axios.post('api/goods/update', {
                  goodsName: params.goodsName,
                    goodsType: params.goodsType,
                    goodsUnit: params.goodsUnit,
                    goodsModel: params.goodsModel,
                    goodsSpec: params.goodsSpec,
                    stockPrice:params.stockPrice,
                    goodsPrice: params.goodsPrice,
                    supName: params.supName,
                    goodsAddTime: goodsAddTime,
                    goodsNo: params.goodsNo
                  }).then(res => {
                    this.$message.success('提交成功')
                    this.editVisible = false
                    this.queryAll()
                    let page = Math.ceil(this.page / 10) + 1
                    this.handleCurrentChange(page)
                  })
                  .catch(err => console.log(err))
              })
              .catch(() => {
                this.$message.info('提交已取消')
              })
          }
        })
      },
      addSubmit() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let params = Object.assign({}, this.addForm);
            let goodsAddTime = moment().format('YYYY-MM-DD HH:mm')
            axios.post('api/goods/add', {
              goodsName: params.goodsName,
                goodsType: params.goodsType,
                goodsUnit: params.goodsUnit,
                goodsModel: params.goodsModel,
                goodsSpec: params.goodsSpec,
                stockPrice:params.stockPrice,
                goodsPrice: params.goodsPrice,
                supName: params.supName,
                goodsAddTime: goodsAddTime
              }).then(res => {
                this.$message.success('添加成功')
                this.addForm = {
                  goodsName: '',
                  goodsType: '',
                  goodsUnit: '',
                  goodsModel: '',
                  goodsSpec: '',
                  goodsPrice: '',
                  supName: ''
                }
                this.addVisible = false
                this.queryAll()
                let page = Math.ceil(this.page / 10) + 1
                this.handleCurrentChange(page)
              })
              .catch(err => console.log(err))
          }
        })
      },
      handleDel(row) {
        this.$confirm('删除该记录，确定？', '提示', {
            type: 'warning'
          }).then(() => {
            axios.post('api/goods/del', {
                goodsNo: row.goodsNo
              }).then(res => {
                let index = this.goods.indexOf(row);
                this.goods.splice(index, 1);
                this.$message.success('删除成功')
                this.loading = true
                this.queryAll()
                setTimeout(() => {
                  this.loading = false
                }, 1000)
                let page = Math.ceil(this.page / 10) + 1
                this.handleCurrentChange(page)
              })
              .catch(err => console.log(err))
          })
          .catch(() => {
            this.$message.info('删除已取消')
          })
      },
      handleCurrentChange(val) {
        this.page = (val - 1) * 10
        axios.post('/api/goods/pagination', {
            page: (val - 1) * 10
          }).then(res => {
            this.goods = res.data
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
