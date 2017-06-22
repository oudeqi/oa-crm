<template>
  <div class="detail">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客户</el-breadcrumb-item>
        <!--<el-breadcrumb-item :to="{ path: '/customer/my' }">我的客户</el-breadcrumb-item>-->
        <el-breadcrumb-item>客户详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="base-info">
        <h3>客户信息</h3>
        <ul>
          <li><span>平台名称：</span><span>{{customerInfo.customerName}}</span></li>
          <li><span>平台地区：</span><span>{{customerInfo.cityCodeName}}</span></li>
          <li><span>负责人名：</span><span>{{customerInfo.mainPerson}}</span></li>
          <li><span>微信号码：</span><span>{{customerInfo.mainWeChat || '无'}}</span></li>
          <li><span>手机号码：</span><span>{{customerInfo.mainPhoneNumber || '无'}}</span></li>
          <li><span>职位名称：</span><span>{{customerInfo.job || '无'}}</span></li>
          <li><span>客户状态：</span><span>{{customerInfo.status | statusFormatter}}</span></li>
          <li><span>客户类型：</span><span>{{customerInfo.signType | customerTypeFormatter}}</span></li>
          <li><span>备注信息：</span><span>{{customerInfo.remarks || '无'}}</span></li>
        </ul>
        <h3>其它联系人信息</h3>
        <ul>
          <li><span>联系人名：</span><span>{{customerInfo.subPerson || '无'}}</span></li>
          <li><span>微信号码：</span><span>{{customerInfo.subWeChat || '无'}}</span></li>
          <li><span>手机号码：</span><span>{{customerInfo.subPhoneNumber || '无'}}</span></li>
        </ul>
        <div class="btn-warpper">
          <el-button type="info" icon="edit" @click="customerEdit">编辑客户</el-button>
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
        <div class="btn-warpper">
          <el-button type="info" icon="plus" @click="isModalOpen=true">添加跟进</el-button>
        </div>
      </div>
    </div>
    <el-dialog title="添加跟进" v-model="isModalOpen" :close-on-click-modal="closeOnClickModal">
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
  export default {
    name: 'myCustomerDetail',
    data () {
      return {
        customerInfo: {},
        isModalOpen: false,
        closeOnClickModal: false,
        follow: {
          state: '1',
          content: ''
        }
      }
    },
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
        router.push({name: 'myCustomerDetailEdit'})
      },
      getCustomerInfo () {
        this.$http.get('/v1/aut/crm/customer/id', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          console.log('获取客户信息', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.customerInfo = res.body.data
            this.follow.state = this.customerInfo.status + ''
          }
        }).catch(res => {
          console.log('获取客户信息异常', res)
          this.$confirm('服务器繁忙获取数据失败，是否重新获取？', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'info'
          }).then(() => {
            this.getCustomerInfo()
          }).catch(() => {
            console.log('取消重新获取数据')
          })
        })
      },
      addFollow () {
        if (this.follow.content) {
          this.$http.post('/v1/aut/crm/customer/log', {
            customerId: this.$route.params.id,
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
              this.getCustomerInfo()
              this.follow.content = ''
            }
          }).catch(res => {
            console.log('添加跟进失败', res)
            this.$message.error('服务器繁忙，请重试！')
          })
        }
      }
    },
    created () {
      this.getCustomerInfo()
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
