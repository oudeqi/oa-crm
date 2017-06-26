/**
 * Created by oudeqi on 2017/6/17.
 */

const env = 'dev'
const appHost = function () {
  if (env === 'dev') {
    return 'http://192.168.10.43:8080'
  } else {
    return 'http://crm.2tai.net'
//	return 'http://192.168.10.43:8080'
  }
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

export {appHost, getToken, setToken, getUser, setUser}
