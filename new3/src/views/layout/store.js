
import $router, { asyncRouterMap } from '@/router'

export default {
  state: {
    isShowMenu: true,
    showMenuList: [], // 当前要显示的菜单
    addRouters: asyncRouterMap, // 要有权限的路由
    currentSubMenu: null, // 当前的页面
    menuInfo: { // 菜单的所有信息
      currentFirstMenu: null // 当前选中的一级带单
    }
  },
  mutations: {
    SET_isShowMenu: (state, bool) => {
      state.isShowMenu = bool
    },
    // SET_subMenuList: (state, data) => {
    //   state.subMenuList = data
    // },
    SET_currentSubMenu: (state, data) => {
      state.currentSubMenu = data
    },
    Set_asyncRouter: (state, data) => {
      state.addRouters = data
    },
    Set_menuList: (state, data) => {
      state.showMenuList = data
    },
    Set_currentMenu (state, item) {
      state.menuInfo.currentFirstMenu = item
    }
  },
  actions: {
    // 设置有权限的路由和菜单
    GetShowMenu ({ commit }, data = {}) {
      getPath(asyncRouterMap)
      let dataObj = {
        isShowAll: data.username === 'admin',
        menuList: data.menuIds ? data.menuIds.split(',') : [],
        btnList: data.buttonIds ? data.buttonIds.split(',') : []
      }
      dataObj.btnObj = handBtnId(dataObj.isShowAll, dataObj.btnList)
      filterRouterBtn(asyncRouterMap, dataObj)
      let accessedRouters = filterAsyncRouter(asyncRouterMap, dataObj)
      getPathRedirect(accessedRouters)
      commit('Set_asyncRouter', accessedRouters)
      let menuList = filterMenu(accessedRouters)
      commit('Set_menuList', menuList)
    },
    SetFirstMenu ({ commit, state }, path) {
      // let obj = state.showMenuList.find(item => {
      let obj = state.addRouters.find(item => {
        return item.path === path
      })
      commit('Set_currentMenu', obj)
    },
    // 获得当前菜单页面， 并且设置是否有按钮权限 (如果是子页面的 url 传父页面的path)
    GetBtnIsShow ({ commit, state }, url) {
      url = url || $router.currentRoute.path
      let currentObj = state.currentSubMenu
      if (!currentObj || currentObj.href !== url) {
        currentObj = getCurrentPage(state.addRouters, url)
        commit('SET_currentSubMenu', currentObj)
      }
    },
    ChangeMenuStatus ({ commit }, bool) {
      commit('SET_isShowMenu', bool)
    }
  },
  getters: {
    isShowMenu: state => state.isShowMenu,
    addRouters: state => state.addRouters,
    // menuList: state => state.menuList,
    showMenuList: state => state.showMenuList,
    currentSubMenu: state => state.currentSubMenu,
    menuInfo: state => state.menuInfo
  }
}
/* 获得路由对应的页面 */
function getCurrentPage (list, path) {
  let pathObj = null
  list.map(item => {
    if (item.href === path) {
      pathObj = item
      return
    }
    if (!item.children || !item.children.length) return
    let childObj = getCurrentPage(item.children, path)
    if (childObj) {
      pathObj = childObj
    }
  })
  return pathObj
}

/* 组合每一个的路由全称 */
function getPath (menuList, parentPath = []) {
  menuList.map(item => {
    let list = []
    list.push(item.path)
    list = parentPath.concat(list)
    item.href = list.join('/')
    if (item.children && item.children.length) {
      getPath(item.children, list)
      // item.redirect = redirectPath(item)
    }
  })
}
/* 给路由添加 redirect */
function getPathRedirect (menuList) {
  menuList.map(item => {
    if (item.children && item.children.length) {
      item.redirect = redirectPath(item)
      getPathRedirect(item.children)
    }
  })
}
/* 获得 redirect 地址 */
function redirectPath (itemData) {
  let path = itemData.href
  if (itemData.children && itemData.children.length) {
    let chilePath = redirectPath(itemData.children[0])
    // path += '/' + chilePath
    path = chilePath
  }
  return path
}

