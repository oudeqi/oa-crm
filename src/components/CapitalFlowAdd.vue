<template>
  <div>
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>资金流水</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/capital-flow' }">按月统计</el-breadcrumb-item>
        <el-breadcrumb-item>新增</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-form label-width="100px">
        <el-form-item label="交易类目">
          <el-cascader expand-trigger="hover" :options="categoryArr" :show-all-levels="true" v-model="category"
                       @change="handleCategoryChange" :props="{value:'id',label:'name',children:'data'}" placeholder="请选择交易类目">
          </el-cascader>
        </el-form-item>
        <el-form-item label="交易日期">
          <el-date-picker style="width: 100%;" v-model="dateTime" type="datetime" placeholder="选择日期时间"
                          align="right" :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="相关员工">
          <el-select v-model="staff" filterable clearable @change="handleStaffChange" placeholder="如果资金和内部员工相关">
            <el-option v-for="item in staffArr" :key="item.uid" :label="item.nickName" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="相关客户">
          <el-autocomplete v-model="form.customerName" @select="handleCustomerSelect" :fetch-suggestions="getCustomer"
                           placeholder="如果资金和客户相关">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="非系统人员">
          <el-input v-model="form.otherName" placeholder="如果资金和非系统人员相关"></el-input>
        </el-form-item>
        <el-form-item label="交易金额">
          <el-input type="number" v-model="money" placeholder="交易金额必填"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="form.remarks"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">立即新增</el-button>
          <el-button>取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'capitalFlowAdd',
    data () {
      return {
        pickerOptions: {
          shortcuts: [{
            text: '今天',
            onClick (picker) {
              picker.$emit('pick', new Date())
            }
          }, {
            text: '昨天',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24)
              picker.$emit('pick', date)
            }
          }, {
            text: '一周前',
            onClick (picker) {
              const date = new Date()
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
              picker.$emit('pick', date)
            }
          }]
        },
        categoryArr: [],
        category: null,
        dateTime: null,
        staffArr: [],
        staff: null,
        customerArr: [],
        money: null,
        form: {
          typeId: null,
          typeName: null,
          createDate: null,
          uid: null,
          nickName: null,
          customerId: null,
          customerName: null,
          otherName: null,
          money: null,
          date: null,
          remarks: null
        }
      }
    },
    watch: {
      customerArr: function () {
        if (this.customerArr.length === 0) {
          this.form.customerId = null
          this.form.customerName = null
        }
      },
      dateTime: function () {
        this.form.date = new Date(this.dateTime).getTime()
        console.log(this.form.date)
      },
      money: function () {
        console.log(this.money)
        this.form.money = this.money * 100
      }
    },
    created () {
      this.getCategory()
      this.getStaff()
    },
    methods: {
      onSubmit () {
        console.log(this.form)
        if (!this.form.typeId || !this.form.money || !this.form.date) {
          this.$message.error('填写信息不完整')
          return
        }
        this.$confirm('确定信息正确且完整？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.$http.post('/v2/aut/crm/capital/add', this.form).then(res => {
            console.log('添加资金流水', res)
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.$message({
                message: '恭喜你，添加资金流水成功',
                type: 'success'
              })
            }
          }).catch(res => {
            console.log('添加资金流水异常', res)
            this.$message.error('服务器繁忙！')
          })
        }).catch(() => {})
      },
      getCategory: function () {
        this.$http.get('/v2/crm/capital/type/list').then(res => {
          console.log('获取收支类目', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            res.body.data.forEach((value) => {
              value.id = value.type
            })
            this.categoryArr = res.body.data
          }
        }).catch(res => {
          console.log('获取收支类目异常', res)
          this.$message.error('服务器繁忙！')
        })
      },
      getStaff: function () {
        this.$http.get('/v2/aut/crm/user/list', {
          params: {
            pageSize: 10000,
            pageIndex: 1
          }
        }).then(res => {
          console.log('获取员工列表', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.staffArr = res.body.data.data
          }
        }).catch(res => {
          console.log('获取员工列表异常', res)
          this.$message.error('服务器繁忙！')
        })
      },
      getCustomer: function (queryString, cb) {
        this.$http.get('/v1/aut/crm/customer/search', {
          params: {
            search: queryString
          }
        }).then(res => {
          console.log('搜索平台', res)
          if (res.body.errMessage) {
            cb([])
          } else {
            this.customerArr = res.body.data
            res.body.data.forEach((value) => {
              value.value = value.customerName + ''
            })
            this.customerArr = res.body.data
            cb(this.customerArr)
          }
        }).catch(res => {
          console.log('搜索平台失败', res)
          cb([])
        })
      },
      handleCategoryChange: function (item) {
        console.log(item)
        this.form.typeId = item[1]
      },
      handleStaffChange: function (item) {
        console.log(item)
        this.form.uid = item.uid
        this.form.nickName = item.nickName
      },
      handleCustomerSelect: function (item) {
        console.log(item)
        this.form.customerId = item.id
        this.form.customerName = item.customerName
      }
    }
  }
</script>

<style lang="scss" scoped>

  .breadcrumb{
    padding: 20px;
    background: #fbfbfb;
  }

  .el-select, .el-cascader, .el-date-picker, .el-autocomplete{
    width: 100%;
  }

  .line{
    text-align: center;
  }

  .main{
    padding: 0 20px;
    padding-left: 40px;
    overflow: auto;
    margin-top: 30px;
    max-width: 500px;
  }

</style>
