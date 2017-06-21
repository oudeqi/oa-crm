<template>
  <div class="add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>预约</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/appointment/platform' }">平台预约</el-breadcrumb-item>
        <el-breadcrumb-item>添加平台预约</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="base-info">
        <h3>填写预约信息</h3>
        <div class="form-warpper">
          <el-form :model="appointmentInfo" label-width="100px" class="demo-ruleForm">
            <el-form-item label="选择站点">
              <el-select v-model="value9" filterable remote placeholder="请输入: 站点 / 联系人" :remote-method="searchStation" :loading="loading">
                <el-option v-for="item in options4" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="联系人姓名">
              <el-input v-model="appointmentInfo.touristName" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="appointmentInfo.touristPhone" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="联系人微信">
              <el-input v-model="appointmentInfo.wechat" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="联系人身份证">
              <el-input v-model="appointmentInfo.touristId" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="预约人数">
              <el-input v-model="appointmentInfo.number" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="票号区间">
              <el-input v-model="appointmentInfo.ticketBegin" placeholder="请输入电话号码"></el-input>
              <el-input v-model="appointmentInfo.ticketBegin" placeholder="ticketEnd"></el-input>
            </el-form-item>
            <el-form-item label="选择线路">
              <el-input v-model="appointmentInfo.ticketEnd" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="选择时间">
              <el-input v-model="appointmentInfo.tripDate" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="流程状态">
              <el-input v-model="appointmentInfo.status" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input v-model="appointmentInfo.remarks" placeholder="请输入电话号码"></el-input>
            </el-form-item>

            <!--<el-form-item label="员工角色">-->
              <!--<el-select v-model="staffInfo.roleId" placeholder="请选择角色" @change="">-->
                <!--<el-option v-for="item in role" :key="item.id" :label="item.name" :value="item.id"></el-option>-->
              <!--</el-select>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="电话号码">-->
              <!--<el-input v-model="staffInfo.phoneNumber" placeholder="请输入电话号码"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="初始密码">-->
              <!--<el-input v-model="staffInfo.password" placeholder="请输入初始密码"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="基本薪资">-->
              <!--<el-input v-model.number="staffInfo.baseSalary" placeholder="请输入整数"></el-input>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="入职时间">-->
              <!--<el-date-picker v-model="staffInfo.joinDate" align="right" type="date" placeholder="选择日期"></el-date-picker>-->
            <!--</el-form-item>-->
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
    name: 'appointmentPlatformAdd',
    data () {
      return {
        loading: false,
        value9: null,
        options4: [],
        appointmentInfo: {
          customerId: 8,
          customerName: '昆山招聘',
          serviceUid: 1,
          serviceName: '尚丹丹',
          touristId: 0,
          touristName: null,
          touristPhone: 0,
          age: 0,
          number: 0,
          wechat: null,
          ticketBegin: 0,
          ticketEnd: 0,
          lineId: 0,
          tripDate: null,
          remarks: null,
          type: 0,
          status: 0
        },
        states: ['Alabama', 'Alaska', 'Arizona',
          'Arkansas', 'California', 'Colorado',
          'Connecticut', 'Delaware', 'Florida']
      }
    },
    mounted () {
      this.list = this.states.map(item => {
        return { value: item, label: item }
      })
    },
    methods: {
      back () {
        router.go(-1)
      },
      submitForm () {
        if (!this.staffInfo.nickName || !this.staffInfo.phoneNumber || !this.staffInfo.roleId || !this.staffInfo.joinDate || !this.staffInfo.password || !this.staffInfo.baseSalary) {
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
      },
      searchStation (query) {
        if (query !== '') {
          this.loading = true
          setTimeout(() => {
            this.loading = false
            this.options4 = this.list.filter(item => {
              return item.label.toLowerCase()
                  .indexOf(query.toLowerCase()) > -1
            })
          }, 2000)
        } else {
          this.options4 = []
        }
      }
    }
  }
</script>

<style lang="scss" scoped>

  @import "../scss/_mixins.scss";
  .add{
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
