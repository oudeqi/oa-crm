<template>
  <div class="detail">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/setup/station' }">站长列表</el-breadcrumb-item>
        <el-breadcrumb-item>站长详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="base-info">
        <h3>站长基本信息</h3>
        <ul>
          <li><span>平台名称：</span><span>{{customerInfo.customerName}}</span></li>
          <li><span>平台地区：</span><span>{{customerInfo.cityCodeName}}</span></li>
          <li><span>负责人名：</span><span>{{customerInfo.mainPerson}}</span></li>
          <li><span>微信号码：</span><span>{{customerInfo.mainWeChat || '无'}}</span></li>
          <li><span>手机号码：</span><span>{{customerInfo.mainPhoneNumber || '无'}}</span></li>
          <li><span>职位名称：</span><span>{{customerInfo.job || '无'}}</span></li>
          <li><span>客户状态：</span><span>{{customerInfo.status | statusFormatter}}</span></li>
          <li><span>客户类型：</span><span>{{customerInfo.signType | customerTypeFormatter}}</span></li>
          <li><span>备注信息：</span><span>{{customerInfo.remarks || '无'}}</span>
          <li><span>联系人名：</span><span>{{customerInfo.subPerson || '无'}}</span></li>
          <li><span>微信号码：</span><span>{{customerInfo.subWeChat || '无'}}</span></li>
          <li><span>手机号码：</span><span>{{customerInfo.subPhoneNumber || '无'}}</span></li>
        </ul>
        <h3>业务信息</h3>
        <ul>
          <li><span>旅游业务：</span><span>{{tripType}}</span></li>
          <li><span>二台业务：</span><span>{{ertaiType}}</span></li>
          <li><span>小说业务：</span><span>{{bookType}}</span></li>
          <li><span>旅游转介绍人：</span><span>{{customerInfo.recommendName || '无'}}</span></li>
        </ul>
        <div class="btn-warpper">
          <el-button type="info" icon="edit" @click="customerEdit">编辑站长</el-button>
        </div>
      </div>
      <div class="follow-info">
        <h3>跟进信息</h3>
        <ul v-if="customerInfo.logs && customerInfo.logs.length>0">
          <li v-for="(item, index) in customerInfo.logs" :key="index">
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
        <p class="no-follow" v-else>暂无跟进信息</p>
      </div>
    </div>
  </div>
</template>

<script>
  import router from '../router'
  export default {
    name: 'stationDetail',
    data () {
      return {
        customerInfo: {},
        isModalOpen: false,
        closeOnClickModal: false,
        business: [],
        tripType: '无',
        ertaiType: '无',
        bookType: '无',
        follow: {
          state: '1',
          content: ''
        }
      }
    },
    computed: {},
    filters: {
      statusFormatter: function (value) {
        if (value === 0) {
          return '全部'
        } else if (value === 1) {
          return '新建'
        } else if (value === 2) {
          return '拒绝'
        } else if (value === 3) {
          return '未回应'
        } else if (value === 4) {
          return '初步了解'
        } else if (value === 5) {
          return '意向'
        } else if (value === 6) {
          return '重点维护'
        } else if (value === 7) {
          return '签约'
        }
      },
      customerTypeFormatter: function (value) {
        if (value === 1) {
          return '站长'
        } else if (value === 2) {
          return '代理商'
        } else if (value === 0) {
          return '无'
        }
      }
    },
    methods: {
      customerEdit () {
        router.push({name: 'stationEdit'})
      },
      getCustomerInfo () {
        this.$http.get('/v1/aut/crm/customer/id', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          console.log('获取站长信息', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.customerInfo = res.body.data
            this.follow.state = this.customerInfo.status + ''
            this.business[0].data.forEach((item) => {
              if (item.id === this.customerInfo.tripType) {
                this.tripType = item.name
              }
            })
            this.business[1].data.forEach((item) => {
              if (item.id === this.customerInfo.ertaiType) {
                this.ertaiType = item.name
              }
            })
            this.business[2].data.forEach((item) => {
              if (item.id === this.customerInfo.bookType) {
                this.bookType = item.name
              }
            })
          }
        }).catch(res => {
          console.log('获取站长信息异常', res)
          this.$message.error('服务器繁忙')
        })
      }
    },
    created () {
      this.$http.get('/v2/crm/config/list/type')
        .then((res) => {
          console.log('获取业务列表', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.business = res.body.data
            this.getCustomerInfo()
          }
        })
        .catch((res) => {
          console.log('获取业务列表异常', res)
          this.$message.error('服务器繁忙')
        })
    }
  }
</script>

<style lang="scss" scoped>

  @import "../scss/_mixins.scss";

  .detail{
    .breadcrumb{
      padding: 20px;
      background: #fbfbfb;
    }
    .main{
      padding-left: 0;
      padding-right: 20px;
      margin-top: 20px;
      color: #333333;
      font-size: 15px;
      @include clearfix();
      ul{
        list-style: none;
        margin: 0;
        padding: 0;
      }
      .btn-warpper{
        padding: 10px 20px 20px;
      }
      h3{
        background-color: #fbfbfb;
        margin: 0;
        padding: 15px 20px;
        color: #444;
        font-size: 18px;
      }
      .base-info{
        float: left;
        width: 30%;
        padding-right: 8%;
        padding-left: 7%;
        ul{
          padding-bottom: 10px;
          padding-left: 20px;
          padding-top: 20px;
          li{
            margin-bottom: 15px;
          }
        }
      }
      .follow-info{
        float: left;
        width: 55%;
        .no-follow{
          padding-left: 20px;
          color: #aaa;
        }
        ul{
          padding-left: 20px;
          margin-top: 30px;
          max-height: 560px;
          margin-right: 50px;
          overflow: auto;
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
      }
    }
  }
</style>
