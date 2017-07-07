<template>
  <div class="my-customer-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客户</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/customer/my' }">我的客户</el-breadcrumb-item>
        <el-breadcrumb-item>新建客户</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="base-info">
        <h3>基本信息</h3>
        <div class="form-warpper">
          <el-form :model="customerInfo" ref="base" label-width="100px" class="demo-ruleForm">
            <el-form-item label="平台名称" prop="customerName">
              <el-input v-model="customerInfo.customerName" @change="search" @blur="checkCustomerName"></el-input>
            </el-form-item>
            <el-form-item label="平台区域" prop="cityCode">
              <el-cascader placeholder="请选择：试试搜索？" expand-trigger="hover" :options="cityOptions"
                           filterable v-model="customerInfo.cityCode"
                           @change="handleCityCodeChange" :props="{value:'code',label:'name',children:'list'}">
              </el-cascader>
            </el-form-item>
            <el-form-item label="负责人名" prop="mainPerson">
              <el-input v-model="customerInfo.mainPerson"></el-input>
            </el-form-item>
            <el-form-item label="微信号码" prop="mainWeChat">
              <el-input v-model="customerInfo.mainWeChat"></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop="mainPhoneNumber">
              <el-input v-model.number="customerInfo.mainPhoneNumber"></el-input>
            </el-form-item>
            <el-form-item label="职位名称" prop="job">
              <el-input v-model="customerInfo.job"></el-input>
            </el-form-item>
            <el-form-item label="客户状态">
              <el-select v-model="customerInfo.status" placeholder="请选择客户状态">
                <el-option v-for="item in states" :key="item.value" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="备注信息" prop="remarks">
              <el-input type="textarea" v-model="customerInfo.remarks"></el-input>
            </el-form-item>
          </el-form>
        </div>
        <h3>其他联系人信息</h3>
        <div class="form-warpper">
          <el-form :model="customerInfo" ref="other" label-width="100px" class="demo-ruleForm">
            <el-form-item label="联系人" prop="subPerson">
              <el-input v-model="customerInfo.subPerson"></el-input>
            </el-form-item>
            <el-form-item label="微信" prop="subWeChat">
              <el-input v-model="customerInfo.subWeChat"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="subPhoneNumber">
              <el-input v-model="customerInfo.subPhoneNumber"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="submitForm">立即创建</el-button>
              <el-button @click="back">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
      <div class="follow-info">
        <h3>平台搜索结果</h3>
        <ul class="search-result">
          <li v-for="item in searchResult" :key="item.id"><p v-html="item.nameHtml"></p></li>
        </ul>
        <p class="no-result" v-show="searchResult.length == 0">暂无结果</p>
      </div>
    </div>
  </div>
</template>

<script>
  import router from '../router'
  export default {
    name: 'myCustomerAdd',
    data () {
      return {
        states: null,
        searchResult: [],
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
        cityOptions: []
      }
    },
    methods: {
      trim: function (str) {
        return str.replace(/(^\s*)|(\s*$)/g, '')
      },
      search: function () {
        this.$http.get('/v1/aut/crm/customer/search', {
          params: {
            search: this.trim(this.customerInfo.customerName)
          }
        }).then(res => {
          console.log('搜索平台', res)
          if (res.body.errMessage) {
            this.searchResult = []
          } else {
            res.body.data.forEach((value) => {
              let html = '<span style="color: red;">' + this.trim(this.customerInfo.customerName) + '</span>'
              if (value.customerName) {
                value.nameHtml = value.customerName.replace(this.trim(this.customerInfo.customerName), html)
              } else {
                value.nameHtml = html
              }
            })
            this.searchResult = res.body.data
          }
        }).catch(res => {
          console.log('搜索平台失败', res)
          this.searchResult = []
        })
      },
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
      getCityList () {
        this.$http.get('/v1/aut/crm/city/list').then(res => {
          console.log('获取城市列表', res)
          this.cityOptions = res.body.data
        }).catch(res => {
          console.log('获取城市列表失败', res)
        })
      },
      resetForm () {
        this.$refs['base'].resetFields()
        this.$refs['other'].resetFields()
      },
      submitForm () {
        this.$confirm('确定信息已经完整？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'info'
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
          this.$http.post('/v1/aut/crm/customer', {
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
            signType: this.customerInfo.signType
          }).then(res => {
            console.log('添加客户信息', res)
            if (res.body.errMessage) {
              this.$message.error(res.body.errMessage)
            } else {
              this.resetForm()
              this.$message({
                message: '恭喜你，添加客户信息成功',
                type: 'success'
              })
            }
          }).catch(res => {
            console.log('添加客户信息失败', res)
            this.$message.error('服务器繁忙，请重试！')
          })
        }).catch(() => {})
      },
      checkCustomerName () {
        if (this.customerInfo.customerName) {
          this.$http.post('/v1/aut/crm/customer/check', {
            customerName: this.customerInfo.customerName
          }).then(res => {
            console.log('检查客户名称', res)
            if (res.body.errMessage) {
              const h = this.$createElement
              this.$notify.error({
                title: '提示',
                message: h('p', {style: 'color: #666'}, res.body.errMessage),
                offset: 80,
                duration: 5000
              })
            }
          }).catch(res => {
            console.log('检查客户名称失败', res)
          })
        }
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

  .my-customer-add{
    .search-result{
      margin: 0;
      padding: 0;
      padding-left: 20px;
      list-style: none;
      font-size: 14px;
      margin-top: 15px;
      li{
        margin: 0;
        padding: 0;
        margin-bottom: 10px;
        p{
          margin: 0;
          padding: 4px 14px;
          line-height: 1.3;
        }
      }
    }
    .no-result{
      color: #ccc;
      padding-left: 30px;
      font-size: 15px;
    }
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
        width: 40%;
        padding-right: 8%;
        padding-left: 7%;

      }
      .follow-info{
        float: left;
        width: 45%;
      }
    }
  }
</style>
