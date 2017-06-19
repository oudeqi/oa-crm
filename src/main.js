// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import VueRouter from 'vue-router'
import VueResource from 'vue-resource'
import 'element-ui/lib/theme-default/index.css'
import './filter'
import ElementUi from 'element-ui'
import {appHost, token} from './const'

Vue.use(VueRouter)
Vue.use(VueResource)
Vue.use(ElementUi)

Vue.http.options.emulateHTTP = true
Vue.http.options.timeout = 3000
Vue.http.interceptors.push(function (request, next) {
  request.headers.set('Authorization', token)
  request.url = appHost() + request.url
  next(function (response) {
    return response
  })
})

Vue.config.productionTip = false

/* eslint-disable no-new */

new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App }
})
