import axios from 'axios'
import Qs from 'qs'
import store from '../store'
import $router from '../router'
// import { Message } from 'element-ui'

export const requestBase = '/backend'
// 创建axios实例
const service = axios.create({
  baseURL: requestBase // api的base_url
  // timeout: 60000 // 请求超时时间
})
service.interceptors.request.use(config => {
  config.cancelToken = new axios.CancelToken(cancel => {
    store.dispatch('setFetchCancel', {
      time: `${new Date().getTime()} - ${Math.random(0, 1) * 10}`,
      cancel
    })
  })
  return config
}, error => {
  console.log(error)
  Promise.reject(error)
})

/**
 * 拦截response，处理全局异常
 */
service.interceptors.response.use(
  response => {
    const res = response.data
    let currentRouter = $router.currentRoute.path
    if (res.code || res.code === 0) {
      res.code = Number(res.code)
    }
    if (!res.msg) {
      res.msg = '请求返回出错'
    }
    if (currentRouter.indexOf('login') !== -1 || currentRouter.indexOf('forgetPwd') !== -1) { // 除了登录和忘记密码页面
      return res
    }
    // ////--- 下面是各种异常情况的处理
    // token错误
    if (res.code === 101) {
      logout()
      res.msg = '登录超时，请重新登录！'
    }
    return res
  },
  (error) => {
    console.log(error)
    if (error.message && error.message === '中断请求') {
      return { code: -2, msg: null }
    }
    if (error.response && error.response.status === 500) {
      return { code: -1, msg: '服务器忙，请稍后再试' }
    }
    if (!error.response && error.code === 'ECONNABORTED') {
      return { code: -1, msg: '请求超时，请重新再试' }
    }
    return { code: -1, msg: '网络异常' }
  }
)

// 登出的操作
function logout () {
  setTimeout(() => {
    store.dispatch('ClearLogout')
    location.reload()
  }, 1500)
}

/**
 * 请求接口封装
 *
 * @param url 请求地址
 * @param data 请求参数
 * @param isFormData 是否用 FormData 的格式请求， 默认是 否
 * @param timeout 请求超时时间，默认是 15秒
 *
 * @return Object 返回请求结果
 */
export default function post (url, data = {}, isFormData = false, timeout = 15) {
  if (store.getters.userInfo.xToken) {
    data = Object.assign({}, {
      adminId: store.getters.userInfo.id
    }, data)
  }
  let reqData = Qs.stringify(data)
  let contentType = 'application/x-www-form-urlencoded'
  if (isFormData) {
    let form = new FormData()
    for (let item in data) {
      form.append(item, data[item])
    }
    reqData = form
    contentType = 'multipart/form-data'
  }
  try {
    let config = {
      url: url,
      method: 'post',
      headers: { 'Content-Type': contentType },
      withCredentials: true,
      data: reqData,
      timeout: timeout * 1000
    }
    if (store.getters.userInfo.xToken) {
      config.headers['X-Token'] = store.getters.userInfo.xToken // 让每个请求携带自定义token
    }
    return service(config)
  } catch (e) {
    return { code: -1, msg: '网络异常' }
  }
}

/**
 * 请求接口封装 - get
 *
 * @param url 请求地址
 * @param params 请求参数
 * @param timeout 请求超时时间，默认是 15秒
 *
 * @return Object 返回请求结果
 */
export function get (url, params = {}, timeout = 15) {
  if (store.getters.userInfo.xToken) {
    params = Object.assign({}, {
      adminId: store.getters.userInfo.id
    }, params)
  }
  try {
    let config = {
      url: url,
      method: 'get',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      withCredentials: true,
      params: params,
      timeout: timeout * 1000
    }
    if (store.getters.userInfo.xToken) {
      config.headers['X-Token'] = store.getters.userInfo.xToken // 让每个请求携带自定义token
    }
    return service(config)
  } catch (e) {
    return { code: -1, msg: '网络异常' }
  }
}
