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
import MyCustomerAdd from '@/components/MyCustomerAdd'
import MyCustomerDetail from '@/components/MyCustomerDetail'
import MyCustomerDetailEdit from '@/components/MyCustomerDetailEdit'
import TeamCustomerDetail from '@/components/TeamCustomerDetail'
import StaffList from '@/components/StaffList'
import StationList from '@/components/StationList'
import PhoneAppointment from '@/components/PhoneAppointment'
import PlatformAppointment from '@/components/PlatformAppointment'
import VisitAppointment from '@/components/VisitAppointment'
import StaffDetail from '@/components/StaffDetail'
import StaffEdit from '@/components/StaffEdit'
import StaffAdd from '@/components/StaffAdd'
import StationDetail from '@/components/StationDetail'
import StationEdit from '@/components/StationEdit'
import PlatformAppointmentAdd from '@/components/PlatformAppointmentAdd'
import PlatformAppointmentDetail from '@/components/PlatformAppointmentDetail'
import PlatformAppointmentEdit from '@/components/PlatformAppointmentEdit'
import PhoneAppointmentAdd from '@/components/PhoneAppointmentAdd'
import PhoneAppointmentDetail from '@/components/PhoneAppointmentDetail'
import PhoneAppointmentEdit from '@/components/PhoneAppointmentEdit'
import PlatformAppointmentRecord from '@/components/PlatformAppointmentRecord'
import PhoneAppointmentRecord from '@/components/PhoneAppointmentRecord'
import CheckWorkAttendance from '@/components/CheckWorkAttendance'
import Salary from '@/components/Salary'
import CheckWorkAttendanceDetail from '@/components/CheckWorkAttendanceDetail'
import Leave from '@/components/Leave'
import CapitalFlow from '@/components/CapitalFlow'

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
          path: '/customer/my/detail/:id',
          name: 'myCustomerDetail',
          component: MyCustomerDetail
        },
        {
          path: '/customer/my/detail/:id/edit',
          name: 'myCustomerDetailEdit',
          component: MyCustomerDetailEdit
        },
        {
          path: '/customer/team/detail/:id',
          name: 'teamCustomerDetail',
          component: TeamCustomerDetail
        },
        {
          path: '/customer/my/add',
          name: 'myCustomerAdd',
          component: MyCustomerAdd
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
        },
        {
          path: '/setup/staff',
          name: 'staffList',
          component: StaffList
        },
        {
          path: '/setup/staff/add',
          name: 'staffAdd',
          component: StaffAdd
        },
        {
          path: '/setup/staff/detail/:id',
          name: 'staffDetail',
          component: StaffDetail
        },
        {
          path: '/setup/staff/detail/:id/edit',
          name: 'staffEdit',
          component: StaffEdit
        },
        {
          path: '/setup/station',
          name: 'stationList',
          component: StationList
        },
        {
          path: '/setup/station/detail/:id',
          name: 'stationDetail',
          component: StationDetail
        },
        {
          path: '/setup/station/detail/:id/edit',
          name: 'stationEdit',
          component: StationEdit
        },
        {
          path: '/appointment/phone',
          name: 'phoneAppointment',
          component: PhoneAppointment
        },
        {
          path: '/appointment/phone/add',
          name: 'phoneAppointmentAdd',
          component: PhoneAppointmentAdd
        },
        {
          path: '/appointment/phone/detail/:id',
          name: 'phoneAppointmentDetail',
          component: PhoneAppointmentDetail
        },
        {
          path: '/appointment/phone/detail/:id/edit',
          name: 'PhoneAppointmentEdit',
          component: PhoneAppointmentEdit
        },
        {
          path: '/application/phone/record/:id',
          name: 'phoneAppointmentRecord',
          component: PhoneAppointmentRecord
        },
        {
          path: '/appointment/platform',
          name: 'platformAppointment',
          component: PlatformAppointment
        },
        {
          path: '/application/platform/add',
          name: 'platformAppointmentAdd',
          component: PlatformAppointmentAdd
        },
        {
          path: '/application/platform/detail/:id',
          name: 'platformAppointmentDetail',
          component: PlatformAppointmentDetail
        },
        {
          path: '/application/platform/detail/:id/edit',
          name: 'platformAppointmentEdit',
          component: PlatformAppointmentEdit
        },
        {
          path: '/application/platform/record/:id',
          name: 'platformAppointmentRecord',
          component: PlatformAppointmentRecord
        },
        {
          path: '/appointment/visit',
          name: 'visitAppointment',
          component: VisitAppointment
        },
        {
          path: '/work-attendance/list',
          name: 'checkWorkAttendance',
          component: CheckWorkAttendance
        },
        {
          path: '/work-attendance/detail/:id',
          name: 'checkWorkAttendanceDetail',
          component: CheckWorkAttendanceDetail
        },
        {
          path: '/work-attendance/leave',
          name: 'leave',
          component: Leave
        },
        {
          path: '/salary',
          name: 'salary',
          component: Salary
        },
        {
          path: '/capital-flow',
          name: 'capitalFlow',
          component: CapitalFlow
        }
      ]
    },
    { path: '*', redirect: '/' }
  ]
})
