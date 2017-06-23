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
import MyCustomerSigned from '@/components/MyCustomerSigned'
import MyCustomerSignedFor from '@/components/MyCustomerSignedFor'
import MyCustomerSignedAdd from '@/components/MyCustomerSignedAdd'
import MyCustomerSignedUpdate from '@/components/MyCustomerSignedUpdate'
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
import AppointmentPlatformAdd from '@/components/AppointmentPlatformAdd'

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
          path: '/customer/signed',
          name: 'myCustomerSigned',
          component: MyCustomerSigned
        },
        {
          path: '/customer/signed-for',
          name: 'myCustomerSignedFor',
          component: MyCustomerSignedFor
        },
        {
        	path: '/customer/signed-update/:id',
        	name: 'myCustomerSignedUpdate',
        	component:MyCustomerSignedUpdate
        },
        {
          path: '/customer/signed-add',
          name: 'myCustomerSignedAdd',
          component: MyCustomerSignedAdd
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
          path: '/appointment/platform',
          name: 'platformAppointment',
          component: PlatformAppointment
        },
        {
          path: '/application/platform/add',
          name: 'appointmentPlatformAdd',
          component: AppointmentPlatformAdd
        },
        {
          path: '/appointment/visit',
          name: 'visitAppointment',
          component: VisitAppointment
        }

      ]
    },
    { path: '*', redirect: '/' }
  ]
})

// const expect = [
//   {
//     task: '新增、修改员工资料',
//     time: '4',
//     subTask: [
//       {
//         task: '员工列表',
//         time: '1'
//       },
//       {
//         task: '员工详情',
//         time: '1'
//       },
//       {
//         task: '新增员工',
//         time: '1'
//       },
//       {
//         task: '修改员工资料',
//         time: '1'
//       }
//     ]
//   },
//   {
//     task: '修改站长资料',
//     time: '3',
//     subTask: [
//       {
//         task: '站长列表',
//         time: '1'
//       },
//       {
//         task: '站长详情',
//         time: '1'
//       },
//       {
//         task: '修改站长',
//         time: '1'
//       }
//     ]
//   },
//   {
//     task: '签约',
//     time: '6',
//     subTask: [
//       {
//         task: '签约列表',
//         time: '1'
//       },
//       {
//         task: '签约详情',
//         time: '1'
//       },
//       {
//         task: '新增签约',
//         time: '2',
//         desc: '旅游、2台、小说、签约内容不一样'
//       },
//       {
//         task: '签约修改',
//         time: '2',
//         desc: '旅游、2台、小说、签约修改内容不一样'
//       }
//     ]
//   },
//   {
//     task: '预约',
//     time: '6',
//     subTask: [
//       {
//         task: '预约列表',
//         time: '1'
//       }, {
//         task: '预约详情',
//         time: '1'
//       },
//       {
//         task: '新增预约',
//         time: '2',
//         desc: '电话预约、平台预约、回访记录内容不一样'
//       },
//       {
//         task: '预约修改',
//         time: '2',
//         desc: '电话预约、平台预约、回访记录修改内容不一样'
//       }
//     ]
//   },
//   {
//     task: '考勤',
//     time: '4',
//     subTask: [
//       {
//         task: '考勤列表',
//         time: '1'
//       }, {
//         task: '个人考勤详情',
//         time: '1'
//       },
//       {
//         task: '新增考勤',
//         time: '1'
//       },
//       {
//         task: '个人考勤修改',
//         time: '1'
//       }
//     ]
//   },
//   {
//     task: '工资',
//     time: '4',
//     subTask: [
//       {
//         task: '工资列表',
//         time: '1'
//       }, {
//         task: '工资详情',
//         time: '1'
//       },
//       {
//         task: '新增工资',
//         time: '1'
//       },
//       {
//         task: '工资修改',
//         time: '1'
//       }
//     ]
//   },
//   {
//     task: '资金流水',
//     time: '4',
//     subTask: [
//       {
//         task: '资金流水列表',
//         time: '1'
//       }, {
//         task: '资金流水详情',
//         time: '1'
//       },
//       {
//         task: '新增资金流水',
//         time: '1'
//       },
//       {
//         task: '工资资金流水',
//         time: '1'
//       }
//     ]
//   }
// ]

