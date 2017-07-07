<template>
  <div class="staff-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>
          <span @click="goList">员工列表</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>添加员工</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="base-info">
        <h3>员工基本信息</h3>
        <div class="form-warpper">
          <div class="head-pic">
            <img :src="staffInfo.headIconUrl" alt="">
          </div>
          <el-form :model="staffInfo" label-width="100px" class="demo-ruleForm">
            <el-form-item label="员工姓名">
              <el-input v-model="staffInfo.nickName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="员工工号">
              <el-input v-model="staffInfo.serialNumber" placeholder="请输入打卡机给出的工号"></el-input>
            </el-form-item>
            <el-form-item label="员工角色">
              <el-cascader placeholder="请选择角色" expand-trigger="click" :options="roleOptions"
                           filterable v-model="id"
                           @change="handleCityCodeChange" :props="{value:'id',label:'name',children:'data'}"></el-cascader>
            </el-form-item>
            <el-form-item label="电话号码">
              <el-input v-model="staffInfo.phoneNumber" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="初始密码">
              <el-input v-model="staffInfo.password" placeholder="请输入初始密码"></el-input>
            </el-form-item>
            <el-form-item label="基本薪资">
              <el-input v-model.number="staffInfo.baseSalary" placeholder="请输入整数"></el-input>
            </el-form-item>
            <el-form-item label="入职时间">
              <el-date-picker v-model="staffInfo.joinDate" align="right" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="submitForm">添加</el-button>
              <el-button @click="back">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import router from '../router'
  export default {
    name: 'staffAdd',
    data: function () {
      return {
        listPageIndex: this.$route.params.index,
        staffInfo: {
          headIconUrl: 'http://cdn.2tai.net/app/crm_head_defuat.png',
          nickName: null,
          serialNumber: null,
          phoneNumber: null,
          joinDate: null,
          roleId: null,
          password: '123456',
          groupId: null,
          deptId: null,
          level: 0,
          superiorId: 0,
          createDate: null,
          leaveDate: null,
          baseSalary: null
        },
        id: [],
        roleOptions: []
      }
    },
    methods: {
      back: function () {
        console.log(this.$router)
//        router.go(-1)
        this.$router.go(-1)
      },
      goList: function () {
        router.push({name: 'staffList', params: {index: this.listPageIndex}})
      },
      handleCityCodeChange: function (value) {
        console.log(value)
        if (value[0]) {
          this.staffInfo.roleId = value[0]
          if (value[1]) {
            this.staffInfo.groupId = value[1]
            if (value[2]) {
              this.staffInfo.deptId = value[2]
            }
          }
        }
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
          }
        }).catch(res => {
          console.log('获取部门角色信息异常', res)
          this.$message.error('服务器繁忙')
        })
      },
      submitForm: function () {
        if (!this.staffInfo.nickName || !this.staffInfo.phoneNumber || !this.staffInfo.serialNumber || !this.staffInfo.roleId || !this.staffInfo.joinDate || !this.staffInfo.password || !this.staffInfo.baseSalary) {
          this.$message.error('信息填写不完整')
          return false
        }
        this.$confirm('确定员工信息正确且完整, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postInfo = {
            headIconUrl: this.staffInfo.headIconUrl,
            nickName: this.staffInfo.nickName,
            phoneNumber: this.staffInfo.phoneNumber,
            serialNumber: this.staffInfo.serialNumber,
            joinDate: new Date(this.staffInfo.joinDate).getTime(),
            roleId: this.staffInfo.roleId,
            password: this.staffInfo.password,
            groupId: this.staffInfo.groupId,
            deptId: this.staffInfo.deptId,
            level: this.staffInfo.level,
            superiorId: this.staffInfo.superiorId,
            createDate: this.staffInfo.createDate,
            leaveDate: this.staffInfo.leaveDate,
            baseSalary: this.staffInfo.baseSalary * 100
          }
          this.$http.post('/v2/aut/crm/user/add', postInfo).then(res => {
            console.log('添加员工', res)
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.$message({
                message: '恭喜你，添加员工成功',
                type: 'success'
              })
            }
          }).catch(res => {
            console.log('添加员工失败', res)
            this.$message.error('服务器繁忙，请重试！')
          })
        }).catch(() => {})
      }
    },
    created: function () {
      this.getRole()
    }
  }
</script>

<style lang="scss" scoped>

  @import "../scss/_mixins.scss";
  .head-pic{
    margin-left: 100px;
    width: 80px;
    height: 80px;
    margin-top: 30px;
    margin-bottom: 20px;
    img{
      max-height: 100%;
      max-width: 100%;
    }
  }
  .staff-add{
    .breadcrumb{
      padding: 20px;
      background: #fbfbfb;
    }
    .main{
      padding-left: 20px;
      padding-right: 20px;
      margin-top: 20px;
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
      .form-warpper{
        padding-left: 40px;
        margin-top: 20px;
        .el-select,.el-cascader,.el-date-picker{
          width: 100%;
        }
        .el-date-editor.el-input{
          width: 100%;
        }
        .el-select,.el-input,.el-textarea,.el-cascader,.el-date-picker{
          max-width: 280px;
        }
      }
    }
  }
</style>
