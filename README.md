# ertai-oa-crm

> A Vue.js project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

/*
  * http://crm.2tai.net/#/
  * 15828459830 18989193368
  * 98308182 88664422
  * */

/*

// TODO /v2/aut/crm/user/add post 新增用户
{
  "phoneNumber": "15828459830",*
  "password": "",*
  "nickName": "尚丹丹",*
  "headIconUrl": "http://cdn.2tai.net/app/crm_head_defuat.png",*
  "groupId": 1,
  "deptId": 0,
  "level": 0,
  "superiorId": 0,
  "createDate": null,
  "joinDate": null,*
  "leaveDate": null,
  "roleId": 0,
  "baseSalary" : int *
}

// TODO /v2/aut/crm/user/update post 更新用户
{
  "uid": 1,
  "phoneNumber": "15828459830",
  "password": "",
  "nickName": "尚丹丹",
  "headIconUrl": "http://cdn.2tai.net/app/crm_head_defuat.png",
  "groupId": 1,
  "deptId": 0,
  "level": 0,
  "superiorId": 0,
  "createDate": null,
  "joinDate": null,
  "leaveDate": null,
  "roleId": 0
}

// TODO /v2/aut/crm/user/list get 获取用户列表

// TODO /v2/aut/crm/user/details?id=1 get 获取用户详情







// TODO /v2/aut/crm/customer/list/master get 获取站长列表

// TODO /v1/aut/crm/customer/id 获取站长详情

// TODO /v2/aut/crm/customer/update/master post 更新站长信息
{
  "id": 3,
  "customerName": "今日广东",
  "cityCode": "440101",
  "cityCodeName": null,
  "mainPerson": "黄文辉",
  "mainPhoneNumber": "15919222227",
  "mainWeChat": "dmdm4444",
  "subPerson": "",
  "subPhoneNumber": "",
  "subWeChat": "",
  "job": "",
  "status": 1,
  "signType": 0,
  "remarks": "",
  "createDate": 1490249495000,
  "lastOperTime": 1490249495000,
  "createUid": 2,
  "contactUid": 10001,
  "contactName": null,
  "deptName": null,
  "logs": null,
  "beforeContactUser": "小明",
  "applyStatus": 0,
  "publicTime": 1499337368000,
  "remind": 1,
  "tripType": 2,
  "ertaiType": 0,
  "bookType": 0,
  "stock": 0,
  "recommendId": 0
}





/v2/aut/crm/sign/add post 新增签约
{
  "uid": 1,
  "nickName": "尚丹丹",
  "customerId": 8,
  "customerName": "昆山招聘",
  "financeUid": 0,
  "financeName": null,
  "presidentUid": 0,
  "presidentName": null,
  "financeConfirmDate": null,
  "presidentConfirmDate": null,
  "remarks": null,
  "stock": 1000,
  "money": 4800000,
  "realMoney": 4800000,
  "productId": 1,
  "cityCode": null,
  "bookAccount": null, 小说账户
  "ticketBegin": "",
  "ticketEnd": "",
  "status": 0, 是否拿票0 拿， 1不拿
  "tripType": 0,
  "ertaiType": 0,
  "bookType": 0
}

/v2/aut/crm/sign/update post 更新签约
{
  "id": 1,
  "uid": 1,
  "nickName": "尚丹丹",
  "customerId": 8,
  "customerName": "昆山招聘",
  "financeUid": 0,
  "financeName": null,
  "presidentUid": 0,
  "presidentName": null,
  "financeConfirmDate": null,
  "presidentConfirmDate": null,
  "remarks": null,
  "stock": 1000,
  "money": 4800000,
  "realMoney": 4800000,
  "productId": 1,
  "cityCode": null,
  "bookAccount": null,
  "tripType": 2,
  "ticketBegin": "",
  "ticketEnd": "",
  "status": 0
}

/v2/aut/crm/sign/list get 获取签约列表

/v2/aut/crm/sign/details?id=1 get 获取签约详情






// TODO /v2/aut/crm/reservation/add post 新增预约
{
  "customerId": 8,
  "customerName": "昆山招聘",

  "serviceUid": 1,
  "serviceName": "尚丹丹",

  "touristId": 0,//联系人份证号码
  "touristName": null,//联系人名字
  "touristPhone": 0,//联系人电话号码
  "age": 0, //联系人年龄
  "number": 0, 预约人数
  "wechat": null, //联系微信号
  "ticketBegin": 0, //票号区间开始
  "ticketEnd": 0 //票号区间结束
  "lineId": 0,//线路id
  "tripDate": null, //旅行时间
  "remarks": null,
  "type": 0,// 电话预约 存在的类型
  "status": 0 //预约的状态
}

// TODO /v2/aut/crm/reservation/update id post 更新预约
{
  "id": 1,
  "customerId": 8,
  "customerName": "昆山招聘",
  "serviceUid": 1,
  "serviceName": "尚丹丹",
  "touristId": 0,
  "touristName": null,
  "touristPhone": 0,
  "age": 0,
  "number": 0,
  "wechat": null,
  "ticketNumber": 0,
  "lineId": 0,
  "tripDate": null,
  "remarks": null,
  "type": 0,
  "status": 0
}

// TODO /v2/aut/crm/reservation/list get 获取预约列表

// TODO /v2/aut/crm/reservation/details?id=1 get 获取预约详情







// TODO /v2/aut/crm/reservation/visit/add reservationId post 添加回访记录
{
  "info": 1,
  "reservationId": 1
}

// TODO /v2/aut/crm/reservation/visit/update id post 更新回访记录
{
  "id": 1,
  "info": 1,
  "reservationId": 1
}

// TODO /v2/aut/crm/reservation/visit/list?reservationId=1 get 获取回访列表
/v2/aut/crm/reservation/visit/details?id=1 get 获取回访详情




/v2/crm/product/list get 获取产品列表

// TODO /v2/crm/line/list get 获取线路列表

// TODO /v2/crm/role/list get 获取角色列表

// TODO /v2/crm/config/list/type 获取配置类型列表

// TODO /v2/aut/crm/customer/list/master/all?search="" 获取所有旅游站长列表






// TODO /v2/aut/crm/attendance/import MultipartFile file post 导入考勤

/v2/aut/crm/attendance/update post 更新考勤信息
{
  "id": 1,
  "uid": 1,
  "nickName": null,
  "goToWorkDate": null,
  "goOffWorkDate": null,
  "isForgotClock": 0,
  "date": null,
  "isLeave": 0,
  "leaveInfo": null,
  "remarks": null
}


// TODO /v2/aut/crm/attendance/list?date=2017-05-01 00:00:00&uid=2
// TODO 不传uid 请求date考勤预览列表 传uid 请求指定用户date的考勤列表

// TODO /v2/aut/crm/attendance/leave/list?date=2017-06 get 获取上个月所有员工的请假列表

// TODO 废弃 /v2/aut/crm/attendance/details?id=1 get 获取指定ID的考勤详细信息

/v2/aut/crm/salary/update post 更新工资信息
{
  "id": 1,
  "uid": 1,
  "nickName": "尚丹丹",
  "baseMoney": 5000,
  "saleMoney": 0,
  "serviceMoney": 0,
  "leaveDeductMoney": 0,
  "otherDeductMoney": 0,
  "otherIncomeMoney": 0,
  "paidMoney": 0,
  "date": 1498205491000,
  "remarks": null,
  "createDate": 1498201170000
}

// TODO /v2/aut/crm/salary/list?date=2017-06 get 获取工资列表信息

/v2/aut/crm/salary/details?id=1 get 获取指定ID的工资详情

/v2/aut/crm/capital/add post 添加资金流水信息
{
  "typeId": 0,
  "money": 0,
  "date": null,
  "uid": 0,
  "nickName": null,
  "customerId": 0,
  "customerName": null,
  "remarks": null,
  "typeName": null,
  "createDate": null
}

/v2/aut/crm/capital/update post 更新资金流水信息
{
  "id": 1,
  "typeId": 0,
  "money": 0,
  "date": null,
  "uid": 0,
  "nickName": null,
  "customerId": 0,
  "customerName": null,
  "remarks": null,
  "typeName": null,
  "createDate": null
}

// TODO /v2/aut/crm/capital/list get 获取资金流水列表

/v2/aut/crm/capital/details?id=1 get 获取指定ID的资金流水详情

*/
