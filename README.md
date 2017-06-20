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

/v2/aut/crm/customer/update/master post 更新站长信息
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
  "bookAccount": null,
  "ticketBegin": "",
  "ticketEnd": "",
  "status": 0,
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






/v2/aut/crm/reservation/add post 新增预约
{
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

/v2/aut/crm/reservation/update id post 更新预约
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

/v2/aut/crm/reservation/details?id=1 get 获取预约详情







/v2/aut/crm/reservation/visit/add reservationId post 添加回访记录
{
  "info": 1,
  "resrvationId": 1
}

/v2/aut/crm/reservation/visit/update id post 更新回访记录
{
  "id": 1,
  "info": 1,
  "resrvationId": 1
}

/v2/aut/crm/reservation/visit/list?reservationId=1 get 获取回访列表
/v2/aut/crm/reservation/visit/details?id=1 get 获取回访详情




/v2/crm/product/list get 获取产品列表

/v2/crm/line/list get 获取线路列表

// TODO /v2/crm/role/list get 获取角色列表

/v2/crm/config/list/type 获取配置类型列表

*/