/**
 * 处理菜单的权限
 * @param asyncRouterMap 全部的路由
 * @param menuList 有权限的菜单
 * @param isShowAll 是否显示全部的
 * @return Array
 */
function filterAsyncRouter (asyncRouterMap, { menuList, isShowAll }) {
  if (isShowAll) return asyncRouterMap
  let ShowAccessedRouters = []
  asyncRouterMap.map(item => {
    // 判断是否有权限的路由
    let find = menuList.findIndex(menuItem => {
      return menuItem === item.href
    })
    if (find !== -1) { // 有权限
      ShowAccessedRouters.push(item)
      return
    }
    if (!item.children || !item.children.length) return
    let childrenList = filterAsyncRouter(item.children, { menuList })
    if (childrenList && childrenList.length) {
      let hiddenList = item.children.filter(child => {
        return child.hidden
      })
      // item.children = childrenList
      ShowAccessedRouters.push(Object.assign({}, item, { children: childrenList.concat(hiddenList) }))
    }
  })
  return ShowAccessedRouters
}
/* 过滤菜单，只有要显示的菜单项 */
function filterMenu (menuList) {
  let list = []
  menuList.map(item => {
    if (item.hidden) return
    if (item.noDropDown) {
      let obj = Object.assign({}, item)
      if (!obj.btnList) obj.btnList = []
      obj.children && obj.children.map(child => {
        if (child.btnList && child.btnList.length) {
          obj.btnList = obj.btnList.concat(child.btnList)
        }
      })
      delete obj.children
      list.push(obj)
      return
    }
    if (item.children && item.children.length) {
      let children = filterMenu(item.children)
      list.push(Object.assign({}, item, { children: children }))
      return
    }
    list.push(item)
  })
  return list
}

/**
 * 处理按钮的字段 -- 获得要显示的按钮
 * @param isShowAll Boolean  是否显示全部的
 * @param btnList ['/systemModule2/menuList-addMenu', '/systemModule2/menuList-deleteMenu']
 * @return Object {'/systemModule2/menuList': {'addMenu': true, 'deleteMenu': true}}
 */
function handBtnId (isShowAll, btnList) {
  let list = {}
  if (isShowAll) { // 全部的按钮是要显示的
    asyncBtnList.map(item => {
      let btn = {}
      item.btnList.map(btnItem => {
        btn[btnItem.code] = true
      })
      list[item.path] = btn
    })
    return list
  }
  // 有权限的过滤
  btnList.map(item => {
    let url = item.split('-')[0]
    let code = item.split('-')[1]
    if (!list[url]) {
      list[url] = []
    }
    list[url][code] = true
  })
  return list
}

/*  给每一个菜单路由添加对应的按钮权限  */
function filterRouterBtn (asyncRouterMap, { btnObj }) {
  // 处理一下按钮的数组
  asyncBtnList.map(item => {
    item.btnList.map(btnItem => {
      btnItem.id = `${item.path}-${btnItem.code}`
    })
  })
  asyncRouterMap.map(item => {
    let find = asyncBtnList.find(btnItem => {
      return btnItem.path === item.href
    })
    if (find) {
      item.btnList = find.btnList
      // 为每个菜单加上有权限的按钮
      item.hasBtn = btnObj[item.href] || null
    }
    if (!item.children || !item.children.length) return
    filterRouterBtn(item.children, { btnObj })
  })
}
/**
 * 每个页面对应要做权限的按钮的列表 按钮的code命名里面不能出现 "-"
 **/
