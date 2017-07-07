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
            <el-dropdown-item command="modifyPass">修改密码</el-dropdown-item>
            <el-dropdown-item command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
    </div>
    <el-row class="main">
      <el-col :sm="4" class="aside">
        <el-menu :default-active="defaultActive" :default-openeds="defaultOpeneds" :router="true" :unique-opened="true">
          <template v-for="item in userMenus">
            <el-menu-item :index="item.id" v-if="item.menus == null" :key="item.id" :route="{path:item.path || '/'}">
              <i :class="item.icon"></i>{{item.name}}
            </el-menu-item>
            <el-submenu :index="item.id" v-else :key="item.id">
              <template slot="title"><i :class="item.icon"></i>{{item.name}}</template>
              <el-menu-item v-for="i in item.menus" :index="i.id" :key="i.id" :route="{path:i.path || '/'}">
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
    <el-dialog class="modify-pass" @close="" title="修改密码" v-model="isModalOpen" :close-on-click-modal="false">
      <el-form :model="pwd" label-width="100px">
        <el-form-item label="旧密码">
          <el-input type="text"  placeholder="请输入旧密码" v-model="pwd.old"></el-input>
        </el-form-item>
        <el-form-item label="新密码">
          <el-input type="text"  placeholder="请输入新密码" v-model="pwd.new"></el-input>
        </el-form-item>
        <el-form-item label="重复新密码">
          <el-input type="text"  placeholder="请重复输入新密码" v-model="pwd.reNew"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="isModalOpen = false">取 消</el-button>
        <el-button type="primary" @click="modifyPass">确 定</el-button>
      </div>
    </el-dialog>
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
  import {getToken, setToken, setUser, getUser} from '../const'

  export default {
    name: 'index',
    data () {
      return {
        isModalOpen: false,
        pwd: {
          old: null,
          new: null,
          reNew: null
        },
        defaultActive: null,
        defaultOpeneds: [],
        userMenus: [],
        headIconUrl: '',
        nickName: '',
        phoneNumber: ''
      }
    },
    computed: {},
    methods: {
      modifyPass: function () {
        if (!this.pwd.old) {
          this.$message.error('请输入原密码')
          return
        }
        if (!this.pwd.new) {
          this.$message.error('请输入新密码')
          return
        }
        if (!this.pwd.reNew) {
          this.$message.error('请重复输入新密码')
          return
        }
        if (this.pwd.reNew !== this.pwd.new) {
          this.$message.error('两次密码输入不一致')
          return
        }
        this.$http.post('/v2/aut/crm/update/password', {
          uid: getUser().id,
          oldPassword: this.pwd.old,
          newPassword: this.pwd.new
        }).then((res) => {
          console.log('修改密码', res)
          if (res.body.errMessage) {
            this.$message.error(res.body.errMessage)
          } else {
            this.$message({
              message: '恭喜你，修改密码成功，请牢记新密码',
              type: 'success'
            })
            this.isModalOpen = false
          }
        }).catch((res) => {
          this.$message.error('服务器繁忙')
        })
      },
      tokenWrong () {
        router.push('/no-resource')
      },
      menuSelect () {
        let path = this.$route.path.split('/')
//        console.log(path)
//        console.log(this.userMenus)
        this.userMenus.forEach(value => {
          if (!!value.path && value.path.split('/')[1] === path[1]) {
            if (!!value.menus && value.menus.length > 0) {
              value.menus.forEach(val => {
                if (!!val.path && val.path.split('/')[2] === path[2]) {
                  this.defaultActive = val.id
                }
              })
            }
            this.defaultOpeneds = [value.id]
          }
        })
      },
      handleDropdownItemClick (command) {
        if (command === 'logout') {
          this.logout()
        }
        if (command === 'modifyPass') {
          this.pwd.old = null
          this.pwd.new = null
          this.pwd.reNew = null
          this.isModalOpen = true
        }
      },
      logout () {
        this.$confirm('即将退出登录，是否继续？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          setToken(null)
          setUser(null)
          Vue.http.headers.custom['Authorization'] = getToken()
          router.push('/login')
        }).catch(() => {})
      }
    },
    watch: {
      '$route': 'menuSelect'
    },
    beforeRouteEnter (to, from, next) {
      Vue.http.get('/v2/aut/crm/userinfo').then(function (res) {
        console.log('token 登录', res)
        if (res.body.errMessage) {
          router.push('/login')
        } else {
          next(vm => {
            setUser({
              id: res.body.data.uid,
              name: res.body.data.nickName,
              headPic: res.body.data.headIconUrl,
              phone: res.body.data.phoneNumber
            })
            vm.headIconUrl = res.body.data.headIconUrl
            vm.nickName = res.body.data.nickName
            vm.phoneNumber = res.body.data.phoneNumber
            let userMenus = res.body.data.userMenus
            userMenus.forEach(value => {
              value.id = value.id + ''
              if (!!value.menus && value.menus.length >= 0) {
                value.menus.forEach((val) => {
                  val.id = val.id + ''
                })
              }
            })
            vm.userMenus = userMenus
            vm.menuSelect()
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

<style lang="scss">
  .modify-pass{
    .el-dialog__body{
      padding-bottom: 0;
    }
  }
</style>

<style lang="scss" scoped>

  @import "../scss/mixins.scss";

  .el-dropdown-menu{
    margin-top: 10px;
    font-size: 14px;
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
