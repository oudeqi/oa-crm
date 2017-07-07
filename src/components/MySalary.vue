<template>
  <div class="staff-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>个人中心</el-breadcrumb-item>
        <el-breadcrumb-item>我的工资</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <el-table :data="tableData">
        <el-table-column prop="nickName" label="姓名"></el-table-column>
        <el-table-column prop="date" label="月份" :formatter="dateFormat"></el-table-column>
        <el-table-column prop="baseMoney" label="基本工资" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="saleMoney" label="销售提成" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="serviceMoney" label="客服提成" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="teamSaleMoney" label="团队提成" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="otherIncomeMoney" label="其他收入" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="lateDeductMoney" label="迟到/早退" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="lateDeductMoney" label="请假扣除" :formatter="currencyFormat"></el-table-column>
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
    name: 'mySalary',
    data () {
      return {
        tableData: null,
        currentPage: 1,
        pageSize: 20,
        total: null,
        pageCount: 0
      }
    },
    created () {
      this.getTableData()
    },
    methods: {
      handleDateChange: function () {
        this.currentPage = 1
        this.getTableData()
        console.log('this.date', this.date)
      },
      getTableData () {
        this.$http.get('/v2/aut/crm/salary/list/my', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage
          }
        }).then(res => {
          console.log('获取工资列表', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.tableData = res.body.data.data
            this.total = res.body.data.rowCount
            this.pageCount = res.body.data.pageCount
          }
        }).catch(res => {
          console.log('获取工资列表异常', res)
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
          return moment(row.date).format('YYYY-MM')
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
