/**
 * Created by oudeqi on 2017/6/16.
 */
import Vue from 'vue'
import moment from 'moment'

Vue.filter('date', function (value, format) {
  if (value) {
    return moment(value).format(format)
  } else {
    return '无'
  }
})

Vue.filter('currency', function (value) {
  return '￥' + (value).toFixed(2)
})
