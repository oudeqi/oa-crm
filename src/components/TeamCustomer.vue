<template>
  <div class="teamCustomer">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客户</el-breadcrumb-item>
        <el-breadcrumb-item>团队客户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-cascader placeholder="请选择部门" expand-trigger="hover" :options="teamOptions"
                     v-model="teamMember"
                     :props="{value:'id',label:'name',children:'member'}">
        </el-cascader>
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
        <span class="select-count">已选中 <b>0</b> 个客户</span>
        <el-button type="danger">转移客户</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="50"></el-table-column>
        <el-table-column prop="customerName" label="平台名称"></el-table-column>
        <el-table-column prop="cityCodeName" label="地区"></el-table-column>
        <el-table-column prop="mainPerson" label="平台负责人"></el-table-column>
        <el-table-column prop="mainWeChat" label="微信号"></el-table-column>
        <el-table-column prop="status" label="客户状态" :formatter="statusFormatter"></el-table-column>
        <el-table-column prop="remarks" label="备注" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="deptName" label="部门"></el-table-column>
        <el-table-column prop="contactName" label="对接人"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" :formatter="dateFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="lastOperTime" label="操作时间" :formatter="dateFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="name" label="操作" min-width="130">
          <template scope="scope">
            <el-button type="text" @click="detail(scope)">详情</el-button>
            <el-button type="text" @click="checkFollow(scope.$index, scope.row)">查看跟进</el-button>
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

  export default {
    name: 'teamCustomer',
    data () {
      return {
        tableData: [],
        teamOptions: [],
        teamId: null,
        memberId: null,
        state: null,
        keywords: '',
        currentPage: 1,
        pageSize: 20,
        total: null,
        pageCount: 0
      }
    },
    computed: {
      teamMember () {
        return [this.teamId, this.memberId]
      }
    },
    methods: {
      getTeamOptions () {
        this.$http.get('/v1/aut/crm/team/user').then(res => {
          console.log('获取团队列表', res)
          let teamOptions = [{
            id: -1,
            name: '全部'
          }]
          res.body.data.forEach(value => {
            let member = [{
              id: -1,
              name: '全部'
            }]
            value.users.forEach(v => {
              member.push({
                id: v.uid,
                name: v.nickName
              })
            })
            teamOptions.push({
              id: value.id,
              name: value.nickName,
              member: member
            })
          })
          this.teamOptions = teamOptions
        }).catch(res => {
          console.log('获取团队列表失败', res)
        })
      },
      getTableData () {
        this.$http.get('/v1/aut/crm/team/customer', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage,
            search: this.keywords,
            status: this.state,
            deptid: this.teamId,
            userid: this.memberId
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
      search () {
        this.currentPage = 1
        this.getTableData()
      },
      checkFollow () {},
      currentChange () {},
      handleSelectionChange () {}
    },
    created () {
      this.getTeamOptions()
      this.getTableData()
    }
  }
</script>

<style lang="scss" scoped>
  .teamCustomer{
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
