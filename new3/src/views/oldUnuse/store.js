
const systemStore = {
  state: {
    allMenuList: [] // 全部的菜单
  },
  mutations: {
    SET_AllMENULIST: (state, data) => {
      state.allMenuList = data
    }
  },
  actions: {
    // 获得全部菜单的数据
    SetMenuList ({ commit }, data) {
      commit('SET_AllMENULIST', data)
    }
  },
  getters: {
    allMenuList: state => state.allMenuList
  }
}

export default systemStore
