<template>
  <div class="myCustomer">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客户</el-breadcrumb-item>
        <el-breadcrumb-item>签约申请</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-select v-model="state" placeholder="审核状态" @change="stateChange">
          <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" v-loading.body="loading">
        <el-table-column prop="customerName" label="客户" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="mainPerson" label="客户姓名" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="productName" label="类型" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="typeName" label="二级类型"></el-table-column>
        <el-table-column prop="stock" label="股权" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="realMoney" label="实际收款" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="money" label="总金额"></el-table-column>
        <el-table-column prop="remarks" label="备注" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="flowStatus" label="签约状态" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createDate" :formatter="dateFormat" label="申请时间"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" min-width="130" v-if="state==1">
          <template scope="scope">
            <el-button type="text" @click="passYes(scope)">通过</el-button>
            <el-button type="text" @click="passNo(scope)">拒绝</el-button>
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
    name: 'myCustomer',
    data () {
      return {
        sortType: null,
        states: null,
        state: 1,
        tableData: null,
        keywords: '',
        loading: true,
        currentPage: 1,
        pageSize: 15,
        total: null,
        pageCount: 0,
        isModalOpen: false,
        closeOnClickModal: false,
        follow: {
          state: '1',
          content: '',
          id: null
        }
      }
    },
    computed: {},
    methods: {
      passYes (sco) {
        this.$confirm('通过?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/v2/aut/crm/sign/sure', {
            id: sco.row.id
          }).then(res => {
            if (res.body.errMessage) {
              console.log(res.body.errMessage)
            }
            this.getTableData()
            this.$message({
              type: 'success',
              message: '处理成功!'
            })
          }).catch(res => {
            this.loading = false
            this.$message.error('服务器繁忙！')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      passNo (sco) {
        this.$confirm('拒绝?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http.post('/v2/aut/crm/sign/refuse', {
            id: sco.row.id
          }).then(res => {
            this.getTableData()
            this.$message({
              type: 'success',
              message: '处理成功!'
            })
          }).catch(res => {
            this.loading = false
            this.$message.error('服务器繁忙！')
          })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          })
        })
      },
      getStates () {
        this.states = [{
          label: '待审核',
          value: 1
        }, {
          label: '已审核',
          value: 2
        }]
      },
      getTableData () {
        this.loading = false
        this.$http.get('/v2/aut/crm/sign/list', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage,
            search: this.keywords,
            type: this.state
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
            this.tableData.forEach(function (item, index) {
              if (item.flowStatus === -2) {
                item.flowStatus = '总裁拒绝'
              } else if (item.flowStatus === -1) {
                item.flowStatus = '财务拒绝'
              } else if (item.flowStatus === 0) {
                item.flowStatus = '审核中'
              } else if (item.flowStatus === 1) {
                item.flowStatus = '财务已审核'
              } else if (item.flowStatus === 2) {
                item.flowStatus = '总裁已审核'
              } else {
                item.flowStatus = '未知'
              }
            })
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
      reload () {
        this.getTableData()
      },
      dateFormat (row) {
        if (row.createDate) {
          return moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return ''
        }
      },
      stateChange () {
        this.currentPage = 1
        this.getTableData()
      },
      sortTypeChange () {
        this.currentPage = 1
        this.getTableData()
      }
    },
    created () {
      this.getStates()
      this.getTableData()
    }
  }
</script>

<style lang="scss" scoped>
  .myCustomer {
    .breadcrumb {
      padding: 20px;
      background: #fbfbfb;
    }
    .filter {
      margin-top: 15px;
      padding: 0 20px;
      .el-input {
        width: auto;
      }
      &:after {
        content: "";
        display: block;
        height: 0;
        width: 0;
        overflow: hidden;
        visibility: hidden;
        clear: both;
      }
      .l {
        float: left;
      }
      .r {
        float: right;
        a {
          color: inherit;
          text-decoration: none;
        }
        .uploader {
          display: inline-block;
          margin-left: 10px;
        }
      }
    }
    .main {
      padding: 0 20px;
      overflow: auto;
      margin-top: 15px;
    }
    .pagination {
      padding: 20px;
      text-align: right;
    }
  }
</style>
