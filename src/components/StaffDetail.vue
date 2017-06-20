<template>
  <div class="detail">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/setup/staff' }">员工列表</el-breadcrumb-item>
        <el-breadcrumb-item>员工详情</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="base-info">
        <h3>员工基本信息</h3>
        <div class="head-pic">
          <img :src="staffInfo.headIconUrl" alt="">
        </div>
        <ul>
          <li><span>员工姓名：</span><span>{{staffInfo.nickName}}</span></li>
          <li><span>电话号码：</span><span>{{staffInfo.phoneNumber}}</span></li>
          <li><span>入职时间：</span><span>{{staffInfo.joinDate | date('YYYY-MM-DD HH:mm:ss')}}</span></li>
          <li><span>离职时间：</span><span>{{staffInfo.leaveDate | date('YYYY-MM-DD HH:mm:ss')}}</span></li>
        </ul>
        <div class="btn-warpper">
          <el-button type="info" icon="edit" @click="edit">修改员工信息</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

  import router from '../router'
  export default {
    name: 'staffDetail',
    data () {
      return {
        staffInfo: {}
      }
    },
    methods: {
      edit () {
        router.push({name: 'staffEdit'})
      },
      getStaffInfo () {
        this.$http.get('/v2/aut/crm/user/details', {
          params: {
            uid: this.$route.params.id
          }
        }).then(res => {
          console.log('获取员工信息', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.staffInfo = res.body.data
          }
        }).catch(res => {
          console.log('获取员工信息异常', res)
          this.$message.error('服务器繁忙')
        })
      }
    },
    created () {
      this.getStaffInfo()
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
