<template>
  <div class="supplier">
    <!-- 操作区 -->
    <el-form :inline="true" :model="filters">
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
              <el-button type="text" @click="handleMultiUse" size="mini">批量启用</el-button>
            </el-dropdown-item>
            <el-dropdown-item>
              <el-button type="text" @click="handleMultiStopUse" size="mini">批量停用</el-button>
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
    <el-table :data="suppliers" max-height="540" @selection-change="handleSelection" style="margin-top:-10px" v-loading="loading">
      <el-table-column type="selection">
      </el-table-column>
      <template v-for="item in tableItems">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" sortable>
        </el-table-column>
      </template>
      <el-table-column prop="tag" label="状态" width="100" :filters="[{ text: '已停用', value: '已停用' }, { text: '已启用', value: '已启用' }]"
        :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.supState === '已启用' ? 'success':'danger'" close-transition>{{scope.row.supState}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="210">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button @click="handleDel(scope.row)" type="danger" size="mini">删除</el-button>
          <el-dropdown>
            <el-button type="warning" size="mini">审核</el-button>
            <el-dropdown-menu slot="dropdown">
              <template v-if="scope.row.supState === '已启用'">
                <el-dropdown-item>
                  <el-button type="text" @click="handleStopUse(scope.row)">停用</el-button>
                </el-dropdown-item>
              </template>
              <el-dropdown-item v-else>
                <el-button type="text" @click="handleUse(scope.row)">启用</el-button>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑框 -->
    <el-dialog title="编辑信息" :visible.sync="editVisible">
      <el-form :model="editForm" :inline="true" label-width="80px" :rules="rules" ref="editForm">
        <el-form-item label="供应商名" prop="supName">
          <el-input v-model="editForm.supName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="法人" prop="supLawyer">
          <el-input v-model="editForm.supLawyer" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="supTel">
          <el-input v-model="editForm.supTel"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="supAddress">
          <el-input v-model="editForm.supAddress"></el-input>
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
        <el-form-item label="供应商名" prop="supName">
          <el-input v-model="addForm.supName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="法人" prop="supLawyer">
          <el-input v-model="addForm.supLawyer" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="supTel">
          <el-input v-model="addForm.supTel"></el-input>
        </el-form-item>
        <el-form-item label="公司地址" prop="supAddress">
          <el-cascader :options="CityInfo" v-model="option.add.addrCity" :change-on-select="true" :clearable="true" :filterable="true">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" placeholder="街道/小区">
          <el-input v-model="option.add.addrDetail"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addVisible=false">取 消</el-button>
        <el-button type="primary" @click="addSubmit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import axios from 'axios'
  import tableItems from '@/assets/data/supplier.json'
  import cities from '@/assets/city/cities.json'
  export default {
    name: 'employee',
    data() {
      return {
        tableItems: tableItems.tableColumn,
        checked: true,
        suppliers: [],
        loading: false,
        pageCount: 0,
        page: 0,
        multipleSelection: [],
        loading: false,
        filters: {
          supNo:'',
          supName: ''
        },
        editVisible: false,
        addVisible: false,
        rules: tableItems.rules,
        editForm: tableItems.editform,
        addForm: tableItems.addform,
        CityInfo: cities,
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
        return row.supState === value;
      },
      _stateChange(state, supNo, cb) {
        axios.post('api/supplier/stateChange', {
            supState: state,
            supNo: supNo
          }).then(cb)
          .catch(err => console.log(err))
      },
      handleUse(row) {
        this.editForm = Object.assign({}, row);
        this._stateChange('已启用', this.editForm.supNo, res => {
          this.$message.success('已启用')
          this.queryAll()
        })
      },
      handleStopUse(row) {
        this.editForm = Object.assign({}, row);
        this._stateChange('已停用', this.editForm.supNo, res => {
          this.$message.success('已停用')
          this.queryAll()
        })
      },
      _multiStateChange(state, cb) {
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择')
        } else {
          let multi = this.multipleSelection
          let supNo = multi.map(el => el.supNo)
          axios.post('api/supplier/multiStateChange', {
              supState: state,
              supNo: supNo
            })
            .then(cb)
            .catch(err => console.log(err))
        }
      },
      handleMultiUse() {
        this._multiStateChange('已启用', res => {
          this.$message.success('已启用')
          this.queryAll()
        })
      },
      handleMultiStopUse() {
        this._multiStateChange('已停用', res => {
          this.$message.success('已停用')
          this.queryAll()
        })
      },
      handleSelection(val) {
        this.multipleSelection = val
      },
      handleMultiDel() {
        if (this.multipleSelection.length == 0) {
          this.$message.warning('请选择')
        } else {
          this.$confirm('你确定？', '提示', {}).then(() => {
              let multi = this.multipleSelection
              let supNo = multi.map(el => el.supNo)
              axios.post('api/supplier/multiDel', {
                  supNo: supNo
                })
                .then(res => {
                  this.$message.success('删除成功');
                  multi.forEach(el => {
                    let i = this.suppliers.indexOf(el);
                    this.suppliers.splice(i, 1);
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
        axios.get('api/supplier/queryAll')
          .then(res => {
            this.suppliers = res.data
            this.pageCount = Math.ceil(this.suppliers.length / 10)
          })
          .catch(err => console.log(err))
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
            supNo: this.filters.supNo,
            supName: this.filters.supName
          })
          .then(res => {
            this.suppliers = res.data
          })
          .catch(err => console.log(err))
      },
      handleKey() {
        this.handleSearch()
      },
      handleAdd() {
        this.addVisible = true;
      },
      handleReflash() {
        this.loading = true
        this.queryAll()
        this.filters.supName = ''
        setTimeout(() => {
          this.loading = false
        }, 1000)
      },
      handleEdit(row) {
        this.editVisible = true;
        this.editForm = Object.assign({}, row);
      },
      editSubmit() {
        this.$refs.editForm.validate(valid => {
          if (valid) {
            this.$confirm('你确定？', '提示', {}).then(() => {
                let params = Object.assign({}, this.editForm);
                axios.post('api/supplier/update', {
                    supName: params.supName,
                    supLawyer: params.supLawyer,
                    supTel: params.supTel,
                    supAddress: params.supAddress,
                    supNo: params.supNo
                  })
                  .then(res => {
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
            axios.post('api/supplier/add', {
                supName: params.supName,
                supLawyer: params.supLawyer,
                supTel: params.supTel,
                supAddress: this.option.add.addrCity.toString().replace(/,/g, ' ') + this.option.add.addrDetail,
              })
              .then(res => {
                this.$message.success('添加成功')
                this.addForm = {
                  supName: '',
                  supLawyer: '',
                  supTel: '',
                  supAddress: '',
                }
                this.option.add.addrCity = []
                this.option.add.addrDetail = ''
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
            axios.post('api/supplier/del', {
                supNo: row.supNo
              })
              .then(res => {
                let index = this.suppliers.indexOf(row);
                this.suppliers.splice(index, 1);
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
        axios.post('/api/supplier/pagination', {
            page: (val - 1) * 10
          })
          .then(res => {
            this.suppliers = res.data
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
