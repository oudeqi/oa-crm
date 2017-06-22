<template>
  <div class="edit">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>预约</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/appointment/platform' }">平台预约</el-breadcrumb-item>
        <el-breadcrumb-item>
          <span @click="back">预约详情</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>平台预约修改</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="base-info">
        <h3>修改预约信息</h3>
        <div class="form-warpper">
          <el-form :model="appointmentInfo" label-width="100px" class="demo-ruleForm">
            <el-form-item label="选择站点">
              <el-select v-model="station" clearable remote placeholder="请搜索: 站点 / 联系人" :remote-method="searchStation" :loading="loading">
                <el-option v-for="item in stations" :key="item.id" :label="item.customerName" :value="item"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="选择线路">
              <el-select v-model="appointmentInfo.lineId" placeholder="请选择路线">
                <el-option v-for="item in lines" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="行程时间">
              <el-date-picker v-model="appointmentInfo.tripDate" align="left" type="date" placeholder="选择日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="预约人数">
              <el-input v-model="appointmentInfo.number" type="number" placeholder="请输入预约人数"></el-input>
            </el-form-item>
            <el-form-item label="流程状态">
              <el-select v-model="appointmentInfo.status" placeholder="请输选择状态">
                <el-option label="未出行" :value="1"></el-option>
                <el-option label="已出行" :value="2"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="票号区间">
              <el-input class="range" type="number" v-model="appointmentInfo.ticketBegin" placeholder="票号开始"></el-input> -
              <el-input class="range" type="number" v-model="appointmentInfo.ticketEnd" placeholder="票号结束"></el-input>
            </el-form-item>
            <el-form-item label="联系人姓名">
              <el-input v-model="appointmentInfo.touristName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="联系电话">
              <el-input v-model="appointmentInfo.touristPhone" type="number" placeholder="请输入电话号码"></el-input>
            </el-form-item>
            <el-form-item label="联系人微信">
              <el-input v-model="appointmentInfo.wechat" placeholder="请输入微信号"></el-input>
            </el-form-item>
            <el-form-item label="联系人身份证">
              <el-input v-model="appointmentInfo.touristId" placeholder="请输入联系人身份证号码"></el-input>
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input v-model="appointmentInfo.remarks" type="textarea" :rows="2" placeholder="请输入备注信息"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="submitForm">确认修改</el-button>
              <el-button @click="reload">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import router from '../router'
  import {getUser} from '../const'
  export default {
    name: 'platformAppointmentEdit',
    data () {
      return {
        loading: false,
        lines: [],
        stations: [],
        station: {},
        appointmentInfo: {
          customerId: null,
          customerName: null,
          serviceUid: getUser().id,
          serviceName: getUser().name,
          touristId: null,
          touristName: null,
          touristPhone: null,
          age: null,
          number: null,
          wechat: null,
          ticketBegin: null,
          ticketEnd: null,
          lineId: null,
          tripDate: null,
          remarks: null,
          type: null,
          status: null
        }
      }
    },
    watch: {
      appointmentInfo () {
        this.stations = [{
          id: this.appointmentInfo.customerId,
          customerName: this.appointmentInfo.customerName
        }]
        this.station = this.stations[0]
      }
    },
    methods: {
      back () {
        router.go(-1)
      },
      reload () {
        location.reload()
      },
      searchStation (query) {
        if (query !== '') {
          this.loading = true
          this.$http.get('/v2/aut/crm/customer/list/master/all', {
            params: {
              search: query
            }
          }).then((res) => {
            this.loading = false
            console.log('获取站长列表', res)
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.stations = res.body.data.data
            }
          }).catch((res) => {
            this.loading = false
            console.log('获取站长列表异常', res)
            this.$message.error('获取获取站长列表异常，请刷新重试！')
          })
        } else {
          this.stations = []
        }
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
            this.appointmentInfo = res.body.data
          }
        }).catch(res => {
          console.log('获取预约详情异常', res)
          this.$message.error('服务器繁忙')
        })
      },
      getLine () {
        this.$http.get('/v2/crm/line/list').then((res) => {
          console.log('获取线路列表', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.lines = res.body.data
          }
        }).catch((res) => {
          console.log('获取线路列表异常', res)
          this.$message.error('获取线路列表异常，请刷新重试！')
        })
      },
      submitForm () {
        this.$confirm('确定预约信息正确且完整, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let postInfo = {
            customerId: this.appointmentInfo.customerId,
            customerName: this.appointmentInfo.customerName,
            serviceUid: this.appointmentInfo.serviceUid,
            serviceName: this.appointmentInfo.serviceName,
            touristId: this.appointmentInfo.touristId,
            touristName: this.appointmentInfo.touristName,
            touristPhone: this.appointmentInfo.touristPhone,
            age: this.appointmentInfo.age,
            number: this.appointmentInfo.number,
            wechat: this.appointmentInfo.wechat,
            ticketBegin: this.appointmentInfo.ticketBegin,
            ticketEnd: this.appointmentInfo.ticketEnd,
            lineId: this.appointmentInfo.lineId,
            tripDate: new Date(this.appointmentInfo.tripDate).getTime(),
            remarks: this.appointmentInfo.remarks,
            type: this.appointmentInfo.type,
            status: this.appointmentInfo.status,
            id: this.$route.params.id
          }
          console.log(this.appointmentInfo)
          console.log(postInfo)
          this.$http.post('/v2/aut/crm/reservation/update', postInfo).then(res => {
            console.log('修改预约信息', res)
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.$message({
                message: '恭喜你，修改预约信息成功',
                type: 'success'
              })
            }
          }).catch(res => {
            console.log('修改预约信息失败', res)
            this.$message.error('服务器繁忙，请重试！')
          })
        }).catch(() => {})
      }
    },
    created () {
      this.getLine()
      this.getDetail()
    }
  }
</script>

<style lang="scss" scoped>

  @import "../scss/_mixins.scss";
  .edit{
    .range{
      max-width: 134px !important;
    }
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
