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
        <span class="select-count">已选中 <b>{{selectedTable.length}}</b> 个客户</span>
        <el-button type="danger" @click="openMoveModal">转移客户</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="customerName" label="平台名称"></el-table-column>
        <el-table-column prop="cityCodeName" label="地区"></el-table-column>
        <el-table-column prop="mainPerson" label="平台负责人"></el-table-column>
        <el-table-column prop="beforeContactUser" label="前对接人"></el-table-column>
        <el-table-column prop="status" label="客户状态" :formatter="statusFormatter"></el-table-column>
        <el-table-column prop="remarks" label="备注"></el-table-column>
        <el-table-column label="操作">
          <template scope="scope">
            <el-button type="text" @click="checkFollow(scope)">查看跟进</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-show="pageCount>1">
      <el-pagination @current-change="pageIndexChange" :current-page="currentPage" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog @close="reload" :title="modalTitle" v-model="isModalOpen" :close-on-click-modal="closeOnClickModal">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText"></el-input>
      <el-tree class="filter-tree" :data="teamOptions2" :props="defaultOption" ref="tree" empty-text="数据没有加载成功"
               highlight-current accordion @node-click="handleItemClick" :filter-node-method="filterNode">
      </el-tree>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isModalOpen = false">取 消</el-button>
        <el-button type="primary" @click="moveCustomer">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog @close="reload" title="查看跟进" v-model="isFollowModalOpen" :close-on-click-modal="closeOnClickModal">
      <p class="no-follow" v-if="follows.length===0">暂无跟进信息</p>
      <ul class="follow-info" v-else>
        <li v-for="(item, index) in follows" :key="index">
          <div class="item-head">
            <img :src="item.headIconUrl" alt="">
          </div>
          <div class="item-body">
            <p class="item-body-tit">
              <span class="name">{{item.nickName || '无名氏'}}</span>
              <span class="date">{{item.createDate | date('YYYY-MM-DD HH:mm:ss')}}</span>
            </p>
            <p class="item-body-content">{{item.content}}</p>
          </div>
        </li>
      </ul>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="isFollowModalOpen = false">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import moment from 'moment'
  import router from '../router'
  export default {
    name: 'seaCustomer',
    data () {
      return {
        tableData: [],
        follows: [],
        state: null,
        keywords: '',
        currentPage: 1,
        pageSize: 15,
        total: null,
        pageCount: 0,
        selectedTable: [],
        isModalOpen: false,
        isFollowModalOpen: false,
        closeOnClickModal: false,
        filterText: '',
        teamOptions2: [],
        defaultOption: {
          children: 'member',
          label: 'name'
        },
        selectedMember: {}
      }
    },
    watch: {
      filterText (val) {
        this.$refs.tree.filter(val)
      }
    },
    computed: {
      modalTitle () {
        if (this.selectedMember.id) {
          return '转移客户 ' + '给 ' + this.selectedMember.name
        } else {
          return '转移客户'
        }
      }
    },
    methods: {
      getTeamOptions () {
        this.$http.get('/v1/aut/crm/team/user').then(res => {
          console.log('获取团队列表', res)
          let teamOptions2 = []
          res.body.data.forEach(value => {
            let member2 = []
            value.users.forEach(v => {
              member2.push({
                id: v.uid,
                name: v.nickName
              })
            })
            teamOptions2.push({
              id: value.id,
              name: value.nickName,
              member: member2
            })
          })
          this.teamOptions2 = teamOptions2
        }).catch(res => {
          console.log('获取团队列表失败', res)
        })
      },
      getTableData () {
        this.$http.get('/v1/aut/crm/public/customer', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage,
            search: this.keywords,
            status: this.state
          }
        }).then(res => {
          console.log('获取团队客户列表', res)
          this.loading = false
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.tableData = res.body.data.data
            this.total = res.body.data.rowCount
            this.pageCount = res.body.data.pageCount
          }
        }).catch(res => {
          console.log('获取团队客户列表异常', res)
          this.loading = false
          this.$message.error('服务器繁忙！')
        })
      },
      statusFormatter (row) {
        if (row.status === 0) {
          return '全部'
        } else if (row.status === 1) {
          return '新建'
        } else if (row.status === 2) {
          return '拒绝'
        } else if (row.status === 3) {
          return '未回应'
        } else if (row.status === 4) {
          return '初步了解'
        } else if (row.status === 5) {
          return '意向'
        } else if (row.status === 6) {
          return '重点维护'
        } else if (row.status === 7) {
          return '签约'
        }
      },
      dateFormat (row) {
        if (row.createDate) {
          return moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return ''
        }
      },
      detail (scope) {
        console.log(scope)
        router.push({name: 'myCustomerDetail', params: {id: scope.row.id}})
      },
      pageIndexChange (val) {
        this.currentPage = val
        this.getTableData()
      },
      stateChange () {
        this.currentPage = 1
        this.getTableData()
      },
      reload () {
        this.getTableData()
      },
      search () {
        this.currentPage = 1
        this.getTableData()
      },
      checkFollow (scope) {
        console.log(scope.row)
        this.$http.get('/v1/aut/crm/customer/logs', {
          params: {
            id: scope.row.id
          }
        }).then(res => {
          console.log('查看跟进', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.follows = res.body.data
            this.isFollowModalOpen = true
          }
        }).catch(res => {
          console.log('查看跟进失败', res)
          this.$message.error('服务器繁忙')
        })
      },
      handleSelectionChange (value) {
        this.selectedTable = value
      },
      openMoveModal () {
        if (this.selectedTable.length === 0) {
          this.$message.error('请选择客户！')
        } else {
          this.isModalOpen = true
        }
      },
      filterNode (value, data) {
        if (!data.member && data.name.indexOf(value) !== -1) {
          return true
        } else {
          return false
        }
      },
      handleItemClick (item) {
        if (!item.member) {
          this.selectedMember = item
        } else {
          this.selectedMember = {}
        }
      },
      moveCustomer () {
        console.log(this.uid)
        if (!this.selectedMember.id) {
          this.$message.error('请选择员工！')
        } else {
          this.$http.post('/v1/aut/crm/customer/change', {
            uid: this.selectedMember.id,
            customers: this.selectedTable
          }).then(res => {
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.$message({
                message: '恭喜你，操作成功！',
                type: 'success'
              })
              this.isModalOpen = false
              this.getTableData()
            }
          }).catch(res => {
            this.$message.error('服务器繁忙！')
          })
        }
      }
    },
    created () {
      this.getTeamOptions()
      this.getTableData()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../scss/_mixins.scss";
  .no-follow{
    text-align: center;
    color: #ddd;
    margin: 0;
    font-size: 15px;
  }
  .follow-info{
    padding-left: 20px;
    margin-top: 30px;
    list-style: none;
    margin: 0;
    max-height: 450px;
    overflow-y: auto;
    li{
      margin-bottom: 20px;
      @include clearfix();
      .item-head{
        float: left;
        width: 50px;
        height: 50px;
        background-color: #eee;
        img{
          max-width: 100%;
          max-height: 100%;
        }
      }
      .item-body{
        margin-left: 60px;
        min-height: 60px;
        .item-body-tit{
          margin: 0;
          padding: 0;
          .name{
            margin-right: 20px;
            font-size: 15px;
          }
          .date{
            font-size: 14px;
            color: #ccc;
          }
        }
        .item-body-content{
          margin: 0;
          padding-top: 8px;
          line-height: 1.3;
        }
      }
    }
  }
  .seaCustomer{
    .filter-tree{
      margin-top: 14px;
      max-height: 400px;
      overflow-y: scroll;
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
