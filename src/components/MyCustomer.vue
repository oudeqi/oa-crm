<template>
  <div class="myCustomer">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客户</el-breadcrumb-item>
        <el-breadcrumb-item>我的客户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="filter">
      <div class="l">
        <el-select v-model="state" placeholder="所有客户状态" @change="stateChange">
          <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-select v-model="sortType" placeholder="排序方式" @change="sortTypeChange">
          <el-option v-for="item in sortArr" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
        <el-input placeholder="搜索关键词" icon="search" v-model="keywords" :on-icon-click="search"></el-input>
      </div>
      <div class="r">
        <el-button type="primary" icon="plus" @click="myCustomerAdd">新建客户</el-button>
        <el-upload class="uploader" :action="importAction" :headers="importHeaders" :multiple="false" accept=".xls"
                   :show-file-list="false" :on-success="handleImportSuccess" :on-error="handleImportError"
                   :on-progress="handleImportProgress">
          <el-button type="primary" :loading="importLoading">导入</el-button>
        </el-upload>
      </div>
    </div>
    <div class="main">
      <el-table :data="tableData" v-loading.body="loading">
        <el-table-column prop="customerName" label="平台名称" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="cityCodeName" label="地区" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="mainPerson" label="平台负责人"></el-table-column>
        <el-table-column prop="mainPhoneNumber" label="电话" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="mainWeChat" label="微信号" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="status" label="客户状态" :formatter="statusFormatter"></el-table-column>
        <el-table-column prop="signType" label="客户类型" :formatter="customerTypeFormatter" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="remarks" label="备注" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="createDate" label="创建时间" :formatter="dateFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column prop="lastOperTime" label="操作时间" :formatter="dateFormat" :show-overflow-tooltip="true"></el-table-column>
        <el-table-column label="操作" min-width="130">
          <template scope="scope">
            <el-button type="text" @click="detail(scope)">详情</el-button>
            <el-button type="text" @click="openModal(scope)">添加跟进</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination" v-show="pageCount>1">
      <el-pagination @current-change="pageIndexChange" :current-page="currentPage" :page-size="pageSize"
        layout="total, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>
    <el-dialog @close="reload" title="添加跟进" v-model="isModalOpen" :close-on-click-modal="closeOnClickModal">
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
    </el-dialog>
  </div>
</template>

