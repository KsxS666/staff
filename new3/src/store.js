import Vue from 'vue'
import Vuex from 'vuex'

/**
 * 模块store引入
 */
import layoutStore from '@/views/layout/store'
import loginStore from '@/views/loginModule/store'
// import systemStore from '@/views/systemModule2/store'

const mainStore = {
  state: {
    fetchCancelList: [] // 请求的cancel
  },
  mutations: {
    Set_fetchCancel (state, data) {
      state.fetchCancelList = data
    }
  },
  actions: {
    // 保存每个请求的 cancel
    setFetchCancel ({ commit, state }, data) {
      let list = state.fetchCancelList || []
      list.push(data)
      commit('Set_fetchCancel', list)
    },
    // 删除已取消请求的cancel
    deleteFetchCancel ({ commit, state }, data) {
      let list = state.fetchCancelList || []
      let findIndex = list.findIndex(item => {
        return item.time === data.time
      })
      if (findIndex !== -1) {
        list.splice(findIndex, 1)
        commit('Set_fetchCancel', list)
      }
    }
  },
  getters: {}
}

Vue.use(Vuex)
const store = new Vuex.Store({
  modules: {
    mainStore,
    layoutStore,
    loginStore
    // systemStore
    // permissionStore
  }
})

export default store
