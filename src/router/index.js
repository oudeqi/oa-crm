import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/components/Index'
import MyCustomer from '@/components/MyCustomer'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'index',
      redirect: '/customer/my',
      component: Index,
      children: [
        {
          path: '/customer',
          redirect: '/customer/my'
        },
        {
          path: '/customer/my',
          name: 'myCustomer',
          component: MyCustomer
        }
      ]
    }
  ]
})
