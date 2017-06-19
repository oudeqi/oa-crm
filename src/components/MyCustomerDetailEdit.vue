<template>
  <div class="my-customer-edit">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客户</el-breadcrumb-item>
        <!--<el-breadcrumb-item :to="{ path: '/customer/my' }">我的客户</el-breadcrumb-item>-->
        <el-breadcrumb-item>
          <span @click="back">客户详情</span>
        </el-breadcrumb-item>
        <el-breadcrumb-item>编辑客户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <div class="main">
      <div class="base-info">
        <h3>基本信息</h3>
        <div class="form-warpper">
          <el-form :model="customerInfo" label-width="100px" class="demo-ruleForm">
            <el-form-item label="平台名称">
              <el-input v-model="customerInfo.customerName"></el-input>
            </el-form-item>
            <el-form-item label="平台区域">
              <el-cascader placeholder="请选择区域" expand-trigger="hover" :options="cityOptions"
                           filterable v-model="customerInfo.cityCode"
                           @change="handleCityCodeChange" :props="{value:'code',label:'name',children:'list'}"></el-cascader>
            </el-form-item>
            <el-form-item label="负责人名">
              <el-input v-model="customerInfo.mainPerson"></el-input>
            </el-form-item>
            <el-form-item label="微信号码">
              <el-input v-model="customerInfo.mainWeChat"></el-input>
            </el-form-item>
            <el-form-item label="手机号码">
              <el-input v-model.number="customerInfo.mainPhoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="职位名称">
              <el-input v-model="customerInfo.job"></el-input>
            </el-form-item>
            <el-form-item label="客户状态">
              <el-select v-model="customerInfo.status" placeholder="请选择客户状态">
                <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注信息">
              <el-input type="textarea" v-model="customerInfo.remarks"></el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="follow-info">
        <h3>其他人联系信息</h3>
        <div class="form-warpper">
          <el-form :model="customerInfo" label-width="100px" class="demo-ruleForm">
            <el-form-item label="联系人">
              <el-input v-model="customerInfo.subPerson"></el-input>
            </el-form-item>
            <el-form-item label="微信">
              <el-input v-model="customerInfo.subWeChat"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
              <el-input v-model="customerInfo.subPhoneNumber"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="submitForm">保存</el-button>
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
    name: 'myCustomerDetailEdit',
    data () {
      return {
        states: null,
        customerInfo: {
          customerName: null,
          cityCode: [],
          mainPerson: null,
          mainWeChat: null,
          mainPhoneNumber: null,
          job: null,
          status: null,
          remarks: null,
          subPerson: null,
          subWeChat: null,
          subPhoneNumber: null
        },
        rules: {
          customerName: [
            { required: true, message: '请输入平台名称', trigger: 'blur' }
          ],
          cityCode: [
            { required: true, message: '请选择平台区域', trigger: 'change' }
          ],
          mainPerson: [
            { required: true, message: '请输入平台负责人', trigger: 'blur' }
          ],
          mainWeChat: [
            { required: true, message: '请输入平台负责人微信号', trigger: 'blur' }
          ],
          mainPhoneNumber: [
            { required: true, message: '请输入平台负责人手机号码', trigger: 'blur' },
            { type: 'number', message: '请输入正确的手机号码', trigger: 'blur' }
          ],
          job: [
            { required: true, message: '请输入负责人职位', trigger: 'blur' }
          ],
          status: [
            { required: true, message: '请选择客户状态', trigger: 'change' }
          ],
          remarks: [
            { required: true, message: '请输入备注信息', trigger: 'blur' }
          ],
          subPhoneNumber: [
            { type: 'number', message: '请输入正确的手机号码', trigger: 'blur' }
          ]
        },
        cityOptions: []
      }
    },
    methods: {
      back () {
        router.go(-1)
      },
      getStates () {
        this.states = [{
          label: '新建',
          value: '1'
        }, {
          label: '拒绝',
          value: '2'
        }, {
          label: '未回应',
          value: '3'
        }, {
          label: '初步了解',
          value: '4'
        }, {
          label: '意向',
          value: '5'
        }, {
          label: '重点维护',
          value: '6'
        }, {
          label: '签约',
          value: '7'
        }]
        this.customerInfo.status = this.states[0].value
      },
      handleCityCodeChange (value) {
        console.log(value)
      },
      getCustomerInfo () {
        this.$http.get('/v1/aut/crm/customer/id', {
          params: {
            id: this.$route.params.id
          }
        }).then(res => {
          console.log('获取客户信息', res)
          this.customerInfo.customerName = res.body.data.customerName
          let [code, cityCode] = [res.body.data.cityCode, []]
          cityCode[0] = code.substring(0, 2) + '0000'
          cityCode[1] = code.substring(0, 2) + code.substring(2, 4) + '00'
          cityCode[2] = code
          this.customerInfo.cityCode = cityCode
          this.customerInfo.mainPerson = res.body.data.mainPerson
          this.customerInfo.mainWeChat = res.body.data.mainWeChat
          this.customerInfo.mainPhoneNumber = res.body.data.mainPhoneNumber
          this.customerInfo.job = res.body.data.job
          this.customerInfo.status = res.body.data.status + ''
          this.customerInfo.remarks = res.body.data.remarks
        }).catch(res => {
          console.log('获取客户信息异常', res)
        })
      },
      getCityList () {
        this.$http.get('/v1/aut/crm/city/list').then(res => {
          console.log('获取城市列表', res)
          this.cityOptions = res.body.data
          this.getCustomerInfo()
        }).catch(res => {
          console.log('获取城市列表失败', res)
        })
      },
      submitForm () {
        this.$confirm('确定要对客户信息进行编辑吗, 是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.customerInfo)
          let code = ''
          if (this.customerInfo.cityCode[2]) {
            code = this.customerInfo.cityCode[2]
          } else if (this.customerInfo.cityCode[1]) {
            code = this.customerInfo.cityCode[1]
          } else {
            code = this.customerInfo.cityCode[0]
          }
          this.$http.post('/v1/aut/crm/customer/update', {
            customerName: this.customerInfo.customerName,
            cityCode: code,
            mainPerson: this.customerInfo.mainPerson,
            mainPhoneNumber: this.customerInfo.mainPhoneNumber,
            mainWeChat: this.customerInfo.mainWeChat,
            job: this.customerInfo.job,
            remarks: this.customerInfo.remarks,
            subPerson: this.customerInfo.subPerson,
            subPhoneNumber: this.customerInfo.subPhoneNumber,
            subWeChat: this.customerInfo.subWeChat,
            status: this.customerInfo.status,
            signType: this.customerInfo.signType,
            id: this.$route.params.id
          }).then(res => {
            console.log('修改用户信息', res)
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.$message({
                message: '恭喜你，修改用户信息成功',
                type: 'success'
              })
            }
          }).catch(res => {
            console.log('修改用户信息失败', res)
            this.$message.error('服务器繁忙，请重试！')
          })
        }).catch(() => {})
      }
    },
    created () {
      this.getStates()
      this.getCityList()
    }
  }
</script>

<style lang="scss" scoped>

  @import "../scss/_mixins.scss";

  .my-customer-edit{
    .breadcrumb{
      padding: 20px;
      background: #fbfbfb;
    }
    .main{
      padding-left: 0;
      padding-right: 20px;
      margin-top: 20px;
      @include clearfix();
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
        padding-right: 20px;
        margin-top: 20px;
        .el-select,.el-cascader{
          width: 100%;
        }
        .el-select,.el-input,.el-textarea,.el-cascader{
          max-width: 280px;
        }
      }
      .base-info{
        float: left;
        width: 30%;
        padding-right: 8%;
        padding-left: 7%;

      }
      .follow-info{
        float: left;
        width: 55%;
      }
    }
  }
</style>
