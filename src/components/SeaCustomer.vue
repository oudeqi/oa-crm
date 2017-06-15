<template>
  <div class="seaCustomer">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客户</el-breadcrumb-item>
        <el-breadcrumb-item>公海客户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-select v-model="value" placeholder="所有客户状态">
          <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input placeholder="搜索关键词" icon="search" v-model="keywords" :on-icon-click="search"></el-input>
      </div>
      <div class="r">
        <span class="select-count">已选中 <b>0</b> 个客户</span>
        <el-button type="primary">转移客户</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="name" label="平台名称"></el-table-column>
        <el-table-column prop="name" label="地区"></el-table-column>
        <el-table-column prop="name" label="平台负责人"></el-table-column>
        <el-table-column prop="name" label="前对接人"></el-table-column>
        <el-table-column prop="name" label="客户状态"></el-table-column>
        <el-table-column prop="name" label="备注"></el-table-column>
        <el-table-column prop="name" label="操作" width="180">
          <template scope="scope">
            <el-button size="small" type="danger" @click="checkFollow(scope.$index, scope.row)">查看跟进</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination @current-change="currentChange" :current-page="currentPage" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>

  export default {
    name: 'seaCustomer',
    data () {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }],
        options: [{
          value: '1',
          label: '黄金糕'
        }, {
          value: '2',
          label: '双皮奶'
        }, {
          value: '3',
          label: '蚵仔煎'
        }, {
          value: '4',
          label: '龙须面'
        }, {
          value: '5',
          label: '北京烤鸭'
        }],
        value: '',
        keywords: '',
        currentPage: 1,
        pageSize: 20,
        total: 200
      }
    },
    methods: {
      search () {},
      detail () {},
      checkFollow () {},
      currentChange () {},
      handleSelectionChange () {}
    }
  }
</script>

<style lang="scss" scoped>
  .seaCustomer{
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
