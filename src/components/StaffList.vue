<template>
  <div class="staff-list">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>员工列表</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-input placeholder="搜索关键词" icon="search" v-model="keywords" :on-icon-click="search"></el-input>
      </div>
      <div class="r">
        <el-button type="primary" icon="plus" @click="staffAdd">新建员工</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData">
        <el-table-column label="头像">
          <template scope="scope">
            <img class="head-pic" :src="scope.row.headIconUrl" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="serialNumber" label="工号"></el-table-column>
        <el-table-column prop="nickName" label="姓名"></el-table-column>
        <el-table-column prop="phoneNumber" label="电话号码"></el-table-column>
        <el-table-column prop="joinDate" label="入职时间" :formatter="dateFormat"></el-table-column>
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
  import {setPageIndex} from '../const'
  export default {
    name: 'staffList',
    data: function () {
      return {
        tableData: null,
        keywords: '',
        currentPage: 1,
        pageSize: 15,
        total: null,
        pageCount: 0
      }
    },
    computed: {},
    watch: {
      '$route': 'routeChange'
    },
    methods: {
      routeChange: function () {
        console.log('routeChange', this.$route.params.index)
        this.currentPage = parseInt(this.$route.params.index)
        this.getTableData()
      },
      getTableData: function () {
        this.$http.get('/v2/aut/crm/user/list', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage,
            search: this.keywords
          }
        }).then(res => {
          console.log('获取员工列表', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.tableData = res.body.data.data
            this.total = res.body.data.rowCount
            this.pageCount = res.body.data.pageCount
          }
        }).catch(res => {
          console.log('获取员工列表异常', res)
          this.$message.error('服务器繁忙！')
        })
      },
      search: function () {
        this.currentPage = 1
        this.getTableData()
      },
      pageIndexChange: function (val) {
        this.currentPage = val
        router.push({name: 'staffList', params: {index: val}})
      },
      dateFormat: function (row, col) {
        if (row[col.property]) {
          return moment(row[col.property]).format('YYYY-MM-DD')
        } else {
          return '无'
        }
      },
      detail: function (scope) {
        console.log(setPageIndex({
          name: 'staffPageIndex',
          value: this.currentPage
        }))
        router.push({name: 'staffDetail', params: {id: scope.row.uid}})
      },
      staffAdd: function () {
        router.push({name: 'staffAdd', params: {index: this.currentPage}})
      }
    },
    created: function () {
      console.log('mounted', this.$route.params.index)
      this.currentPage = parseInt(this.$route.params.index)
      this.getTableData()
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
