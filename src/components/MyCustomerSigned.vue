<template>
  <div class="myCustomer">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客户</el-breadcrumb-item>
        <el-breadcrumb-item>我的签约</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="r">
        <el-button type="primary" icon="plus" @click="myCustomerSignedAdd">新建签约</el-button>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" v-loading.body="loading">
        <el-table-column prop="customerName" label="客户平台" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="mainPerson" label="客户姓名" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="productName" label="类型" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="typeName" label="二级类型"></el-table-column>
        <!--<el-table-column v-if="ertaiTypeName" prop="ertaiTypeName" label="二级类型"></el-table-column>
        <el-table-column v-if="bookTypeName" prop="bookTypeName" label="二级类型"></el-table-column>-->
        <el-table-column prop="stock" label="股权" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="realMoney" label="实际收款" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="money" label="总金额"></el-table-column>
        <el-table-column prop="remarks" label="备注" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="flowStatusName" label="签约状态" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createDate" :formatter="dateFormat" label="申请时间"
                         :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" min-width="130">
          <template scope="scope">
            <el-button type="text" @click="lookInfo(scope)">详情</el-button>
            <el-button v-if="scope.row.flowStatus == 0" type="text" @click="changeSigned(scope)">修改</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-show="pageCount>1">
      <el-pagination @current-change="pageIndexChange" :current-page="currentPage" :page-size="pageSize"
                     layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog title="详情" :visible.sync="showInfo" size="tiny">
      <div>
        <div class="infoDiv">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;客户:<span>{{signedThisInfo.customerName}}</span>
        </div>
        <div class="infoDiv">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;类型:<span>{{signedThisInfo.productName}}</span>
        </div>
        <div class="infoDiv">二级类型:<span>{{signedThisInfo.typeName}}</span></div>
        <div class="infoDiv">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;股权:<span>{{signedThisInfo.stock}}</span></div>
        <div class="infoDiv">实际收款:<span>{{signedThisInfo.realMoney}}</span></div>
        <div class="infoDiv">&nbsp;&nbsp;&nbsp;&nbsp;总金额:<span>{{signedThisInfo.money}}</span></div>
        <div class="infoDiv">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;备注:<span>{{signedThisInfo.remarks}}</span></div>
        <div class="infoDiv">签约状态:<span>{{signedThisInfo.flowStatus}}</span></div>
        <div class="infoDiv">申请时间:<span>{{signedThisInfo.createDate}}</span></div>

        <div class="infoDiv">平台区域:<span>{{signedThisInfo.cityCodeName}}</span></div>
        <div class="infoDiv">是否拿票:<span>{{signedThisInfo.status == 1 ? '是' : '否'}}</span></div>
        <div class="infoDiv">游票区间:<span>{{signedThisInfo.ticketBegin}} - {{signedThisInfo.ticketEnd}}</span></div>
        <div class="infoDiv">小说账户:<span>{{signedThisInfo.bookAccount}}</span></div>
      </div>
      <span slot="footer" class="dialog-footer">
		    <el-button type="primary" @click="showInfo = false">确 定</el-button>
		  </span>
    </el-dialog>

    <!--<el-dialog @close="reload" title="添加跟进" v-model="isModalOpen" :close-on-click-modal="closeOnClickModal">
      <el-form :model="follow" label-width="100px">
        <el-form-item label="客户状态">
          <el-select v-model="follow.state" placeholder="请选择活动区域">
            <el-option label="新建" value="1"></el-option>
            <el-option label="拒绝" value="2"></el-option>
            <el-option label="未回应" value="3"></el-option>
            <el-option label="初步了解" value="4"></el-option>
            <el-option label="意向" value="5"></el-option>
            <el-option label="重点维护" value="6"></el-option>
            <el-option label="签约" value="7"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="跟进内容">
          <el-input type="textarea" :rows="8" placeholder="请输入内容" v-model="follow.content"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isModalOpen = false">取 消</el-button>
        <el-button type="primary" @click="addFollow">确 定</el-button>
      </div>
    </el-dialog>-->
  </div>
</template>

