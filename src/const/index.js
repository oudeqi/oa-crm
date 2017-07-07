/**
 * Created by oudeqi on 2017/6/17.
 */

const appHost = function () {
  // return 'http://192.168.10.36:8080'
  return 'http://crm.difanglian.com'
}

const getToken = function () {
  return localStorage.getItem('token')
}
const setToken = function (tk) {
  if (tk) {
    localStorage.setItem('token', tk)
  } else {
    localStorage.removeItem('token')
  }
}

const getUser = function () {
  return window.JSON.parse(localStorage.getItem('user'))
}
const setUser = function (obj) {
  if (obj) {
    localStorage.setItem('user', window.JSON.stringify(obj))
  } else {
    localStorage.removeItem('user')
  }
}

const getPageIndex = function (name) {
  if (name) {
    return window.JSON.parse(localStorage.getItem(name))
  } else {
    console.error('getPageIndex fn must provide arg:name typeof string')
  }
}
const setPageIndex = function (obj) {
  if (obj && obj.name && obj.value && !isNaN(obj.value)) {
    localStorage.setItem(obj.name, obj.value)
    return obj
  } else {
    console.error('pageIndex must be an obj and pageIndex.value must be a number')
  }
}
const removePageIndex = function (name) {
  if (name) {
    localStorage.removeItem(name)
  } else {
    console.error('removePageIndex fn must provide arg:name typeof string')
  }
}

export {appHost, getToken, setToken, getUser, setUser, getPageIndex, setPageIndex, removePageIndex}
