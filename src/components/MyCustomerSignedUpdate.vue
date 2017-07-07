<template>
  <div class="my-customer-add">
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item>客户</el-breadcrumb-item>
        <el-breadcrumb-item :to="{ path: '/customer/signed' }">我的签约</el-breadcrumb-item>
        <el-breadcrumb-item>签约修改</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="main">
      <div class="base-info">
        <h3>基本信息</h3>
        <div class="form-warpper">
          <el-form :model="signed" ref="base" label-width="100px" class="demo-ruleForm">

            <el-form-item label="客户">
              <el-select :remote-method="customerSearch" filterable remote v-model="customerS" placeholder="可以直接搜索">
                <el-option v-for="item in customerSAll" :key="item.id" :label="item.customerName"
                           :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="产品">
              <el-select @change="product2Change" v-model="signed.productnum" placeholder="请选择产品类型">
                <el-option v-for="item in product" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="二级">
              <el-select v-model="signed.productnum2" placeholder="请选择二级">
                <el-option v-for="item in product2" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="平台区域" prop="cityCode" v-if="signed.productnum==1 || signed.productnum==2">
              <el-cascader placeholder="请选择：试试搜索？" expand-trigger="hover" :options="cityOptions" filterable
                           v-model="signed.cityCode" @change="handleCityCodeChange"
                           :props="{value:'code',label:'name',children:'list'}">
              </el-cascader>
            </el-form-item>

            <el-form-item label="小说账户" v-if="signed.productnum==3">
              <el-input v-model="signed.storyAccount"></el-input>
            </el-form-item>

            <el-form-item label="是否拿票" v-if="signed.productnum==1">
              <el-tooltip placement="top">
                <el-switch v-model="signed.getTicket" on-color="#13ce66" off-color="#ff4949" on-value="true" on-text="是"
                           off-text="否" off-value="false">
                </el-switch>
              </el-tooltip>
            </el-form-item>

            <el-form-item label="旅游票区间" v-if="signed.productnum==1">
              <el-input type="number" v-model="signed.priceBegin"></el-input>
              <br/> 至
              <br/>
              <el-input type="number" v-model="signed.priceAfter"></el-input>
            </el-form-item>

            <el-form-item label="股权份数">
              <el-input type="number" v-model="signed.stock"></el-input>
            </el-form-item>

            <el-form-item label="实际收款">
              <el-input type="number" v-model="signed.gathering"></el-input>
            </el-form-item>

            <el-form-item label="总金额">
              <el-input type="number" v-model="signed.allmoney"></el-input>
            </el-form-item>
            <el-form-item label="备注信息" prop="remark">
              <el-input type="textarea" v-model="signed.remark"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="info" @click="signedGo">保存</el-button>

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
    name: 'myCustomerAdd',
    data () {
      return {
        goid: null,
        maxLen: 8,
        customerS: null,
        customerSAll: null,
        product: null,
        product2: null,
        addressList: null,
        signed: {
          cityCode: [],
          priceBegin: null,
          priceAfter: null,
          productnum: 1,
          productnum2: 1,
          signedMoney: null,
          address: 1,
          stock: null,
          remark: null,
          gathering: null,
          allmoney: null,
          storyAccount: null,
          getTicket: false
        },
        cityOptions: []
      }
    },
    methods: {
      signedGo () {
        var customerName = null
        var tripType
        var ertaiType
        var bookType
        console.log(bookType)
        console.log(this.customerS, '客户id')
        console.log(this.signed.productnum, '产品id')
        console.log(this.signed.productnum2, '二级id')
        console.log(this.signed.getTicket, '是否拿票 非结果')
        if (this.customerS) {} else {
          this.$message.error('请选择客户')
          return
        }
        if (this.signed.gathering) {} else {
          this.$message.error('请填写实际收款')
        }
        if (this.signed.allmoney) {} else {
          this.$message.error('请填写总金额')
        }

        var _this = this
        this.customerSAll.forEach(function (item, index) {
          if (_this.customerS === item.id) {
            customerName = item.customerName
          }
        })
        if (this.signed.productnum === 1) {
          tripType = this.signed.productnum2
          ertaiType = 0
          bookType = 0
        } else if (this.signed.productnum === 2) {
          tripType = 0
          ertaiType = this.signed.productnum2
          bookType = 0
        } else if (this.signed.productnum === 3) {
          if (this.signed.storyAccount) {} else {
            this.$message.error('请填写小说账户')
          }
          tripType = 0
          ertaiType = 0
          bookType = this.signed.productnum2
        }

        let code = ''
        if (this.signed.cityCode[2]) {
          code = this.signed.cityCode[2]
        } else if (this.signed.cityCode[1]) {
          code = this.signed.cityCode[1]
        } else {
          code = this.signed.cityCode[0]
        }
        let isGetTicket = null
        if (this.signed.getTicket === 'true' || this.signed.getTicket === true) {
          isGetTicket = 1
        } else {
          isGetTicket = 0
        }

        this.$http.post('/v2/aut/crm/sign/update', {
          id: this.goid,
          status: isGetTicket,
          cityCode: code,
          tripType: tripType,
          ertaiType: ertaiType,
          bookType: ertaiType,
          productId: this.signed.productnum,
          ticketBegin: this.signed.priceBegin,
          ticketEnd: this.signed.priceAfter,
          realMoney: this.signed.gathering,
          bookAccount: this.signed.storyAccount,
          money: this.signed.allmoney,
          stock: this.signed.stock,
          customerId: this.customerS,
          customerName: customerName,
          remarks: this.signed.remark
        }).then(res => {
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.$message.success('修改成功')
            this.customerS = null
            this.signed = {
              priceBegin: null,
              priceAfter: null,
              productnum: 1,
              productnum2: 1,
              address: 1,
              stock: null,
              remark: null,
              gathering: null,
              allmoney: null,
              storyAccount: null,
              getTicket: false
            }
          }
        }).catch(res => {
          this.$message.error('服务器繁忙！1')
        })
      },
      customerSearch (e) {
        console.log('搜索客户', e)
        if (e !== '') {
          setTimeout(() => {
            this.$http.get('/v1/aut/crm/my/customer', {
              params: {
                search: e,
                pageIndex: 1
              }
            }).then(res => {
              if (res.body.errMessage) {
                this.$message.error(res.body.errMessage)
              } else {
                this.customerSAll = res.body.data.data
                this.customerS = res.body.data.data[0].id
                console.log(this.customerSAll)
              }
            }).catch(res => {})
          }, 200)
        }
      },
      product2Change () {
        this.product2 = this.product[this.signed.productnum - 1].data
        console.log('二级菜单更改', this.product2)
      },
      getProduct () {
        this.$http.get('/v2/crm/config/list/type').then(res => {
          console.log(res)
          this.product = res.body.data
          this.product2 = res.body.data[0].data
        }).catch(res => {})
      },
      getAddressList () {
        this.$http.get('/v2/crm/line/list').then(res => {
          console.log(res)
          this.addressList = res.body.data
        }).catch(res => {
          console.log('获取路线列表失败', res)
        })
      },
      getCityList () {
        this.$http.get('/v1/aut/crm/city/list').then(res => {
          console.log('获取城市列表', res)
          this.cityOptions = res.body.data
        }).catch(res => {
          console.log('获取城市列表失败', res)
        })
      },
      back () {
        router.go(-1)
      },
      handleCityCodeChange (value) {
        console.log(value)
      },
      resetForm () {
        this.$refs['base'].resetFields()
      },
      getUpdateInfo () {
        this.$http.get('/v2/aut/crm/sign/details', {
          params: {
            id: this.goid
          }
        }).then(res => {
          console.log('获取签约详情', res.body.data)
          var k = res.body.data
          console.log(k.customerId)
          this.customerS = k.customerId
          this.customerSAll = [{
            customerName: k.customerName,
            id: k.customerId
          }]
          this.signed.productnum = k.productId
          if (this.signed.productnum === 1) {
            this.signed.productnum2 = k.tripType
          } else if (this.signed.productnum === 2) {
            this.signed.productnum2 = k.ertaiType
          } else if (this.signed.productnum === 3) {
            this.signed.productnum2 = k.bookType
          }
          let [code, cityCode] = [k.cityCode, []]
          cityCode[0] = code.substring(0, 2) + '0000'
          cityCode[1] = code.substring(0, 2) + code.substring(2, 4) + '00'
          cityCode[2] = code
          this.signed.cityCode = cityCode
          this.signed.stock = k.stock
          this.signed.gathering = k.realMoney
          this.signed.allmoney = k.money
          this.signed.remark = k.remarks
          this.signed.priceBegin = k.ticketBegin
          this.signed.priceAfter = k.ticketEnd
          if (k.status === 1 || k.status === '1') {
            this.signed.getTicket = 'true'
          } else {
            this.signed.getTicket = 'false'
          }
          this.signed.storyAccount = k.bookAccount
        }).catch(res => {})
      }
    },
    created () {
      this.goid = this.$route.params.id
      this.getUpdateInfo()
      this.getAddressList()
      this.getProduct()
      this.getCityList()
    }
  }
</script>

<style lang="scss" scoped>
  @import "../scss/_mixins.scss";

  .my-customer-add {
    .breadcrumb {
      padding: 20px;
      background: #fbfbfb;
    }
    .main {
      padding-left: 0;
      padding-right: 20px;
      margin-top: 20px;
      @include clearfix();
      .btn-warpper {
        padding: 10px 20px 20px;
      }
      h3 {
        background-color: #fbfbfb;
        margin: 0;
        padding: 15px 20px;
        color: #444;
        font-size: 18px;
      }
      .form-warpper {
        padding-right: 20px;
        margin-top: 20px;
        .el-select,
        .el-cascader {
          width: 100%;
        }
        .el-select,
        .el-input,
        .el-textarea,
        .el-cascader {
          max-width: 280px;
        }
      }
      .base-info {
        float: left;
        width: 40%;
        padding-right: 8%;
        padding-left: 7%;
      }
      .follow-info {
        float: left;
        width: 55%;
      }
    }
  }
</style>
