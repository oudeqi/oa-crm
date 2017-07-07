<template>
  <div class="staff-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>个人中心</el-breadcrumb-item>
        <el-breadcrumb-item>我的考勤</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-date-picker v-model="date" type="month" @change="handleDateChange" format="yyyy-MM" placeholder="选择月份"></el-date-picker>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData">
        <el-table-column prop="date" :formatter="dateFormat" label="日期"></el-table-column>
        <el-table-column prop="date" :formatter="weekFormat" label="星期"></el-table-column>
        <el-table-column prop="nickName" label="姓名"></el-table-column>
        <el-table-column label="上班时间">
          <template scope="scope">
            <span :class="{warning: isLate(scope)}">{{scope.row.goToWorkDate | date("HH:mm:ss")}}</span>
          </template>
        </el-table-column>
        <el-table-column label="下班时间">
          <template scope="scope">
            <span :class="{warning: isLeaveEarly(scope)}">{{scope.row.goOffWorkDate | date("HH:mm:ss")}}</span>
          </template>
        </el-table-column>
        <el-table-column label="迟到/早退">
          <template scope="scope">
            <span :class="{warning: hasWarning(scope.row.lateDeductMoney)}">{{scope.row.lateDeductMoney/100 | currency}}</span>
          </template>
        </el-table-column>
        <el-table-column label="请假扣除">
          <template scope="scope">
            <span :class="{error: hasWarning(scope.row.leaveDeductMoney)}">{{scope.row.leaveDeductMoney/100 | currency}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" :formatter="nullFormat" :show-overflow-tooltip="true" label="备注"></el-table-column>
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
  moment.locale('zh-cn')
  export default {
    name: 'myWorkAttendance',
    data () {
      return {
        tableData: null,
        keywords: '',
        currentPage: 1,
        pageSize: 20,
        total: null,
        pageCount: 0,
        date: null
      }
    },
    computed: {
      timeStamp: function () {
        if (this.date) {
          return moment(new Date(this.date)).format('YYYY-MM-DD HH:mm:ss')
        } else {
          let month = new Date().getMonth()
          return moment(new Date().setMonth(month - 1)).format('YYYY-MM-DD HH:mm:ss')
        }
      }
    },
    created () {
      let month = new Date().getMonth()
      this.date = new Date().setMonth(month - 1)
      this.getTableData()
    },
    methods: {
      hasWarning: function (val) {
        return val > 0
      },
      isLate: function (scope) {
        let time = scope.row.goToWorkDate
        return new Date(time).setHours(9, 33) < time
      },
      isLeaveEarly: function (scope) {
        let time = scope.row.goOffWorkDate
        return new Date(time).setHours(6, 30) > time
      },
      hasLeaveDeductMoney: function (scope) {
        return scope.row.leaveDeductMoney > 0
      },
      handleDateChange: function () {
        this.currentPage = 1
        this.getTableData()
        console.log('this.date', this.date)
      },
      getTableData () {
        this.$http.get('/v2/aut/crm/attendance/list/my', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage,
            search: this.keywords,
            date: this.timeStamp,
            uid: this.$route.params.id
          }
        }).then(res => {
          console.log('获取个人考勤', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.tableData = res.body.data.data
            this.total = res.body.data.rowCount
            this.pageCount = res.body.data.pageCount
          }
        }).catch(res => {
          console.log('获取个人考勤异常', res)
          this.$message.error('服务器繁忙！')
        })
      },
      pageIndexChange (val) {
        this.currentPage = val
        this.getTableData()
      },
      weekFormat: function (row, col) {
        if (row[col.property]) {
          return moment(row[col.property]).format('dddd')
        } else {
          return '无'
        }
      },
      dateFormat (row, col) {
        let fm = 'HH:mm:ss'
        if (col.property === 'date') {
          fm = 'YYYY-MM-DD'
        }
        if (row[col.property]) {
          return moment(row[col.property]).format(fm)
        } else {
          return '无'
        }
      },
      boolFormat (row, col) {
        if (row[col.property] === 1 && row[col.property] === '1') {
          return '是'
        } else {
          return '否'
        }
      },
      currencyFormat: function (row, col) {
        return '￥' + (row[col.property] / 100).toFixed(2)
      },
      nullFormat (row, col) {
        if (row[col.property]) {
          return row[col.property]
        } else {
          return '无'
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .warning{
    color: red;
  }
  .error{
    color: red;
  }
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
