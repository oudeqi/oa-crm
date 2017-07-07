<template>
  <div class="myCustomer">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客户</el-breadcrumb-item>
        <el-breadcrumb-item>我的客户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-select v-model="state" placeholder="所有客户状态" @change="stateChange">
          <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="sortType" placeholder="排序方式" @change="sortTypeChange">
          <el-option v-for="item in sortArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input placeholder="搜索关键词" icon="search" v-model="keywords" :on-icon-click="search"></el-input>
      </div>
      <div class="r">
        <el-button type="primary" icon="plus" @click="myCustomerAdd">新建客户</el-button>
        <el-upload class="uploader" :action="importAction" :headers="importHeaders" :multiple="false" accept=".xls"
                   :show-file-list="false" :on-success="handleImportSuccess" :on-error="handleImportError"
                   :on-progress="handleImportProgress">
          <el-button type="primary" :loading="importLoading">导入</el-button>
        </el-upload>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" :highlight-current-row="true" v-loading.body="loading" :row-class-name="tableRowClassName">
        <el-table-column prop="customerName" label="平台名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="cityCodeName" label="地区" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="mainPerson" label="平台负责人"></el-table-column>
        <el-table-column prop="mainPhoneNumber" label="电话" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="mainWeChat" label="微信号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="status" label="客户状态" :formatter="statusFormatter"></el-table-column>
        <el-table-column prop="signType" label="客户类型" :formatter="customerTypeFormatter" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="remarks" label="备注" :formatter="nullFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" :formatter="dateFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="lastOperTime" label="操作时间" :formatter="dateFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" min-width="190">
          <template scope="scope">
            <el-button type="text" @click="detail(scope)">详情</el-button>
            <el-button type="text" @click="openModal(scope)">添加跟进</el-button>
            <el-button type="text" @click="changeSigned(scope)">签约</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-show="pageCount>1">
      <el-pagination @current-change="pageIndexChange" :current-page="currentPage" :page-size="pageSize"
        layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog @close="reload" title="添加跟进" v-model="isModalOpen" :close-on-click-modal="closeOnClickModal">
      <el-form :model="follow" label-width="100px">
        <el-form-item label="客户状态">
          <el-select v-model="follow.state" placeholder="请选择活动区域">
            <el-option label="新建" value="1"></el-option>
            <el-option label="拒绝" value="2"></el-option>
            <el-option label="未回应" value="3"></el-option>
            <el-option label="初步了解" value="4"></el-option>
            <el-option label="意向" value="5"></el-option>
            <el-option label="重点维护" value="6"></el-option>
            <el-option label="签约" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进内容">
          <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="follow.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isModalOpen = false">取 消</el-button>
        <el-button type="primary" @click="addFollow">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import router from '../router'
  import moment from 'moment'
  import {appHost, getToken} from '../const'
  export default {
    name: 'myCustomer',
    data () {
      return {
        sortArr: null,
        sortType: null,
        states: null,
        state: null,
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
        },
        importAction: appHost() + '/v1/aut/crm/import/customer',
        importHeaders: {
          Authorization: getToken()
        },
        importLoading: false
      }
    },
    computed: {},
    methods: {
      tableRowClassName: function (row) {
        if (row.remind === 1 || row.remind === '1') {
          return 'warning'
        } else {
          return ''
        }
      },
      changeSigned (sco) {
        router.push({
          name: 'myCustomerSignedFromCustomer',
          params: {
            customerid: sco.row.id
          }
        })
      },
      handleImportProgress () {
        this.importLoading = true
      },
      handleImportSuccess (res) {
        console.log('导入客户', res)
        this.importLoading = false
        if (res.errMessage) {
          this.$message.error(res.errMessage)
        } else {
          this.$message({
            message: res.data.str,
            type: 'success'
          })
          this.getTableData()
        }
      },
      handleImportError () {
        this.importLoading = false
        this.$message.error('服务器繁忙！')
      },
      getStates () {
        this.states = [{
          label: '全部',
          value: 0
        }, {
          label: '新建',
          value: 1
        }, {
          label: '拒绝',
          value: 2
        }, {
          label: '未回应',
          value: 3
        }, {
          label: '初步了解',
          value: 4
        }, {
          label: '意向',
          value: 5
        }, {
          label: '重点维护',
          value: 6
        }, {
          label: '签约',
          value: 7
        }]
      },
      getSortArr () {
        this.sortArr = [{
          label: '默认排序',
          value: 0
        }, {
          label: '操作时间排序',
          value: 1
        }, {
          label: '创建时间排序',
          value: 2
        }, {
          label: '急需处理排序',
          value: 3
        }]
      },
      getTableData () {
        this.loading = false
        this.$http.get('/v1/aut/crm/my/customer', {
          params: {
            pageSize: this.pageSize,
            order: this.sortType,
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
      detail (scope) {
        console.log(scope)
        router.push({name: 'myCustomerDetail', params: {id: scope.row.id}})
      },
      openModal (scope) {
        this.follow.id = scope.row.id
        this.follow.state = scope.row.status + ''
        this.follow.content = ''
        this.isModalOpen = true
      },
      reload () {
        this.getTableData()
      },
      addFollow () {
        if (this.follow.content) {
          this.$http.post('/v1/aut/crm/customer/log', {
            customerId: this.follow.id,
            content: this.follow.content,
            status: this.follow.state
          }).then(res => {
            console.log('添加跟进', res)
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.$message({
                message: '恭喜你，添加跟进成功',
                type: 'success'
              })
              this.follow.content = ''
            }
          }).catch(res => {
            console.log('添加跟进失败', res)
            this.$message.error('服务器繁忙，请重试！')
          })
        }
      },
      myCustomerAdd () {
        router.push({name: 'myCustomerAdd'})
      },
      statusFormatter (row) {
        if (row.status === 0) {
          return '全部'
        } else if (row.status === 1) {
          return '新建'
        } else if (row.status === 2) {
          return '拒绝'
        } else if (row.status === 3) {
          return '未回应'
        } else if (row.status === 4) {
          return '初步了解'
        } else if (row.status === 5) {
          return '意向'
        } else if (row.status === 6) {
          return '重点维护'
        } else if (row.status === 7) {
          return '签约'
        }
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
      nullFormat (row, col) {
        if (row[col.property]) {
          return row[col.property]
        } else {
          return '无'
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
      this.getSortArr()
      this.getTableData()
    }
  }
</script>
<style lang="scss">
  .myCustomer{
    .warning{
      background-color: pink;
    }
  }
</style>
<style lang="scss" scoped>

  .myCustomer{
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
        a{
          color: inherit;
          text-decoration: none;
        }
        .uploader{
          display: inline-block;
          margin-left: 10px;
        }
      }
    }
    .main{
      padding: 0 20px;
      overflow: auto;
      margin-top: 15px;
    }
    .pagination{
      padding:20px;
      text-align: right;
    }
  }
</style>
