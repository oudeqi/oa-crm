<template>
  <div class="staff-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>设置</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/setup/staff' }">员工列表</el-breadcrumb-item>
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
            <el-form-item label="员工角色">
              <el-select v-model="staffInfo.roleId" placeholder="请选择角色" @change="">
                <el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="电话号码">
              <el-input v-model="staffInfo.phoneNumber" placeholder="请输入电话号码"></el-input>
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
    data () {
      return {
        staffInfo: {
          headIconUrl: 'http://cdn.2tai.net/app/crm_head_defuat.png',
          nickName: null,
          phoneNumber: null,
          joinDate: null,
          roleId: null
        },
        role: []
      }
    },
    methods: {
      back () {
        router.go(-1)
      },
      getRole () {
        this.$http.get('/v2/crm/role/list').then(res => {
          console.log('获取角色信息', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.role = res.body.data
            this.staffInfo.roleId = this.role[0].id
          }
        }).catch(res => {
          console.log('获取角色信息异常', res)
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
          console.log(this.staffInfo)
          this.$http.post('/v2/aut/crm/user/update', this.staffInfo).then(res => {
            console.log('修改用户信息', res)
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.$message({
                message: '恭喜你，修改员工信息成功',
                type: 'success'
              })
              this.getStaffInfo()
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
