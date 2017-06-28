<template>
  <div class="staff-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>资金流水</el-breadcrumb-item>
        <el-breadcrumb-item>列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-date-picker v-model="date" type="month" @change="handleDateChange" format="yyyy-MM-dd" placeholder="选择月份"> </el-date-picker>
        <el-input placeholder="搜索员工姓名" icon="search" v-model="keywords" :on-icon-click="search"></el-input>
      </div>
      <div class="r">
        <el-button type="primary" icon="plus">导入工资表</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData">
        <el-table-column prop="nickName" label="姓名"></el-table-column>
        <el-table-column prop="baseMoney" label="基本工资" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="leaveDeductMoney" label="请假扣除" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="otherDeductMoney" label="其他扣除" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="otherIncomeMoney" label="其他收入" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="paidMoney" label="已发放" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="saleMoney" label="销售提成" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="serviceMoney" label="客服提成" :formatter="currencyFormat"></el-table-column>
        <el-table-column prop="remarks" label="备注" :formatter="nullFormat"></el-table-column>
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
    name: 'capitalFlow',
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
    computed: {
      timeStamp: function () {
        return moment(new Date(this.date)).format('YYYY-MM-DD HH:mm:ss')
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
        this.$http.get('/v2/aut/crm/capital/list', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage,
            search: this.keywords,
            date: this.timeStamp
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
        if (row.createDate) {
          return moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
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
