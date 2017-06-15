<template>
  <div class="warpper">
    <div class="header">
      <h1>联联办公自动化与客户关系系统</h1>
    </div>
    <el-row class="main">
      <el-col :sm="4" class="aside">
        <el-menu :default-active="defaultActive" :router="router" :default-openeds="defaultOpeneds" :unique-opened="uniqueOpened">
          <template v-for="item in userMenus">
            <el-menu-item :index="item.id+''" v-if="item.menus == null" :key="item.id" :route="{path:item.path || '/'}">
              <i :class="item.icon"></i>{{item.name}}
            </el-menu-item>
            <el-submenu :index="item.id+''" v-else :key="item.id">
              <template slot="title"><i :class="item.icon"></i>{{item.name}}</template>
              <el-menu-item v-for="i in item.menus" :index="i.id+''" :key="i.id" :route="{path:i.path || '/'}">
                {{i.name}}
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
  /*
  * http://crm.2tai.net/#/
  * 15828459830
  * 98308182
  * */
  import Vue from 'vue'
  import router from '@/router'

  export default {
    name: 'index',
    data () {
      return {
        uniqueOpened: true,
        router: true,
        defaultActive: '',
        defaultOpeneds: [],
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
        router.push('/no-resource')
        this.$alert('登录超时，请重新登录！', '提示', {
          confirmButtonText: '确定',
          callback: action => {
            router.push('/login')
          }
        })
      },
      menuSelect () {
        let path = this.$route.path.split('/')
        this.allMenus.forEach(value => {
          if (value.path.split('/')[1] === path[1]) {
            this.defaultOpeneds = [value.id + '']
            if (value.menus.length >= 0) {
              value.menus.forEach(val => {
                if (val.path.split('/')[2] === path[2]) {
                  this.defaultActive = val.id + ''
                }
              })
            }
          }
        })
      }
    },
    watch: {
      '$route': 'menuSelect'
    },
    created () {
      this.menuSelect()
    },
    beforeRouteEnter (to, from, next) {
      Vue.http.get('/v2/aut/crm/userinfo').then(function (res) {
        console.log('token 登录', res)
        next(vm => {
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
        text-align: left;
        padding-left: 20px;
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
