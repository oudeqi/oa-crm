<template>
  <div class="staff-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>考勤</el-breadcrumb-item>
        <el-breadcrumb-item>请假列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-date-picker v-model="date" type="month" @change="handleDateChange" format="yyyy-MM-dd" placeholder="选择月份"> </el-date-picker>
        <el-input placeholder="搜索姓名" icon="search" v-model="keywords" :on-icon-click="search"></el-input>
      </div>
      <div class="r">
        <el-button type="primary" icon="plus" @click="staffAdd">导入考勤</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData">
        <el-table-column prop="nickName" label="姓名"></el-table-column>
        <el-table-column prop="date" :formatter="dateFormat" label="日期"></el-table-column>
        <el-table-column prop="goToWorkDate" :formatter="dateFormat" label="上班时间"></el-table-column>
        <el-table-column prop="goOffWorkDate" :formatter="dateFormat" label="下班时间"></el-table-column>
        <el-table-column prop="isForgotClock" :formatter="boolFormat" label="忘记打卡"></el-table-column>
        <el-table-column prop="isLeave" :formatter="boolFormat" label="是否请假"></el-table-column>
        <el-table-column prop="leaveInfo" :formatter="nullFormat" :show-overflow-tooltip="true" label="请假备注"></el-table-column>
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
  import router from '../router'
  export default {
    name: 'leave',
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
      this.getTableData()
    },
    methods: {
      handleDateChange: function () {
        this.currentPage = 1
        this.getTableData()
        console.log('this.date', this.date)
      },
      getTableData () {
        this.$http.get('/v2/aut/crm/attendance/leave/list', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage,
            search: this.keywords,
            date: this.timeStamp
          }
        }).then(res => {
          console.log('获取考勤列表', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.tableData = res.body.data.data
            this.total = res.body.data.rowCount
            this.pageCount = res.body.data.pageCount
          }
        }).catch(res => {
          console.log('获取考勤列表异常', res)
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
        router.push({name: 'checkWorkAttendanceDetail', params: {id: scope.row.uid}})
      },
      staffAdd () {
        router.push({name: 'staffAdd'})
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
