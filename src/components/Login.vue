<template>
  <div class="warpper">
    <div class="header">
      <h1>联联办公自动化与客户关系系统</h1>
    </div>
    <div class="main">
      <el-form :label-position="position" label-width="80px" :model="login">
        <el-form-item label="用户名">
          <el-input type="text" v-model="login.userName"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input type="password" v-model="login.password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="onSubmit">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
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
import {setToken, getToken} from '../const'
export default {
  name: 'login',
  data () {
    return {
      position: 'left',
      login: {
        userName: '',
        password: ''
      }
    }
  },
  methods: {
    onSubmit () {
      if (this.login.userName === '' || this.login.password === '') {
        return
      } else {
        console.log(this.login.userName, this.login.password)
        this.$http.post('/v2/crm/user', {
          phoneNumber: this.login.userName,
          password: this.login.password
        }).then(function (res) {
          console.log('用户登录', res)
          if (res.body.errMessage) {
            this.$message({
              showClose: true,
              message: res.body.errMessage,
              type: 'error'
            })
          } else {
            setToken(res.body.data.token)
            Vue.http.headers.common['Authorization'] = getToken()
            router.push('/')
          }
        }).catch(function (res) {
          console.log(res)
          this.$message({
            showClose: true,
            message: '服务器连接超时',
            type: 'error'
          })
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .warpper{
    .header{
      border-bottom: 1px solid #ddd;
      h1{
        font-size: 2em;
        margin: 0;
        padding:0;
        text-align: center;
        line-height: 1.3;
        padding: 15px 10px;
      }
    }
    .main{
      box-sizing: border-box;
      min-width: 320px;
      max-width: 400px;
      margin:0 auto;
      padding: 10px;
      padding-top: 30px;
    }
  }

</style>
