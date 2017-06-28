<template>
  <div class="staff-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>考勤</el-breadcrumb-item>
        <el-breadcrumb-item>考勤列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-date-picker v-model="date" type="month" @change="handleDateChange" format="yyyy-MM-dd" placeholder="选择月份"> </el-date-picker>
        <el-input placeholder="搜索姓名" icon="search" v-model="keywords" :on-icon-click="search"></el-input>
      </div>
      <div class="r">
        <el-upload class="uploader" :action="importAction" :headers="importHeaders" :multiple="false" accept=".xls,.xlsx"
                   :show-file-list="false" :on-success="handleImportSuccess" :on-error="handleImportError"
                   :on-progress="handleImportProgress">
          <el-button type="primary" :loading="importLoading">导入考勤</el-button>
        </el-upload>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData">
        <el-table-column prop="nickName" label="姓名"></el-table-column>
        <el-table-column prop="earlyOffCount" label="早退次数"></el-table-column>
        <el-table-column prop="forgotClockCount" label="忘记打卡"></el-table-column>
        <el-table-column prop="lateCount" label="迟到次数"></el-table-column>
        <el-table-column prop="leaveCount" label="请假次数"></el-table-column>
        <el-table-column prop="earlyOffCount" label="早退次数"></el-table-column>
        <el-table-column label="操作" min-width="130">
          <template scope="scope">
            <el-button type="text" @click="detail(scope)">详情</el-button>
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
  import router from '../router'
  import {appHost, getToken} from '../const'
  export default {
    name: 'checkWorkAttendance',
    data () {
      return {
        importAction: appHost() + '/v2/aut/crm/attendance/import',
        importLoading: false,
        importHeaders: {
          Authorization: getToken()
        },
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
      handleImportProgress () {
        this.importLoading = true
      },
      handleImportSuccess (res) {
        console.log('导入考勤', res)
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
      handleDateChange: function () {
        this.currentPage = 1
        this.getTableData()
        console.log('this.date', this.date)
      },
      getTableData () {
        this.$http.get('/v2/aut/crm/attendance/list', {
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
      dateFormat (row) {
        if (row.createDate) {
          return moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return '无'
        }
      },
      detail (scope) {
        router.push({name: 'checkWorkAttendanceDetail', params: {id: scope.row.uid}})
      },
      staffAdd () {
        router.push({name: 'staffAdd'})
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
