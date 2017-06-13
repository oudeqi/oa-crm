<template>
  <div class="warpper">
    <div class="header">
      <h1>联联办公自动化与客户关系系统</h1>
    </div>
    <el-row class="main">
      <el-col :sm="4" class="aside">
        <el-menu default-active="201" :default-openeds="defaultOpeneds" :unique-opened="uniqueOpened">
          <template v-for="(item, index) in userMenus">
            <el-menu-item :index="item.id+''" v-if="item.menus == null" :key="item.id">
              <i :class="item.icon"></i>
              <router-link :to="item.path || '/'">{{item.name}}</router-link>
            </el-menu-item>
            <el-submenu :index="index+1+''" v-else :key="item.id">
              <template slot="title"><i :class="item.icon"></i>{{item.name}}</template>
              <el-menu-item v-for="(i, idx) in item.menus" :index="i.id+''" :key="i.id">
                <router-link :to="i.path || '/'">{{i.name}}</router-link>
              </el-menu-item>
            </el-submenu>
          </template>
        </el-menu>
      </el-col>
      <el-col :sm="20" class="view">
        <router-view></router-view>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import Vue from 'vue'
  import router from '@/router'
  export default {
    name: 'index',
    data () {
      return {
        uniqueOpened: true,
        defaultOpeneds: ['2'],
        userMenus: [],
        allMenus: [{
          id: 2,
          name: '客户',
          path: '/customer',
          icon: 'el-icon-message',
          menus: [{
            id: 201,
            path: '/customer/my',
            name: '我的客户'
          }, {
            id: 202,
            path: '/customer/team',
            name: '团队客户'
          }, {
            id: 203,
            path: '/customer/sea',
            name: '公海客户'
          }, {
            id: 204,
            path: '/customer/mySea',
            name: '我的公海'
          }, {
            id: 204,
            path: '/customer/application',
            name: '申请处理'
          }]
        }, {
          id: 3,
          name: '预约',
          path: '/appointment',
          icon: 'el-icon-message',
          menus: [{
            id: 301,
            path: '/appointment/phone',
            name: '电话预约'
          }, {
            id: 302,
            path: '/appointment/platform',
            name: '平台预约'
          }, {
            id: 303,
            path: '/appointment/visit',
            name: '回访记录'
          }]
        }]
      }
    },
    computed: {},
    methods: {
      tokenWrong () {
        this.$alert('登录超时，请重新登录！', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            router.push('/login')
          }
        })
      }
    },
    beforeRouteEnter (to, from, next) {
      Vue.http.get('/v2/crm/userinfo').then(function (res) {
        console.log('token 登录', res)
        next(vm => {
//          console.log(res.body.data.userMenus)
          vm.userMenus = res.body.data.userMenus
        })
      }).catch(function (res) {
        console.log('token 登录出错', res)
        next(vm => {
          vm.tokenWrong()
        })
      })
    }
  }
</script>

<style lang="scss" scoped>
  .warpper{
    height: 100%;
    background: #eef1f6;
    .header{
      height:70px;
      background: #333;
      border-bottom: 1px solid #ddd;
      box-sizing: border-box;
      h1{
        line-height: 1.3;
        font-size: 20px;
        margin: 0;
        padding-top: 20px;
        text-align: center;
        color: #eeeeee;
      }
    }
    .main{
      height: 100%;
      margin-top: -70px;
      padding-top: 70px;
      a{
        color: inherit;
        text-decoration: none;
      }
      .view{
        min-height: 100%;
        background: #fff;
      }
    }
  }
</style>