<script>
  import router from '../router'
  import moment from 'moment'
  import { appHost } from '../const'
  export default {
    name: 'myCustomerSigned',
    data () {
      return {
        showInfo: false,
        signedThisInfo: {
          customerName: '',
          productName: ''
        },
        sortType: null,
        states: null,
        state: null,
        tableData: null,
        keywords: '',
        loading: true,
        currentPage: 1,
        pageSize: 15,
        total: null,
        pageCount: 0,
        isModalOpen: false,
        closeOnClickModal: false,
        follow: {
          state: '1',
          content: '',
          id: null
        },
        importAction: appHost() + '/v1/aut/crm/import/customer',
        importLoading: false
      }
    },
    computed: {},
    methods: {
      changeSigned (sco) {
        router.push({
          name: 'myCustomerSignedUpdate',
          params: {
            id: sco.row.id
          }
        })
      },
      lookInfo (sco) {
        console.log(sco.row.customerName)
        this.showInfo = true
        this.signedThisInfo = sco.row
        if (sco.row.createDate) {
          this.signedThisInfo.createDate = moment(sco.row.createDate).format('YYYY-MM-DD HH:mm:ss')
        }
      },
      dateFormat (row) {
        if (row.createDate) {
          return moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return ''
        }
      },
      getStates () {
        this.states = [{
          label: '全部',
          value: 0
        }, {
          label: '新建',
          value: 1
        }, {
          label: '拒绝',
          value: 2
        }, {
          label: '未回应',
          value: 3
        }, {
          label: '初步了解',
          value: 4
        }, {
          label: '意向',
          value: 5
        }, {
          label: '重点维护',
          value: 6
        }, {
          label: '签约',
          value: 7
        }]
      },
      getTableData () {
        this.loading = false
        this.$http.get('/v2/aut/crm/sign/list', {
          params: {
            pageSize: this.pageSize,
            pageIndex: this.currentPage,
            search: this.keywords,
            type: 0
          }
        }).then(res => {
          console.log('获取我的签约列表', res)
          this.loading = false
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.tableData = res.body.data.data
            this.total = res.body.data.rowCount
            this.pageCount = res.body.data.pageCount
            this.tableData.forEach(function (item, index) {
              if (item.flowStatus === -1) {
                item.flowStatusName = '总裁拒绝'
              } else if (item.flowStatus === -1) {
                item.flowStatusName = '财务拒绝'
              } else if (item.flowStatus === 0) {
                item.flowStatusName = '审核中'
              } else if (item.flowStatus === 1) {
                item.flowStatusName = '财务已审核'
              } else if (item.flowStatus === 2) {
                item.flowStatusName = '总裁已审核'
              } else {
                item.flowStatusName = '未知'
              }
            })
          }
        }).catch(res => {
          console.log('获取我的客户列表异常', res)
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
      reload () {
        this.getTableData()
      },
      myCustomerSignedAdd () {
        router.push({
          name: 'myCustomerSignedAdd'
        })
      },
      stateChange () {
        this.currentPage = 1
        this.getTableData()
      }
    },
    created () {
      this.getStates()
      this.getTableData()
    }
  }
</script>

<style lang="scss" scoped>
  .myCustomer {
    .breadcrumb {
      padding: 20px;
      background: #fbfbfb;
    }
    .infoDiv {
      font-size: 1.3rem;
      line-height: 2rem;
      color: #222;
      font-weight: bold;
      span {
        margin: 0 0 0 1rem;
        font-size: 1rem;
        color: #444;
      }
    }
    .filter {
      margin-top: 15px;
      padding: 0 20px;
      .el-input {
        width: auto;
      }
      &:after {
        content: "";
        display: block;
        height: 0;
        width: 0;
        overflow: hidden;
        visibility: hidden;
        clear: both;
      }
      .l {
        float: left;
      }
      .r {
        float: right;
        a {
          color: inherit;
          text-decoration: none;
        }
        .uploader {
          display: inline-block;
          margin-left: 10px;
        }
      }
    }
    .main {
      padding: 0 20px;
      overflow: auto;
      margin-top: 15px;
    }
    .pagination {
      padding: 20px;
      text-align: right;
    }
  }
</style>