const asyncBtnList = [
  // -------- 基础管理
  {
    path: '/baseData/communityModule/communityList',
    name: '小区列表',
    btnList: [
      { name: '添加小区', code: 'add' },
      { name: '编辑小区', code: 'edit' },
      { name: '删除小区', code: 'delete' },
      { name: '导出小区', code: 'download' },
      { name: '绑定管理员', code: 'bindAdmin' },
      { name: '查看住户', code: 'viewUser' },
      { name: '查看住户-添加住户', code: 'userAdd' },
      { name: '查看住户-编辑住户', code: 'userEdit' },
      { name: '查看住户-删除住户', code: 'userDelete' },
      { name: '查看住户-批量删除', code: 'userDeleteMulti' },
      { name: '查看住户-全部删除', code: 'userDeleteAll' },
      { name: '查看住户-下载导入模板', code: 'userFileDownload' },
      { name: '查看住户-批量导入文件', code: 'userImport' },
      { name: '查看住户-导出住户', code: 'userDownload' },
      { name: '查看住户-查看厨余记录', code: 'userWasteRecode' }
    ]
  },
  {
    path: '/baseData/communityModule/communityAdminList',
    name: '社区管理员列表',
    btnList: [
      { name: '添加管理员', code: 'add' },
      { name: '编辑管理员', code: 'edit' },
      { name: '删除管理员', code: 'delete' },
      { name: '重置密码', code: 'resetPassword' },
      { name: '绑定社区', code: 'bindCommunity' },
      { name: '配置预约时间', code: 'setAppointmentTime' }
    ]
  },
  {
    path: '/baseData/userModule/userList',
    name: '用户列表',
    btnList: [
      { name: '添加用户', code: 'add' },
      { name: '编辑用户', code: 'edit' },
      { name: '删除用户', code: 'delete' },
      { name: '下载导入模板', code: 'userFileDownload' },
      { name: '批量导入文件', code: 'userImport' },
      { name: '导出用户', code: 'userDownload' },
      { name: '积分修正', code: 'integralChange' },
      { name: '积分明细', code: 'integralDetail' },
      { name: '重置密码', code: 'resetPassword' },
      { name: '启用或禁用', code: 'stopOrOpen' }
    ]
  },
  // -------- 设备管理
  {
    path: '/equipmentModule/equipmentType/equipmentTypeList',
    name: '设备类型',
    btnList: [
      { name: '添加设备类型', code: 'add' },
      { name: '编辑设备类型', code: 'edit' },
      { name: '删除设备类型', code: 'delete' }
    ]
  },
  {
    path: '/equipmentModule/equipment/equipmentList',
    name: '设备列表',
    btnList: [
      { name: '添加设备', code: 'add' },
      { name: '编辑设备', code: 'edit' },
      { name: '删除设备', code: 'delete' },
      { name: '查看桶数', code: 'viewBare' },
      { name: '批量设置有效范围', code: 'setRangeAll' }
    ]
  },
  {
    path: '/equipmentModule/integralEquipment/integraleqList',
    name: '兑换机列表',
    btnList: [
      { name: '添加积分兑换机', code: 'add' },
      { name: '编辑积分兑换机', code: 'edit' },
      { name: '删除积分兑换机', code: 'delete' },
      { name: '查看货道信息', code: 'viewCargoWay' }
    ]
  },
  {
    path: '/equipmentModule/equipmentCheckList/equipmentCheckList',
    name: '检测列表',
    btnList: [
      { name: '查看检测结果', code: 'checkResult' }
    ]
  },
  {
    path: '/equipmentModule/flowWarn/flowWarnTab',
    name: '流量预警',
    btnList: [
      { name: '删除', code: 'delete' }
    ]
  },
  // -------- 报表统计
  {
    path: '/reportModule/recycleReport/recycleReportList',
    name: '回收报表',
    btnList: [
      { name: '导出报表', code: 'download' }
    ]
  },
  {
    path: '/reportModule/inspection/inspectionList',
    name: '巡检记录',
    btnList: [
      { name: '查看原因', code: 'resonCheck' },
      { name: '查看投放记录', code: 'castCheck' }
    ]
  },
  {
    path: '/reportModule/integralRecord/integralList',
    name: '积分记录',
    btnList: [
      { name: '导出列表', code: 'download' },
      { name: '删除', code: 'delete' }
    ]
  },
  {
    path: '/reportModule/exchangeRecord/exchangeList',
    name: '兑换记录',
    btnList: [
      { name: '导出列表', code: 'download' }
    ]
  },
  {
    path: '/reportModule/recycleRecord/recycleList',
    name: '回收列表',
    btnList: [
      { name: '导出列表', code: 'download' }
    ]
  },
  {
    path: '/reportModule/castRecord/castList',
    name: '投放列表',
    btnList: [
      { name: '导出投放列表', code: 'download' },
      { name: '巡检', code: 'inspect' },
      { name: '查看原因', code: 'resonCheck' }
    ]
  },
  {
    path: '/reportModule/appointment/appointmentList',
    name: '预约列表',
    btnList: [
      { name: '导出列表', code: 'download' },
      { name: '已完成', code: 'hasFinish' },
      { name: '已取消', code: 'hasCancel' },
      { name: '查看原因', code: 'viewDetail' }
    ]
  },
  {
    path: '/reportModule/attenceReport/attenceList',
    name: '考勤报表',
    btnList: [
      { name: '导出报表', code: 'download' }
    ]
  },
  // -------- 运营管理
  {
    path: '/operation/typeRuleModule/integralRule',
    name: '积分规则',
    btnList: [
      { name: '添加规则', code: 'add' },
      { name: '查看规则', code: 'edit' },
      { name: '删除规则', code: 'delete' },
      { name: '设置默认值', code: 'setDefault' },
      { name: '设置厨余积分', code: 'setWaste' },
      { name: '导出列表', code: 'download' }
    ]
  },
  {
    path: '/operation/typeRuleModule/recycleSort',
    name: '回收参考分类',
    btnList: [
      { name: '添加类型', code: 'add' },
      { name: '添加下级类型', code: 'addSub' },
      { name: '编辑类型', code: 'edit' },
      { name: '删除类型', code: 'delete' }
    ]
  },
  {
    path: '/operation/typeRuleModule/recycleType',
    name: '上门回收类型',
    btnList: [
      { name: '添加类型', code: 'add' },
      { name: '添加下级类型', code: 'addSub' },
      { name: '编辑类型', code: 'edit' },
      { name: '删除类型', code: 'delete' }
    ]
  },
  {
    path: '/operation/typeRuleModule/footWasteByHuzhou',
    name: '湖州厨余管理',
    btnList: [
      { name: '导入', code: 'import' },
      { name: '下载导入模板', code: 'fileDownload' }
    ]
  },
  {
    path: '/operation/cardModule/icardList',
    name: 'IC卡',
    btnList: [
      { name: '解绑', code: 'cancelBind' },
      { name: '删除', code: 'delete' }
    ]
  },
  {
    path: '/operation/cardModule/cardTaskList',
    name: '卡片生成任务管理',
    btnList: [
      { name: '添加任务', code: 'add' },
      { name: '删除任务', code: 'delete' },
      { name: '导出', code: 'download' }
    ]
  },
  {
    path: '/operation/cardModule/bagList',
    name: '垃圾袋管理',
    btnList: [
      { name: '导入文件', code: 'bagImport' }
    ]
  },
  {
    path: '/operation/newsModule/newsList',
    name: '新闻列表',
    btnList: [
      { name: '添加新闻', code: 'add' },
      { name: '编辑新闻', code: 'edit' },
      { name: '删除新闻', code: 'delete' }
    ]
  },
  {
    path: '/operation/newsModule/newsTypeList',
    name: '新闻类型列表',
    btnList: [
      { name: '添加新闻类型', code: 'add' },
      { name: '编辑新闻类型', code: 'edit' },
      { name: '删除新闻类型', code: 'delete' }
    ]
  },
  {
    path: '/operation/productModule/productTypeList',
    name: '商品类型列表',
    btnList: [
      { name: '添加商品类型', code: 'add' },
      { name: '编辑商品类型', code: 'edit' },
      { name: '删除商品类型', code: 'delete' }
    ]
  },
  {
    path: '/operation/productModule/productAreaList',
    name: '商品区域列表',
    btnList: [
      { name: '添加商品区域', code: 'add' },
      { name: '编辑商品区域', code: 'edit' },
      { name: '删除商品类型', code: 'delete' },
      { name: '查看商品', code: 'viewProduct' },
      { name: '查看商品-添加商品', code: 'productAdd' },
      { name: '查看商品-编辑商品', code: 'productEdit' },
      { name: '查看商品-删除商品', code: 'productDelete' }
    ]
  },
  {
    path: '/operation/feedBack/feedBackList',
    name: '意见反馈列表',
    btnList: [
      { name: '删除意见反馈', code: 'delete' }
    ]
  },
  {
    path: '/operation/attenceReport/attenceSet',
    name: '考勤设置',
    btnList: [
      { name: '新增考勤', code: 'add' },
      { name: '设置有效范围', code: 'rangeSet' },
      { name: '设置考勤时间', code: 'timeSet' },
      { name: '查看设备', code: 'viewEquipment' },
      { name: '解除绑定关系', code: 'removeRel' },
      { name: '设置考勤时间-新增', code: 'setTimeAdd' },
      { name: '设置考勤时间-删除', code: 'setTimeDelete' },
      { name: '设置考勤时间-查看', code: 'setTimeView' },
      { name: '设置考勤时间-批量设置考勤时间', code: 'setTimeSetAll' }
    ]
  },
  {
    path: '/operation/banner/bannerList',
    name: 'banner列表',
    btnList: [
      { name: '添加banner', code: 'add' },
      { name: '编辑banner', code: 'edit' },
      { name: '删除banner', code: 'delete' }
    ]
  },
  {
    path: '/operation/answerModule/answerAreaList',
    // path: '/operation/answerModule/answerList',
    name: '答题区域列表',
    btnList: [
      { name: '添加答题区域', code: 'add' },
      { name: '编辑答题区域', code: 'edit' },
      { name: '删除答题类型', code: 'delete' },
      { name: '查看题目', code: 'viewAnswer' },
      { name: '查看题目-添加题目', code: 'answerAdd' },
      { name: '查看题目-题目设定', code: 'answerSet' },
      { name: '查看题目-编辑题目', code: 'answerEdit' },
      { name: '查看题目-删除题目', code: 'answerDelete' }
      // { name: '添加题目', code: 'answerAdd' },
      // { name: '题目设定', code: 'answerSet' },
      // { name: '编辑题目', code: 'answerEdit' },
      // { name: '删除题目', code: 'answerDelete' }
    ]
  },
  // -------- 系统管理
  {
    path: '/systemModule/accountModule/adminAccountList',
    name: '账号列表',
    btnList: [
      { name: '添加管理员', code: 'add' },
      { name: '编辑管理员', code: 'edit' },
      { name: '删除管理员', code: 'delete' }
    ]
  },
  {
    path: '/systemModule/accountModule/orgList',
    name: '机构管理',
    btnList: [
      { name: '添加机构', code: 'add' },
      { name: '添加下级机构', code: 'addSub' },
      { name: '编辑机构', code: 'edit' },
      { name: '删除机构', code: 'delete' },
      { name: '权限管理', code: 'permission' }
    ]
  },
  {
    path: '/systemModule/area/areaList',
    name: '地区列表',
    btnList: [
      { name: '添加地区', code: 'add' },
      { name: '添加下级地区', code: 'addSub' },
      { name: '编辑地区', code: 'edit' },
      { name: '删除地区', code: 'delete' }
    ]
  },
  // 下面是目前没有用到的
  // -------- 社区管理
  {
    path: '/communityModule/specialAdminList',
    name: '专管员管理',
    btnList: [
      { name: '添加专管员', code: 'add' },
      { name: '编辑专管员', code: 'edit' },
      { name: '删除专管员', code: 'delete' },
      { name: '启用或禁用', code: 'stopOrOpen' }
    ]
  },
  // -------- 积分管理
  // -------- 厨余管理
  {
    path: '/foodWasteModule/communityViewList',
    name: '社区总览表',
    btnList: [
      { name: '导出列表', code: 'download' },
      { name: '修改实际户数', code: 'changeNum' }
    ]
  },
  {
    path: '/foodWasteModule/communityLaunchList',
    name: '社区投放列表',
    btnList: [
      { name: '按日期导出', code: 'download' },
      { name: '录入桶数', code: 'changeNum' },
      { name: '查看详情', code: 'viewDetail' },
      { name: '社区投放日详情-导出', code: 'detailDownload' }
    ]
  },
  {
    path: '/foodWasteModule/foodWasteInfoList',
    name: '厨余垃圾列表',
    btnList: [
      { name: '导出', code: 'download' },
      { name: '查看详情', code: 'viewDetail' },
      { name: '厨余垃圾详情-导出', code: 'detailDownload' },
      { name: '厨余垃圾详情-查看明细', code: 'detailViewDetail' }
    ]
  }
]
