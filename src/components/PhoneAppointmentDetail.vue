<template>
  <div class="detail">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>预约</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/appointment/phone' }">电话预约</el-breadcrumb-item>
        <el-breadcrumb-item>预约详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="base-info">
        <h3>预约信息</h3>
        <ul>
          <li><span>预约类型：</span><span>{{detail.typeName}}</span></li>
          <li><span>预约人姓名：</span><span>{{detail.touristName || '无'}}</span></li>
          <li><span>预约人电话：</span><span>{{detail.touristPhone || '无'}}</span></li>
          <li><span>预约人微信：</span><span>{{detail.wechat || '无'}}</span></li>
          <li><span>预约人身份证：</span><span>{{detail.touristId || '无'}}</span></li>
          <li><span>预约路线：</span><span>{{detail.lineName}}</span></li>
          <li><span>行程时间：</span><span>{{detail.tripDate | date('YYYY-MM-DD HH:mm:ss')}}</span></li>
          <li><span>预约人数：</span><span>{{detail.number}}</span></li>
          <li><span>流程状态：</span><span>{{detail.statusName}}</span></li>
          <li><span>票号区间：</span><span>{{detail.ticketBegin || '无'}}</span>-<span>{{detail.ticketEnd || '无'}}</span></li>
          <li><span>备注信息：</span><span>{{detail.remarks || '无'}}</span></li>
        </ul>
        <div class="btn-warpper">
          <el-button type="info" icon="edit" @click="edit">修改预约信息</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import router from '../router'
  export default {
    name: 'phoneAppointmentDetail',
    data () {
      return {
        detail: {}
      }
    },
    methods: {
      edit () {
        router.push({name: 'PhoneAppointmentEdit'})
      },
      getDetail () {
        this.$http.get('/v2/aut/crm/reservation/details', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          console.log('获取预约详情', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.detail = res.body.data
            if (this.detail.type === 1) {
              this.$set(this.detail, 'typeName', '电话预约')
            } else if (this.detail.type === 2) {
              this.$set(this.detail, 'typeName', '节流预约')
            }
            if (this.detail.status === 1) {
              this.$set(this.detail, 'statusName', '未出行')
            } else if (this.detail.status === 2) {
              this.$set(this.detail, 'statusName', '已出行')
            }
          }
        }).catch(res => {
          console.log('获取预约详情异常', res)
          this.$message.error('服务器繁忙')
        })
      }
    },
    created () {
      this.getDetail()
    }
  }
</script>

<style lang="scss" scoped>

  .detail{}
  .head-pic{
    width: 80px;
    height: 80px;
    margin-left: 60px;
    margin-top: 30px;
    img{
      max-height: 100%;
      max-width: 100%;
    }
  }
  .breadcrumb{
    padding: 20px;
    background: #fbfbfb;
  }
  .main{
    padding-right: 20px;
    padding-left: 20px;
    margin-top: 20px;
    color: #333333;
    font-size: 15px;
    ul{
      list-style: none;
      margin: 0;
      padding: 0;
    }
    .btn-warpper{
      padding: 10px 60px 20px;
    }
    h3{
      background-color: #fbfbfb;
      margin: 0;
      padding: 15px 20px;
      color: #444;
      font-size: 18px;
    }
    .base-info{
      ul{
        padding-bottom: 10px;
        padding-left: 60px;
        padding-top: 20px;
        li{
          margin-bottom: 15px;
        }
      }
    }
  }
</style>
