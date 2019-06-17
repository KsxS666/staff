import { getToken, setToken, removeToken } from '@/utils/user'
import fetch from '@/utils/fetch'
// import $router from '@/router/index'
import { Message } from 'element-ui'

const loginStore = {
  state: {
    userInfo: getToken() ? JSON.parse(getToken()) : {}
    // showMenuList: [] // 要显示的菜单
  },
  mutations: {
    SET_USERINFO: (state, data) => {
      state.userInfo = Object.assign({}, state.userInfo, data)
    }
    // SET_MENULIST: (state, data) => {
    //   state.showMenuList = data
    // }
  },
  actions: {
    // 保存登录信息
    SetTokenInfo ({ commit }, data) {
      let userTokenInfo = {
        // userId: data.userId,
        xToken: data
      }
      setToken(JSON.stringify(userTokenInfo))
      commit('SET_USERINFO', userTokenInfo)
    },
    // 获取用户信息
    async GetInfo ({ commit, state, dispatch }) {
      let res = await fetch('system/admin/tokenLogin', { token: state.userInfo.xToken })
      if (res.code !== 0) {
        Message.error(res.msg)
        return res
      }
      commit('SET_USERINFO', res.data)
      // dispatch('GetShowMenu')
      dispatch('GetShowMenu', res.data)
      return res
    },
    // 获得权限对应的菜单
    // async GetShowMenu ({ commit, state, dispatch }) {
    //   let accessedRouters = await dispatch('GenerateRoutes', state.userInfo)
    //   accessedRouters = JSON.parse(JSON.stringify(accessedRouters))
    //   accessedRouters.map(firstItem => {
    //     firstItem.children = firstItem.children.filter(secondItem => {
    //       return !secondItem.hidden
    //     })
    //   })
    //   commit('SET_MENULIST', accessedRouters)
    // },
    // 修改用户信息
    ChangeInfo ({ commit }, data) {
      commit('SET_USERINFO', data)
    },
    // 清除数据的登录
    ClearLogout ({ commit }) {
      commit('SET_USERINFO', {})
      removeToken()
    }
  },
  getters: {
    userInfo: state => state.userInfo
    // showMenuList: state => state.showMenuList
  }
}

export default loginStore
