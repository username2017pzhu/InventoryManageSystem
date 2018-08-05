<template>
  <div class="employee">
    <!-- 操作区 -->
    <el-form :inline="true" :model="filters">
      <el-form-item>
        <el-input v-model="filters.empName" clearable @keydown.enter.native="handleKey" placeholder="请输入关键字"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input v-model="filters.empNo" clearable @keydown.enter.native="handleKey" placeholder="请输入员工编号"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleSearch">
          <i class="el-icon-search"></i>查询</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" size="mini" @click="handleAdd">
          <i class="el-icon-plus"></i>新增</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="danger" size="mini" @click="handleMultiDel">
          <i class="el-icon-delete"></i> 批量删除</el-button>
      </el-form-item>
      <el-form-item size="mini">
        <el-pagination @current-change="handleCurrentChange" background layout="prev, pager,next" :page-count="pageCount">
        </el-pagination>
      </el-form-item>
    </el-form>
    <!-- 表格 -->
    <el-table :data="users" max-height="540" @selection-change="handleSelection" style="margin-top:-10px" v-loading="loading">
      <el-table-column type="selection">
      </el-table-column>
      <el-table-column type="expand" label="展开">
        <template slot-scope="props">
          <el-form inline label-width="100px">
            <el-form-item label="生日:">
              <span>{{props.row.empBirthday}}</span>
            </el-form-item>
            <el-form-item label="身份证:">
              <span>{{props.row.empIdCard}}</span>
            </el-form-item>
            <el-form-item label="家庭住址:">
              <span>{{props.row.empAddress}}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <template v-for="item in tableItems">
        <el-table-column :key="item.prop" :prop="item.prop" :label="item.label" :width="item.width" sortable>
        </el-table-column>
      </template>
      <el-table-column prop="tag" label="状态" width="100" :filters="[{ text: '离职', value: '离职' }, { text: '就职', value: '就职' }]"
        :filter-method="filterTag" filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag :type="scope.row.empState === '就职' ? 'success':'danger'" close-transition>{{scope.row.empState}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button @click="handleDel(scope.row)" type="danger" size="mini">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 编辑框 -->
    <el-dialog title="编辑信息" :visible.sync="editVisible">
      <el-form :model="editForm" :inline="true" label-width="80px" :rules="rules" ref="editForm">
        <el-form-item label="姓名" prop="empName">
          <el-input v-model="editForm.empName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="empAge">
          <el-input v-model="editForm.empAge" :min="0" :max="100"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="empSex">
          <el-select v-model="editForm.empSex" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证" prop="empIdCard">
          <el-input v-model="editForm.empIdCard"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="empTel">
          <el-input v-model="editForm.empTel"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="empQQ">
          <el-input v-model="editForm.empQQ"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="empBirthday">
          <el-date-picker v-model="editForm.empBirthday" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入职时间" prop="empEntryDate">
          <el-date-picker v-model="editForm.empEntryDate" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="家庭住址" prop="empAddress">
          <el-input v-model="editForm.empAddress"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="editVisible=false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 新增框 -->
    <el-dialog title="新增信息" :visible.sync="addVisible">
      <el-form :model="addForm" :inline="true" label-width="80px" :rules="rules" ref="addForm">
        <el-form-item label="姓名" prop="empName">
          <el-input v-model="addForm.empName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="年龄" prop="empAge">
          <el-input v-model="addForm.empAge" :min="0" :max="100"></el-input>
        </el-form-item>
        <el-form-item label="性别" prop="empSex">
          <el-select v-model="addForm.empSex" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="身份证" prop="empIdCard">
          <el-input v-model="addForm.empIdCard"></el-input>
        </el-form-item>
        <el-form-item label="电话" prop="empTel">
          <el-input v-model="addForm.empTel"></el-input>
        </el-form-item>
        <el-form-item label="QQ" prop="empQQ">
          <el-input v-model="addForm.empQQ"></el-input>
        </el-form-item>
        <el-form-item label="生日" prop="empBirthday">
          <el-date-picker v-model="addForm.empBirthday" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入职时间" prop="empEntryDate">
          <el-date-picker v-model="addForm.empEntryDate" type="date" placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="家庭住址" prop="empAddress">
          <el-cascader :options="CityInfo" v-model="option.add.addrCity" :change-on-select="true" :clearable="true" :filterable="true">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细住址" placeholder="街道/小区">
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
  import tableItems from '@/assets/data/employee.json'
  import cities from '@/assets/city/cities.json'
  import moment from 'moment'
  import {
    setTimeout
  } from 'timers';
  export default {
    name: 'employee',
    data() {
      return {
        tableItems: tableItems.tableColumn,
        users: [],
        loading: false,
        pageCount: 0,
        page: 0,
        multipleSelection: [],
        filters: {
          empNo: '',
          empName: ''
        },
        options: [{
          value: '男',
          label: '男'
        }, {
          value: '女',
          label: '女'
        }],
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
        return row.empState === value;
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
              let empNo = multi.map(el => el.empNo)
              axios.post('api/employee/multiDel', {
                  empNo: empNo
                })
                .then(res => {
                  this.$message.success('删除成功');
                  multi.forEach(el => {
                    let i = this.users.indexOf(el);
                    this.users.splice(i, 1);
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
        axios.get('api/employee/queryAll')
          .then(res => {
            this.users = res.data
            this.pageCount = Math.ceil(this.users.length / 10)
          })
          .catch(err => console.log(err))
      },
      handleSearch() {
        if (!this.filters.empName && !this.filters.empNo) {
          this.$message.warning('请输入关键字')
          this.queryAll()
        }
        if (!this.filters.empName) {
          this.filters.empName = null
        }
        if (!this.filters.empNo && this.filters.empName === null) {
          this.queryAll()
        }
        axios.post('api/employee/queryByName', {
            empNo: this.filters.empNo,
            empName: this.filters.empName
          })
          .then(res => {
            this.users = res.data
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
        this.filters.empName = ''
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
            let params = Object.assign({}, this.editForm);
            axios.post('api/employee/update', {
                empName: params.empName,
                empAge: params.empAge,
                empSex: params.empSex,
                empBirthday: moment(params.empBirthday).format('YYYY-MM-DD'),
                empIdCard: params.empIdCard,
                empTel: params.empTel,
                empQQ: params.empQQ,
                empAddress: params.empAddress,
                empEntryDate: moment(params.empEntryDate).format('YYYY-MM-DD'),
                empNo: params.empNo
              })
              .then(res => {
                this.$message.success('提交成功')
                this.editVisible = false
                this.option.edit.addrCity = [],
                  this.queryAll()
                let page = Math.ceil(this.page / 10) + 1
                this.handleCurrentChange(page)
              })
              .catch(err => console.log(err))
          }
        })
      },
      addSubmit() {
        this.$refs.addForm.validate(valid => {
          if (valid) {
            let params = Object.assign({}, this.addForm)
            axios.post('api/employee/add', {
                empName: params.empName,
                empAge: params.empAge,
                empSex: params.empSex,
                empBirthday: moment(params.empBirthday).format('YYYY-MM-DD'),
                empIdCard: params.empIdCard,
                empTel: params.empTel,
                empQQ: params.empQQ,
                empAddress: this.option.add.addrCity.toString().replace(/,/g, ' ') + this.option.add.addrDetail,
                empEntryDate: moment(params.empEntryDate).format('YYYY-MM-DD')
              })
              .then(res => {
                this.$message.success('添加成功')
                this.addForm = {
                  empName: '',
                  empAge: '',
                  empSex: '',
                  empBirthday: '',
                  empIdCard: '',
                  empTel: '',
                  empQQ: '',
                  empAddress: '',
                  empEntryDate: ''
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
            axios.post('api/employee/del', {
                empNo: row.empNo
              })
              .then(res => {
                let index = this.users.indexOf(row);
                this.users.splice(index, 1);
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
        axios.post('/api/employee/pagination', {
            page: (val - 1) * 10
          })
          .then(res => {
            this.users = res.data
          })
          .catch(err => console.log(err))
      }
    },
    created() {
      setTimeout(this.queryAll(), 100)
      setTimeout(this.handleCurrentChange(1), 100)

    },
  }

</script>
