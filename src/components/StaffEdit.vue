<template>
  <div class="staff-edit">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item>
          <span @click="goList">员工列表</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>
          <span @click="back">员工详情</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>修改员工资料</el-breadcrumb-item>
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
              <el-input v-model="staffInfo.nickName"></el-input>
            </el-form-item>
            <el-form-item label="员工工号">
              <el-input v-model="staffInfo.serialNumber"></el-input>
            </el-form-item>
            <el-form-item label="员工角色">
              <el-cascader placeholder="请选择角色" expand-trigger="click" :options="roleOptions"
                           filterable v-model="id"
                           @change="handleCityCodeChange" :props="{value:'id',label:'name',children:'data'}"></el-cascader>
            </el-form-item>
            <el-form-item label="电话号码">
              <el-input v-model="staffInfo.phoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="基本工资">
              <el-input v-model.number="showSalary"placeholder="单位：元"></el-input>
            </el-form-item>
            <el-form-item label="入职时间">
              <el-date-picker v-model="staffInfo.joinDate" align="right" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="离职时间">
              <el-date-picker v-model="staffInfo.leaveDate" align="right" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="submitForm">修改</el-button>
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
    name: 'staffEdit',
    data () {
      return {
        showSalary: null,
        staffInfo: {},
        id: [],
        roleOptions: []
      }
    },
    watch: {
      staffInfo () {
        this.showSalary = this.staffInfo.baseSalary / 100
      }
    },
    methods: {
      back () {
        router.go(-1)
      },
      goList: function () {
        router.push({name: 'staffList', params: {index: this.$route.params.index}})
      },
      handleCityCodeChange (value) {
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
      getRole () {
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
            let ids = []
            if (res.body.data.roleId) {
              ids[0] = res.body.data.roleId
            }
            if (res.body.data.groupId !== 0) {
              ids[1] = res.body.data.groupId
            }
            if (res.body.data.deptId !== 0) {
              ids[2] = res.body.data.deptId
            }
            this.id = ids
            console.log(this.id)
          }
        }).catch(res => {
          console.log('获取员工信息异常', res)
          this.$message.error('服务器繁忙')
        })
      },
      submitForm () {
        this.$confirm('确定要对员工信息进行编辑吗, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let [joinDate, leaveDate] = [this.staffInfo.joinDate, this.staffInfo.leaveDate]
          if (this.staffInfo.joinDate) {
            this.staffInfo.joinDate = new Date(joinDate).getTime()
          }
          if (this.staffInfo.leaveDate) {
            this.staffInfo.leaveDate = new Date(leaveDate).getTime()
          }
          this.staffInfo.baseSalary = this.showSalary * 100
          this.$http.post('/v2/aut/crm/user/update', this.staffInfo).then(res => {
            console.log('修改用户信息', res)
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.$message({
                message: '恭喜你，修改员工信息成功',
                type: 'success'
              })
            }
          }).catch(res => {
            console.log('修改员工信息失败', res)
            this.$message.error('服务器繁忙，请重试！')
          })
        }).catch(() => {})
      }
    },
    created () {
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
  .staff-edit{
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
