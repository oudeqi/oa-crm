<template>
  <div class="warpper">
    <div class="header">
      <h1>联联办公自动化与客户关系系统</h1>

      <div class="media">
        <el-dropdown trigger="hover" :hide-on-click="false"  @command="handleDropdownItemClick">
          <div class="el-dropdown-link">
            <a class="dropdown-trigger" href="javascript:void(0);">
              <div class="media-left">
                <img :src="headIconUrl" alt="">
              </div>
              <div class="media-body">
                <p class="hello">你好，</p>
                <h4 class="name">{{nickName}}</h4>
              </div>
              <div class="media-right">
                <i class="el-icon-caret-bottom"></i>
              </div>
            </a>
          </div>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <!--<div class="media-left">-->
          <!--<img :src="headIconUrl" alt="">-->
        <!--</div>-->
        <!--<div class="media-body">-->
          <!--<p class="hello">你好，</p>-->
          <!--<h4 class="name">{{nickName}}</h4>-->
        <!--</div>-->
      </div>
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
  * 15828459830 18989193368
  * 98308182 88664422
  * */
  import Vue from 'vue'
  import router from '@/router'
  import {token, removeToken} from '../const'

  export default {
    name: 'index',
    data () {
      return {
        uniqueOpened: true,
        router: true,
        defaultActive: '',
        defaultOpeneds: [],
        userMenus: [],
        headIconUrl: '',
        nickName: '',
        phoneNumber: '',
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
            path: '/customer/my-sea',
            name: '我的公海'
          }, {
            id: 205,
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
      },
      handleDropdownItemClick (command) {
        console.log(command)
        if (command === 'logout') {
          this.logout()
        }
      },
      logout () {
        this.$confirm('即将退出登录，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          removeToken()
          Vue.http.headers.custom['Authorization'] = token
          router.push('/login')
        }).catch(() => {})
      }
    },
    watch: {
      '$route': 'menuSelect'
    },
    created () {
      this.menuSelect()
    },
    beforeRouteEnter (to, from, next) {
//      console.log(Vue)
//      next()
      Vue.http.get('/v2/aut/crm/userinfo').then(function (res) {
        console.log('token 登录', res)
        if (res.body.errMessage) {
          next(vm => {
            router.push('/login')
          })
        } else {
          next(vm => {
            vm.userMenus = res.body.data.userMenus
            vm.headIconUrl = res.body.data.headIconUrl
            vm.nickName = res.body.data.nickName
            vm.phoneNumber = res.body.data.phoneNumber
          })
        }
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

  @import "../scss/mixins.scss";

  .el-dropdown-menu{
    margin-top: 10px;
    font-size: 15px;
  }
  .warpper{
    height: 100%;
    .header{
      height:60px;
      background: #222;
      border-bottom: 1px solid #ddd;
      box-sizing: border-box;
      position: relative;
      h1{
        line-height: 1.3;
        font-size: 20px;
        margin: 0;
        line-height:60px;
        text-align: left;
        padding-left: 20px;
        color: #eeeeee;
      }
      .media{
        position: absolute;
        z-index: 2;
        top:0;
        right: 10px;
        height: 100%;
        padding: 0 15px;
        background-color: #333;
        .dropdown-trigger{
          display: block;
          margin-top: 10px;
          @include clearfix();
          .media-left{
            float: left;
            height: 40px;
            width: 40px;
            border-radius: 50%;
            overflow: hidden;
            margin-right: 8px;
            img{
              display: block;
              max-height: 100%;
              max-width: 100%;
            }
          }
          .media-body{
            float: left;
            height: 100%;
            margin-right: 8px;
            .hello{
              color: #eee;
              margin: 0;
              line-height: 1;
              font-size: 12px;
              padding-top: 7px;
            }
            .name{
              color: #eee;
              line-height: 1;
              margin: 0;
              font-size: 14px;
              padding-top: 4px;
              font-weight: normal;
            }
          }
          .media-right{
            float: left;
            color: #eee;
            padding-top: 18px;
            font-size: 12px;
          }
        }
      }
    }
    .main{
      height: 100%;
      margin-top: -60px;
      padding-top: 60px;
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
