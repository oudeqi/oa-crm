<template>
  <div class="detail">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>
          <span @click="goList">员工列表</span>
        </el-breadcrumb-item>
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
          <li><span>员工工号：</span><span>{{staffInfo.serialNumber}}</span></li>
          <li><span>员工角色：</span><span>{{role}}</span></li>
          <li><span>员工状态：</span><span>{{staffInfo.workStatus==1?'试用':staffInfo.workStatus==2?'转正':'未设置'}}</span></li>
          <li><span>电话号码：</span><span>{{staffInfo.phoneNumber}}</span></li>
          <li><span>基本薪资：</span><span>{{staffInfo.baseSalary / 100}}</span></li>
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
  import {getPageIndex} from '../const'
  export default {
    name: 'staffDetail',
    data: function () {
      return {
        listPageIndex: getPageIndex('staffPageIndex'),
        roleOptions: [],
        staffInfo: {}
      }
    },
    computed: {
      role: function () {
        let [role, group, dept] = ['', '', '']
        console.log(role, group, dept)
        this.roleOptions.forEach((value) => {
          if (parseInt(value.id) === parseInt(this.staffInfo.roleId)) {
            role = value.name
            if (value.data && value.data.length > 0) {
              value.data.forEach((val) => {
                if (parseInt(val.id) === parseInt(this.staffInfo.groupId)) {
                  group = val.groupName
                  if (val.data && val.data.length > 0) {
                    val.data.forEach((v) => {
                      if (parseInt(v.id) === parseInt(this.staffInfo.deptId)) {
                        dept = v.deptName
                      }
                    })
                  }
                }
              })
            }
          }
        })
        let str = ''
        if (role) {
          str = role
        }
        if (group) {
          str += ' / ' + group
        }
        if (dept) {
          str += ' / ' + dept
        }
        return str || '无'
      }
    },
    methods: {
      goList: function () {
        router.push({name: 'staffList', params: {index: this.listPageIndex}})
      },
      edit: function () {
        router.push({name: 'staffEdit', params: {index: this.listPageIndex}})
      },
      getRole: function () {
        this.$http.get('/v2/crm/role/group/department/list').then(res => {
          console.log('获取部门角色信息', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            res.body.data.forEach((value) => {
              if (value.data && value.data.length > 0) {
                value.data.forEach((val) => {
                  val.name = val.groupName
                  if (val.data && val.data.length > 0) {
                    val.data.forEach((v) => {
                      v.name = v.deptName
                      v.data = null
                    })
                  }
                })
              }
            })
            this.roleOptions = res.body.data
            this.getStaffInfo()
          }
        }).catch(res => {
          console.log('获取部门角色信息异常', res)
          this.$message.error('服务器繁忙')
        })
      },
      getStaffInfo: function () {
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
    created: function () {
      this.getRole()
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
