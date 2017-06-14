import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/components/Index'
import MyCustomer from '@/components/MyCustomer'
import TeamCustomer from '@/components/TeamCustomer'
import SeaCustomer from '@/components/SeaCustomer'
import MySea from '@/components/MySea'
import Application from '@/components/Application'
import NoResource from '@/components/NoResource'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/no-resource',
      name: 'noResource',
      component: NoResource
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
        },
        {
          path: '/customer/team',
          name: 'teamCustomer',
          component: TeamCustomer
        },
        {
          path: '/customer/sea',
          name: 'seaCustomer',
          component: SeaCustomer
        },
        {
          path: '/customer/my-sea',
          name: 'mySea',
          component: MySea
        },
        {
          path: '/customer/application',
          name: 'application',
          component: Application
        }
      ]
    },
    { path: '*', redirect: '/' }
  ]
})
