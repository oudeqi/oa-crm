<template>
  <div class="staff-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>考勤</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/work-attendance/list' }">考勤列表</el-breadcrumb-item>
        <el-breadcrumb-item>个人考勤</el-breadcrumb-item>
      </el-breadcrumb>
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
            <span :class="{error: hasLeaveDeductMoney(scope.row.lateDeductMoney)}">{{scope.row.lateDeductMoney/100 | currency}}</span>
          </template>
        </el-table-column>
        <el-table-column label="请假扣除">
          <template scope="scope">
            <span :class="{error: hasLeaveDeductMoney(scope.row.leaveDeductMoney)}">{{scope.row.leaveDeductMoney/100 | currency}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="remarks" :formatter="nullFormat" :show-overflow-tooltip="true" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="text" @click="edit(scope)">扣款</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-show="pageCount>1">
      <el-pagination @current-change="pageIndexChange" :current-page="currentPage" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog @close="reload" title="修改扣款" v-model="isModalOpen" :close-on-click-modal="closeOnClickModal">
      <el-form :model="opra" label-width="100px">
        <el-form-item label="扣款类型">
          <el-radio class="radio" v-model="opra.isLeave" :label="0">迟到早退</el-radio>
          <el-radio class="radio" v-model="opra.isLeave" :label="1">请假</el-radio>
        </el-form-item>
        <el-form-item label="扣款金额">
          <el-input type="number"  placeholder="请输入扣除金额" v-model="opra.leaveDeductMoney"></el-input>
        </el-form-item>
        <el-form-item label="扣款备注">
          <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="opra.remarks"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isModalOpen = false">取 消</el-button>
        <el-button type="primary" @click="commit">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'checkWorkAttendanceDetail',
    data () {
      return {
        isModalOpen: false,
        closeOnClickModal: false,
        tableData: null,
        keywords: '',
        currentPage: 1,
        pageSize: 20,
        total: null,
        pageCount: 0,
        opra: {
          id: null,
          isLeave: 0, // 0 迟到早退，1 请假
          leaveDeductMoney: null,
          remarks: null
        }
      }
    },
    created () {
      this.getTableData()
    },
    methods: {
      edit: function (scope) {
        console.log(scope)
        this.opra.id = scope.row.id
//        if (scope.row.leaveDeductMoney === 0) {
//          this.opra.leaveDeductMoney = null
//        } else {
//          this.opra.leaveDeductMoney = parseInt(scope.row.leaveDeductMoney) / 100
//        }
//        this.opra.remarks = scope.row.remarks
        this.isModalOpen = true
      },
      reload () {
        this.getTableData()
      },
      commit: function () {
        console.log(this.opra)
        if (!this.opra.leaveDeductMoney || !this.opra.remarks) {
          this.$message.error('请将内容填写完整')
          return
        }
        this.$http.post('/v2/aut/crm/attendance/deal', {
          id: this.opra.id,
          isLeave: this.opra.isLeave,
          leaveDeductMoney: parseInt(this.opra.leaveDeductMoney) * 100,
          remarks: this.opra.remarks
        }).then(res => {
          console.log('扣款操作成功', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.$message({
              message: '恭喜你，操作成功',
              type: 'success'
            })
            this.opra.id = null
            this.opra.isLeave = 0
            this.opra.leaveDeductMoney = null
            this.opra.remarks = null
          }
        }).catch(res => {
          console.log('扣款操作失败', res)
          this.$message.error('服务器繁忙，请重试！')
        })
      },
      isLate: function (scope) {
        let time = scope.row.goToWorkDate
        return new Date(time).setHours(9, 33) < time
      },
      isLeaveEarly: function (scope) {
        let time = null
        if (scope.row.goOffWorkDate) {
          time = scope.row.goOffWorkDate
          return new Date(time).setHours(18, 30) > time
        } else {
          return false
        }
      },
      hasLeaveDeductMoney: function (value) {
        return value > 0
      },
      currencyFormat: function (row, col) {
        return '￥' + (row[col.property] / 100).toFixed(2)
      },
      weekFormat: function (row, col) {
        if (row[col.property]) {
          return moment(row[col.property]).format('dddd')
        } else {
          return '无'
        }
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
            date: moment(parseInt(this.$route.params.date)).format('YYYY-MM-DD HH:mm:ss'),
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
