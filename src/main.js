// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import 'element-ui/lib/theme-default/index.css'
import ElementUi from 'element-ui'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(ElementUi)

Vue.http.options.emulateHTTP = true
Vue.http.interceptors.push(function (request, next) {
  let token = localStorage.getItem('token')
  request.headers.set('Authorization', token)
  let host = 'http://192.168.10.32:8080'
  request.url = host + request.url
  next(function (response) {
    return response
  })
})

// localStorage.removeItem('token')

Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})

