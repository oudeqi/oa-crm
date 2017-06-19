/**
 * Created by oudeqi on 2017/6/17.
 */

const env = 'dev'
let token = localStorage.getItem('token')

const setToken = function (tk) {
  localStorage.setItem('token', tk)
  token = tk
}

const removeToken = function () {
  localStorage.removeItem('token')
  token = null
}

const appHost = function () {
  if (env === 'dev') {
    return 'http://192.168.10.43:8080'
  } else {
    return 'http://crm.2tai.net'
  }
}

export {appHost, token, setToken, removeToken}
