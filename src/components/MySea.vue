<template>
  <div class="mySea">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客户</el-breadcrumb-item>
        <el-breadcrumb-item>我的公海</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-select v-model="state" placeholder="所有客户状态" @change="stateChange">
          <el-option label="全部" value="0"></el-option>
          <el-option label="新建" value="1"></el-option>
          <el-option label="拒绝" value="2"></el-option>
          <el-option label="未回应" value="3"></el-option>
          <el-option label="初步了解" value="4"></el-option>
          <el-option label="意向" value="5"></el-option>
          <el-option label="重点维护" value="6"></el-option>
          <el-option label="签约" value="7"></el-option>
        </el-select>
        <el-input placeholder="搜索关键词" icon="search" v-model="keywords" :on-icon-click="search"></el-input>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData">
        <el-table-column prop="customerName" label="平台名称"></el-table-column>
        <el-table-column prop="cityCodeName" label="地区"></el-table-column>
        <el-table-column prop="mainPerson" label="平台负责人"></el-table-column>
        <el-table-column prop="mainPhoneNumber" label="电话"></el-table-column>
        <el-table-column prop="mainWeChat" label="微信号"></el-table-column>
        <el-table-column prop="signType" label="客户类型" :formatter="customerTypeFormatter" ></el-table-column>
        <el-table-column prop="remarks" label="备注" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" :formatter="dateFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="lastOperTime" label="操作时间" :formatter="dateFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作及状态">
          <template scope="scope">
            <el-button type="text" @click="regain(scope)" v-if="scope.row.applyStatus==0">申请重领</el-button>
            <span class="status" v-if="scope.row.applyStatus==1">待审核</span>
            <span class="status" v-if="scope.row.applyStatus==2">一个月</span>
            <span class="status" v-if="scope.row.applyStatus==3">两个月</span>
            <span class="status" v-if="scope.row.applyStatus==4">三个月</span>
            <span class="status" v-if="scope.row.applyStatus==5">被拒绝</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-show="pageCount>1">
      <el-pagination @current-change="pageIndexChange" :current-page="currentPage" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'mySea',
    data () {
      return {
        tableData: [],
        state: null,
        keywords: '',
        currentPage: 1,
        pageSize: 15,
        total: null,
        pageCount: 0
      }
    },
    methods: {
      stateChange () {
        this.currentPage = 1
        this.getTableData()
      },
      getTableData () {
        this.loading = false
        this.$http.get('/v1/aut/crm/my/public/customer', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage,
            search: this.keywords,
            status: this.state
          }
        }).then(res => {
          console.log('获取我的客户列表', res)
          this.loading = false
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.tableData = res.body.data.data
            this.total = res.body.data.rowCount
            this.pageCount = res.body.data.pageCount
          }
        }).catch(res => {
          console.log('获取我的客户列表异常', res)
          this.loading = false
          this.$message.error('服务器繁忙！')
        })
      },
      search () {
        this.currentPage = 1
        this.getTableData()
      },
      pageIndexChange (val) {
        this.currentPage = val
        this.getTableData()
      },
      customerTypeFormatter (row) {
        if (row.signType === 1) {
          return '站长'
        } else if (row.signType === 2) {
          return '代理商'
        } else if (row.signType === 0) {
          return '无'
        }
      },
      dateFormat (row) {
        if (row.createDate) {
          return moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return ''
        }
      },
      regain (scope) {
        this.$confirm('确认申请重领该客户?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(scope)
          this.$http.post('/v1/aut/customer/apply', {
            customerId: scope.row.id
          }).then((res) => {
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.$message({
                message: '恭喜你，操作成功',
                type: 'success'
              })
              this.getTableData()
            }
          }).catch((res) => {
            this.$message.error('服务器繁忙！')
          })
        }).catch(() => {})
      }
    },
    created () {
      this.getTableData()
    }
  }
</script>

<style lang="scss" scoped>
  .mySea{
    .breadcrumb{
      padding: 20px;
      background: #fbfbfb;
    }
    .filter{
      margin-top: 15px;
      padding: 0 20px;
      .el-input{
        width: auto;
      }
      &:after{
        content: "";
        display: block;
        height: 0;
        width: 0;
        overflow: hidden;
        visibility: hidden;
        clear: both;
      }
      .l{
        float: left;
      }
      .r{
        float: right;
        .select-count{
          font-size: 14px;
          color: #333333;
          margin-right: 10px;
          b{
            color: #4db3ff;
          }
        }
      }
    }
    .main{
      padding: 0 20px;
      overflow: auto;
      margin-top: 15px;
      .status{
        color: #666;
      }
    }
    .pagination{
      padding:20px;
      text-align: right;
    }
  }
</style>
