import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './plugins/echarts.js'
import './styles/element-variables.scss'
// import Element from 'element-ui'
// import charts from 'echarts'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import moment from 'moment'
import { getToken } from './utils/user'

import post, { get, requestBase } from './utils/fetch'

import * as utils from './utils/utils' // 工具类的方法

import VDialog from './components/VDialog'
import AreaSearch from './components/AreaSearch2'
import AreaForm from './components/AreaForm'
import PageInfo from './components/PageInfo'
// 全局注册组件
Vue.component('VDialog', VDialog)
Vue.component('AreaSearch', AreaSearch)
Vue.component('AreaForm', AreaForm)
Vue.component('PageInfo', PageInfo)

// 注册全局异步请求方法
Vue.prototype.$post = post
Vue.prototype.$get = get
Vue.prototype.$moment = moment
Vue.prototype.$utils = utils
Vue.prototype.$requestBase = requestBase
// Vue.prototype.$charts = charts
Vue.config.productionTip = false

// const whiteList = ['/login']
//
// router.beforeEach(async (to, from, next) => {
//   if (to.name === '首页' || to.name === '首页2') {
//     store.dispatch('ChangeMenuStatus', false)
//   }
//   NProgress.start()
//   if (getToken()) {
//     if (to.path === '/login') {
//       next({ path: '/' })
//     } else {
//       if (!store.getters.userInfo.id || store.getters.userInfo.id.length === 0) { // 判断当前用户是否已拉取完user_info信息
//         let res = await store.dispatch('GetInfo')
//         if (res.code === 0) {
//           // store.dispatch('GenerateRoutes', res.data)
//           store.dispatch('GetBtnIsShow', to.path)
//           router.addRoutes(store.getters.addRouters)
//           next({ ...to, replace: true })
//         } else {
//           // next('/login')
//           NProgress.done()
//         }
//       } else {
//         store.dispatch('GetBtnIsShow', to.path)
//         next()
//       }
//     }
//   } else {
//     if (whiteList.indexOf(to.path) !== -1) {
//       next()
//     } else {
//       next('/login')
//       NProgress.done()
//     }
//   }
// })
// router.afterEach(() => {
//   NProgress.done()
// })

const whiteList = ['/login']
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // 清除上一个页面的请求
  let cancelList = store.state.mainStore.fetchCancelList
  cancelList.map(item => {
    item.cancel('中断请求')
    store.dispatch('deleteFetchCancel', item)
  })
  if (!getToken()) {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next('/login')
      NProgress.done()
    }
    return
  }
  if (to.path === '/equipmentModule/equipment/mapModel') {
    store.dispatch('ChangeMenuStatus', false)
  }
  if (to.path === '/login') {
    next({ path: '/' })
    return
  }
  if (store.getters.userInfo && store.getters.userInfo.id) { // 判断当前用户是否已拉取完user_info信息
    store.dispatch('GetBtnIsShow', to.path)
    next()
    return
  }
  // 拉取菜单 userInfo 数据
  let res = await store.dispatch('GetInfo')
  if (res.code === 0) {
    store.dispatch('GetBtnIsShow', to.path)
    router.addRoutes(store.getters.addRouters)
    next({ ...to, replace: true })
  } else {
    // next('/login')
    // store.dispatch('GetBtnIsShow', to.path)
    NProgress.done()
  }
})
router.afterEach(() => {
  NProgress.done()
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
