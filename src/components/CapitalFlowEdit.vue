<template>
  <div>
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>资金流水</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/capital-flow' }">按月统计</el-breadcrumb-item>
        <el-breadcrumb-item>修改</el-breadcrumb-item>
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
          <el-select v-model="staff.uid" filterable clearable @change="handleStaffChange" placeholder="如果资金和内部员工相关">
            <el-option v-for="item in staffArr" :key="item.uid" :label="item.nickName" :value="item.uid">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="相关客户">
          <el-autocomplete v-model="customer.customerName" @select="handleCustomerSelect" :fetch-suggestions="getCustomer"
                           placeholder="如果资金和客户相关">
          </el-autocomplete>
        </el-form-item>
        <el-form-item label="非系统人员">
          <el-input v-model="otherName" placeholder="如果资金和非系统人员相关"></el-input>
        </el-form-item>
        <el-form-item label="交易金额">
          <el-input type="number" v-model="showMoney" placeholder="交易金额必填"></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="remarks"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="modify">立即修改</el-button>
          <el-button @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import router from '../router'
  export default {
    name: 'capitalFlowEdit',
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
        staff: {},
        customerArr: [],
        customer: {},
        otherName: null,
        money: null,
        remarks: null
      }
    },
    computed: {
      showMoney: {
        get: function () {
          return parseInt(this.money) / 100
        },
        set: function (nv) {
          this.money = parseInt(nv) * 100
        }
      }
    },
    created () {
      this.getCategory()
      this.getStaff()
    },
    methods: {
      cancel: function () {
        router.push({
          name: 'capitalFlow'
        })
      },
      modify () {
        let form = {
          id: this.$route.params.id,
          typeId: this.category[1],
          money: this.money,
          date: new Date(this.dateTime).getTime(),
          uid: this.staff.uid,
          nickName: this.staff.nickName,
          customerId: this.customer.customerId,
          customerName: this.customer.customerName,
          remarks: this.remarks,
          otherName: this.otherName,
          typeName: null
        }
        console.log(form)
        if (!form.typeId || !form.money || !form.date) {
          this.$message.error('填写信息不完整')
          return
        }
        this.$confirm('确定信息正确且完整？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
        }).then(() => {
          this.$http.post('/v2/aut/crm/capital/update', form).then(res => {
            console.log('修改资金流水', res)
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.$message({
                message: '恭喜你，修改资金流水成功',
                type: 'success'
              })
            }
          }).catch(res => {
            console.log('修改资金流水异常', res)
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
            this.getCapitalFlow()
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
      handleCategoryChange: function () {
        console.log('category', this.category)
      },
      handleStaffChange: function (item) {
        this.staff.uid = item
        this.staffArr.forEach((value) => {
          if (parseInt(value.uid) === parseInt(item)) {
            this.staff.nickName = value.nickName
          }
        })
        console.log('staff', this.staff)
      },
      handleCustomerSelect: function () {
        console.log('customer', this.customer)
      },
      getCapitalFlow: function () {
        this.$http.get('/v2/aut/crm/capital/details', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          console.log('获取资金流水详情', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.category = [null, res.body.data.typeId]
            this.categoryArr.forEach((value) => {
              value.children.forEach((v) => {
                if (parseInt(res.body.data.typeId) === parseInt(v.id)) {
                  this.category[0] = value.id
                }
              })
            })
            this.dateTime = res.body.data.date
            this.staff = {
              uid: res.body.data.headUid,
              nickName: res.body.data.headNickName
            }
            this.customer = {
              customerId: res.body.data.customerId,
              customerName: res.body.data.customerName
            }
            this.otherName = res.body.data.otherName
            this.money = res.body.data.money
            this.remarks = res.body.data.remarks
          }
        }).catch(res => {
          console.log('获取资金流水详情失败', res)
          this.$message.error('服务器繁忙')
        })
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