<script>
  import router from '../router'
  import moment from 'moment'
  import {appHost, getToken} from '../const'
  export default {
    name: 'myCustomer',
    data () {
      return {
        sortArr: null,
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
        importHeaders: {
          Authorization: getToken()
        },
        importLoading: false
      }
    },
    computed: {},
    methods: {
      handleImportProgress () {
        this.importLoading = true
      },
      handleImportSuccess (res) {
        console.log('导入客户', res)
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
//        this.state = this.states[0].value
      },
      getSortArr () {
        this.sortArr = [{
          label: '默认排序',
          value: 0
        }, {
          label: '操作时间排序',
          value: 1
        }, {
          label: '创建时间排序',
          value: 2
        }, {
          label: '急需处理排序',
          value: 3
        }]
//        this.sortType = this.sortArr[0].value
      },
      getTableData () {
        this.loading = false
//        let testArr = '{"data":{"pageSize":20,"pageIndex":1,"rowCount":9,"data":[{"id":8,"customerName":"昆山招聘","cityCode":"320583","cityCodeName":"昆山市","mainPerson":"李彦臣","mainPhoneNumber":"18550118707","mainWeChat":"moxian118","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"","status":1,"signType":0,"remarks":"","createDate":1490249495000,"lastOperTime":1490249495000,"createUid":2,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":1504688189000,"remind":0,"tripType":2,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":3613,"customerName":"固原大城小事","cityCode":"640401","cityCodeName":"市辖区","mainPerson":"韩总","mainPhoneNumber":"","mainWeChat":"xhanaimiaox","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"负责人","status":6,"signType":0,"remarks":"目前正在跟踪中","createDate":1490255782000,"lastOperTime":1490255782000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":3614,"customerName":"入围广宁网","cityCode":"441223","cityCodeName":"广宁县","mainPerson":"邓总","mainPhoneNumber":"13929803806","mainWeChat":"gm13929803806","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"负责人","status":6,"signType":0,"remarks":"目前正在跟踪中","createDate":1490255782000,"lastOperTime":1490255782000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":3615,"customerName":"五邑特搜","cityCode":"440701","cityCodeName":"市辖区","mainPerson":"Peter","mainPhoneNumber":"","mainWeChat":"QQ619325900","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"负责人","status":5,"signType":0,"remarks":"目前正在跟踪中","createDate":1490255782000,"lastOperTime":1490255782000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":3616,"customerName":"寻信饮食安全","cityCode":"140101","cityCodeName":"市辖区","mainPerson":"田老师","mainPhoneNumber":"","mainWeChat":"Tninggn","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"负责人","status":5,"signType":0,"remarks":"只想拿100张票，价格觉得贵了还","createDate":1490255782000,"lastOperTime":1490255782000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":3617,"customerName":"南宁微生活","cityCode":"450101","cityCodeName":"市辖区","mainPerson":"漫漫（财务）","mainPhoneNumber":"18577178467","mainWeChat":"zwhd701","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"财务","status":7,"signType":0,"remarks":"3月中旬拿了500张海南票做活动","createDate":1490255782000,"lastOperTime":1490255782000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":3543,"customerName":"博真微生活","cityCode":"510101","cityCodeName":"市辖区","mainPerson":"刘劲松","mainPhoneNumber":"13568281288","mainWeChat":"I627638","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"负责人","status":6,"signType":0,"remarks":"目前正在跟踪中，近期会来公司","createDate":1490255651000,"lastOperTime":1490255651000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":6362,"customerName":"佳雨传媒","cityCode":"330101","cityCodeName":"市辖区","mainPerson":"喻情","mainPhoneNumber":"15179765630","mainWeChat":"TM15179765630","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"","status":4,"signType":0,"remarks":"","createDate":1490259238000,"lastOperTime":1490259238000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0},{"id":6368,"customerName":"玉屏那些事儿","cityCode":"522223","cityCodeName":"玉屏侗族自治县","mainPerson":"向运亮","mainPhoneNumber":"13638563285","mainWeChat":"XiangYunL123","subPerson":"","subPhoneNumber":"","subWeChat":"","job":"负责人","status":1,"signType":0,"remarks":"在跟踪中","createDate":1490259380000,"lastOperTime":1490259380000,"createUid":1,"contactUid":1,"contactName":null,"deptName":null,"logs":null,"beforeContactUser":null,"applyStatus":0,"publicTime":null,"remind":0,"tripType":0,"ertaiType":0,"bookType":0,"stock":0,"recommendId":0}],"pageCount":1}}'
//        let xx = JSON.parse(testArr)
//        console.log('获取我的客户列表', xx)
//        this.tableData = xx.data.data
//        this.total = xx.data.rowCount
//        this.pageCount = xx.data.pageCount
        this.$http.get('/v1/aut/crm/my/customer', {
          params: {
            pageSize: this.pageSize,
            order: this.sortType,
            pageIndex: this.currentPage,
            search: this.keywords,
            status: this.state
          }
        }).then(res => {
          console.log('获取我的客户列表', res)
          this.loading = false
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.tableData = res.body.data.data
            this.total = res.body.data.rowCount
            this.pageCount = res.body.data.pageCount
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
      detail (scope) {
        console.log(scope)
        router.push({name: 'myCustomerDetail', params: {id: scope.row.id}})
      },
      openModal (scope) {
        this.follow.id = scope.row.id
        this.follow.state = scope.row.status + ''
        this.follow.content = ''
        this.isModalOpen = true
      },
      reload () {
        this.getTableData()
      },
      addFollow () {
        if (this.follow.content) {
          this.$http.post('/v1/aut/crm/customer/log', {
            customerId: this.follow.id,
            content: this.follow.content,
            status: this.follow.state
          }).then(res => {
            console.log('添加跟进', res)
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.$message({
                message: '恭喜你，添加跟进成功',
                type: 'success'
              })
              this.follow.content = ''
            }
          }).catch(res => {
            console.log('添加跟进失败', res)
            this.$message.error('服务器繁忙，请重试！')
          })
        }
      },
      myCustomerAdd () {
        router.push({name: 'myCustomerAdd'})
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
      customerTypeFormatter (row) {
        if (row.signType === 1) {
          return '站长'
        } else if (row.signType === 2) {
          return '代理商'
        } else if (row.signType === 0) {
          return '无'
        }
      },
      dateFormat (row) {
        if (row.createDate) {
          return moment(row.createDate).format('YYYY-MM-DD HH:mm:ss')
        } else {
          return ''
        }
      },
      stateChange () {
        this.currentPage = 1
        this.getTableData()
      },
      sortTypeChange () {
        this.currentPage = 1
        this.getTableData()
      }
    },
    created () {
      this.getStates()
      this.getSortArr()
      this.getTableData()
    }
  }
</script>

<style lang="scss" scoped>
  .myCustomer{
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
  }
</style>
