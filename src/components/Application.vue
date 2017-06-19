<template>
  <div class="application">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客户</el-breadcrumb-item>
        <el-breadcrumb-item>申请处理</el-breadcrumb-item>
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
      <div class="r">
        <span class="select-count">已选中 <b>{{selectedTable.length}}</b> 个客户，处理为</span>
        <el-button type="primary" @click="batchProcessing(2)">一个月</el-button>
        <el-button type="primary" @click="batchProcessing(3)">两个月</el-button>
        <el-button type="primary" @click="batchProcessing(4)">三个月</el-button>
        <el-button type="danger" @click="batchProcessing(5)">拒绝</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="userName" label="申请人"></el-table-column>
        <el-table-column prop="customerName" label="平台名称"></el-table-column>
        <el-table-column prop="mainPerson" label="负责人"></el-table-column>
        <el-table-column prop="cityCodeName" label="地区"></el-table-column>
        <el-table-column prop="createDate" label="申请时间" :formatter="dateFormat"></el-table-column>
        <el-table-column label="操作及状态" min-width="250">
          <template scope="scope">
            <template v-if="scope.row.status==1">
              <el-button type="text" @click="applyHandle(2, scope)">一个月</el-button>
              <el-button type="text" @click="applyHandle(3, scope)">两个月</el-button>
              <el-button type="text" @click="applyHandle(4, scope)">三个月</el-button>
              <el-button type="warning" @click="applyHandle(5, scope)" size="mini">拒绝</el-button>
            </template>
            <div v-if="scope.row.status==2">已审核(一个月)</div>
            <div v-if="scope.row.status==3">已审核(两个月)</div>
            <div v-if="scope.row.status==4">已审核(三个月)</div>
            <div v-if="scope.row.status==5">已拒绝</div>
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
    name: 'application',
    data () {
      return {
        tableData: [],
        state: null,
        keywords: '',
        currentPage: 1,
        pageSize: 15,
        total: null,
        pageCount: 0,
        selectedTable: []
      }
    },
    methods: {
      stateChange () {
        this.currentPage = 1
        this.getTableData()
      },
      getTableData () {
        this.$http.get('/v1/aut/all/customer/apply', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage,
            search: this.keywords,
            status: this.state
          }
        }).then(res => {
          console.log('获取申请处理列表', res)
          this.loading = false
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.tableData = res.body.data.data
            this.total = res.body.data.rowCount
            this.pageCount = res.body.data.pageCount
          }
        }).catch(res => {
          console.log('获取申请处理列表异常', res)
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
      dateFormat (row) {
        if (row.createDate) {
          return moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return ''
        }
      },
      handleSelectionChange (value) {
        this.selectedTable = value
      },
      applyHandle (i, scope) {
        console.log(i, scope)
        let [txt, type] = ['', '']
        if (i === 2) { txt = '确定延长一个月?'; type = 'info' }
        if (i === 3) { txt = '确定延长两个月?'; type = 'info' }
        if (i === 4) { txt = '确定延长三个月?'; type = 'info' }
        if (i === 5) { txt = '确认拒绝该用户申请重领客户?'; type = 'warning' }
        this.$confirm(txt, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: type
        }).then(() => {
          console.log(scope)
          this.$http.post('/v1/aut/customer/apply/deal', {
            id: scope.row.id,
            status: i
          }).then((res) => {
            console.log('处理申请', res)
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
      },
      batchProcessing (i) {
        console.log(i)
        if (this.selectedTable.length === 0) {
          this.$message.error('请选择客户')
          return
        }
        let [txt, type] = ['', '']
        if (i === 2) { txt = '确定批量延长一个月?'; type = 'info' }
        if (i === 3) { txt = '确定批量延长两个月?'; type = 'info' }
        if (i === 4) { txt = '确定批量延长三个月?'; type = 'info' }
        if (i === 5) { txt = '确认批量拒绝该用户申请重领客户?'; type = 'warning' }
        this.$confirm(txt, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: type
        }).then(() => {
          let ids = ''
          this.selectedTable.forEach((item, index) => {
            console.log(item)
            if (index === this.selectedTable.length - 1) {
              ids += item.id
            } else {
              ids += item.id + ','
            }
          })
          this.$http.post('/v1/aut/customer/apply/batch', {
            ids: ids,
            status: i
          }).then((res) => {
            console.log('批量处理申请', res)
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.$message({
                message: '恭喜你，操作成功',
                type: 'success'
              })
              this.getTableData()
            }
          }).catch(() => {
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
  .application{
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
      .noData{
        text-align: center;
      }
    }
    .pagination{
      padding:20px;
      text-align: right;
    }
  }
</style>
