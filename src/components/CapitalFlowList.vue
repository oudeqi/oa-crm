<template>
  <div class="staff-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>资金流水</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/capital-flow' }">按月统计</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-input placeholder="搜索员工姓名" icon="search" v-model="keywords" :on-icon-click="search"></el-input>
      </div>
      <div class="r">
        <el-button type="primary" icon="plus" @click="addFlow">新增流水</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData">
        <el-table-column prop="date" label="交易日期" :formatter="dateFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="money" label="交易金额" :formatter="currencyFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="headNickName" label="创建人" :formatter="nullFormat"></el-table-column>
        <el-table-column prop="nickName" label="相关员工" :formatter="nullFormat"></el-table-column>
        <el-table-column prop="customerName" label="相关客户" :formatter="nullFormat"></el-table-column>
        <el-table-column prop="otherName" label="非系统人员" :formatter="nullFormat"></el-table-column>
        <el-table-column prop="typeName" label="交易类目" :formatter="nullFormat"></el-table-column>
        <el-table-column prop="remarks" label="备注" :formatter="nullFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="text" @click="edit(scope)">修改</el-button>
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
  import router from '../router'
  import moment from 'moment'
  export default {
    name: 'capitalFlowList',
    data () {
      return {
        tableData: null,
        keywords: '',
        currentPage: 1,
        pageSize: 20,
        total: null,
        pageCount: 0,
        date: new Date()
      }
    },
    created () {
      this.getTableData()
    },
    methods: {
      addFlow: function () {
        router.push({name: 'capitalFlowAdd'})
      },
      getTableData () {
        this.$http.get('/v2/aut/crm/capital/list', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage,
            search: this.keywords,
            date: moment(parseInt(this.$route.params.date)).format('YYYY-MM-DD HH:mm:ss')
          }
        }).then(res => {
          console.log('获取资金流水列表', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.tableData = res.body.data.data
            this.total = res.body.data.rowCount
            this.pageCount = res.body.data.pageCount
          }
        }).catch(res => {
          console.log('获取资金流水列表异常', res)
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
      dateFormat (row) {
        if (row.date) {
          return moment(row.date).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return '无'
        }
      },
      nullFormat (row, col) {
        if (row[col.property]) {
          return row[col.property]
        } else {
          return '无'
        }
      },
      currencyFormat: function (row, col) {
        return '￥' + (row[col.property] / 100).toFixed(2)
      },
      edit: function (scope) {
        console.log(scope)
        router.push({
          name: 'capitalFlowEdit',
          params: {
            id: scope.row.id
          }
        })
      }
    }
  }
</script>

<style lang="scss" scoped>

  .staff-list{}
  .head-pic{
    max-height: 40px;
    width: auto;
    margin: 5px;
    display: block;
  }
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
</style>
