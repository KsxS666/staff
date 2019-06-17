import Vue from 'vue'
import Router from 'vue-router'

import App from '@/App'

import layout from '@/views/layout/layout'

/* error page */
import err404 from '@/views/404'
import login from './views/loginModule/login'
import home from './views/homeModule/home'
// 大数据
import largeData from './views/largeDataModule/largeData2'
import largeData1 from './views/largeDataModule/largeData'
// 地图
import gmap from '@/views/largeDataModule/real/components/gmap/gmap'

// 基础管理
// import communityList from './views/baseModule/communityModule/communityInfo/communityList/communityList'
// import communityHouse from './views/baseModule/communityModule/communityInfo/communityHouse/communityHouse'
// import footWasteLaunch from './views/baseModule/communityModule/communityInfo/footWasteLaunch/footWasteLaunch'
// import communityAdminList from './views/baseModule/communityModule/communityAdmin/communityAdminList'
// import communityAdminLog from './views/baseModule/communityModule/communityAdminLog/communityAdminLog'
// import userList from './views/baseModule/userModule/userList'
const communityList = () => import(/* webpackChunkName: "baseModule" */ './views/baseModule/communityModule/communityInfo/communityList/communityList')
const communityHouse = () => import(/* webpackChunkName: "baseModule" */ './views/baseModule/communityModule/communityInfo/communityHouse/communityHouse')
const footWasteLaunch = () => import(/* webpackChunkName: "baseModule" */ './views/baseModule/communityModule/communityInfo/footWasteLaunch/footWasteLaunch')
const communityAdminList = () => import(/* webpackChunkName: "baseModule" */ './views/baseModule/communityModule/communityAdmin/communityAdminList')
const communityAdminLog = () => import(/* webpackChunkName: "baseModule" */ './views/baseModule/communityModule/communityAdminLog/communityAdminLog')
const userList = () => import(/* webpackChunkName: "baseModule" */ './views/baseModule/userModule/userList')

// 运营管理
// import integralRuleList from './views/operationModule/typeRuleModule/integralRule/integralRuleList'
// import recycleTypeList from './views/operationModule/typeRuleModule/recycleType/recycleTypeList'
// import recycleSortList from './views/operationModule/typeRuleModule/recycleSortList/recycleSortList'
const integralRuleList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/typeRuleModule/integralRule/integralRuleList')
const recycleTypeList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/typeRuleModule/recycleType/recycleTypeList')
const recycleSortList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/typeRuleModule/recycleSortList/recycleSortList')
const footWasteByHuzhou = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/typeRuleModule/footWasteByHuzhou/footWasteByHuzhou')
const integralDelList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/typeRuleModule/integralDel/integralDelList')

// import cardTaskList from './views/operationModule/cardModule/cardTask/cardTaskList'
// import icardList from './views/operationModule/cardModule/icard/icardList'
// import bagList from './views/operationModule/cardModule/bag/bagList'
const cardTaskList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/cardModule/cardTask/cardTaskList')
const icardList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/cardModule/icard/icardList')
const bagList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/cardModule/bag/bagList')

// import newsList from './views/operationModule/newsModule/newsListModule/newsList'
// import newsTypeList from './views/operationModule/newsModule/newsTypeListModule/newsTypeList'
// import productAreaList from './views/operationModule/productModule/productAreaModule/productAreaList'
// import productTypeList from './views/operationModule/productModule/productTypeModule/productTypeList'
// import productList from './views/operationModule/productModule/productListModule/productList'
const newsList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/newsModule/newsListModule/newsList')
const newsTypeList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/newsModule/newsTypeListModule/newsTypeList')
const productAreaList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/productModule/productAreaModule/productAreaList')
const productTypeList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/productModule/productTypeModule/productTypeList')
const productList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/productModule/productListModule/productList')

// import feedBackList from './views/operationModule/feedBackModule/feedBack/feedBackList'
// import communityAdminExamine from './views/operationModule/feedBackModule/communityAdminExamine/communityAdminExamine'
const feedBackList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/feedBackModule/feedBack/feedBackList')
const communityAdminExamine = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/feedBackModule/communityAdminExamine/communityAdminExamine')

// import bannerList from './views/operationModule/bannerModule/bannerList'
// import answerAreaList from './views/operationModule/answerModule/answerAreaModule/answerAreaList'
// import answerList from './views/operationModule/answerModule/answerListModule/answerList'
const bannerList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/bannerModule/bannerList')
const answerAreaList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/answerModule/answerAreaModule/answerAreaList')
const answerList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/answerModule/answerListModule/answerList')

const attenceSet = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/attenceModule/attenceSetModule/attenceSetting/attenceSet')
const attenceTimeSet = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/attenceModule/attenceSetModule/attenceTimeSetModule/attenceTimeSet')
const carbon = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/carbonModule/carbon')
const partnerList = () => import(/* webpackChunkName: "operationModule" */ './views/operationModule/partnerModule/partnerList')

// 系统管理
const orgList = () => import(/* webpackChunkName: "systemModule" */ './views/systemModule/orgModule/orgList')
const adminList = () => import(/* webpackChunkName: "systemModule" */ './views/systemModule/adminAccount/adminList')
const adminLogList = () => import(/* webpackChunkName: "systemModule" */ './views/systemModule/adminLog/adminLogList')
const areaList = () => import(/* webpackChunkName: "systemModule" */ './views/systemModule/area/areaList')

// 设备管理
// import equipmentNonIntelList from './views/equipmentModule/equipmentNonIntelListModule/equipmentNonIntelList'
const equipmentList = () => import(/* webpackChunkName: "equipmentModule" */ './views/equipmentModule/equipment/equipmentList')
const equipmentMapModel = () => import(/* webpackChunkName: "equipmentModule" */ './views/equipmentModule/equipment/equipmentMapModel')
const equipmentEdit = () => import(/* webpackChunkName: "equipmentModule" */ './views/equipmentModule/equipment/equipmentEdit')
const integraleqList = () => import(/* webpackChunkName: "equipmentModule" */ './views/equipmentModule/integralEquipment/integraleqList')
const cargoWay = () => import(/* webpackChunkName: "equipmentModule" */ './views/equipmentModule/integralEquipment/cargoWay')
const equipmentTypeList = () => import(/* webpackChunkName: "equipmentModule" */ './views/equipmentModule/equipmentType/equipmentTypeList')
const fullList = () => import(/* webpackChunkName: "equipmentModule" */ './views/equipmentModule/equipmentFull/fullList')
const equipmentClearList = () => import(/* webpackChunkName: "equipmentModule" */ './views/equipmentModule/equipmentClear/equipmentClearList')
const equipmentHitchList = () => import(/* webpackChunkName: "equipmentModule" */ './views/equipmentModule/equipmentHitch/equipmentHitchList')
const equipmentCheckList = () => import(/* webpackChunkName: "equipmentModule" */ './views/equipmentModule/equipmentCheck/equipmentCheckList')
const flowWarnTab = () => import(/* webpackChunkName: "equipmentModule" */ './views/equipmentModule/flowWarn/flowWarnTab')

// 报表模块
const integralRecordList = () => import(/* webpackChunkName: "reportModule" */ './views/reportModule/integralRecord/integralRecordList')
const exchangeRecordList = () => import(/* webpackChunkName: "reportModule" */ './views/reportModule/exchangeRecord/exchangeRecordList')
const appointmentList = () => import(/* webpackChunkName: "reportModule" */ './views/reportModule/appointment/appointmentList')
const recycleList = () => import(/* webpackChunkName: "reportModule" */ './views/reportModule/recycleRecord/recycleList')
const castList = () => import(/* webpackChunkName: "reportModule" */ './views/reportModule/castRecord/castList')
const attenceList = () => import(/* webpackChunkName: "reportModule" */ './views/reportModule/attenceReport/attenceList')
// const attenceGatherList = () => import(/* webpackChunkName: "reportModule" */ './views/reportModule/attenceReport/attenceGatherModule/attenceGatherList')
const recycleReportList = () => import(/* webpackChunkName: "reportModule" */ './views/reportModule/recycleReportData/recycleReportList')
const recycleTypeReportList = () => import(/* webpackChunkName: "reportModule" */ './views/reportModule/recycleTypeData/recycleTypeList')

// ///====== 暂时不用的页面
// import menuList from './views/systemModule2/menuModule/menuList'
// // 社区管理
//
// import specialAdminList from './views/oldUnuse/specialAdmin/specialAdminList'
//
// // 厨余管理
// import foodWasteData from './views/oldUnuse/foodWasteModule/foodWasteData/foodWasteData'
// import communityViewList from './views/oldUnuse/foodWasteModule/communityView/communityViewList'
// import communityLaunchList from './views/oldUnuse/foodWasteModule/communityLaunch/communityLaunchList/communityLaunchList'
// import communityLaunchDetail from './views/oldUnuse/foodWasteModule/communityLaunch/communityLaunchDetail/communityLaunchDetail'
// import foodWasteInfoList from './views/oldUnuse/foodWasteModule/foodWasteInfo/foodWasteInfoList/foodWasteInfoList'
// import foodWasteInfoDetail from './views/oldUnuse/foodWasteModule/foodWasteInfo/foodWasteInfoDetail/foodWasteInfoDetail'

Vue.use(Router)

export const constantRouterMap = [
  { path: '/login', component: login },
  { path: '/404', component: err404 },
  {
    path: '/',
    component: layout,
    redirect: '/index',
    name: 'Home',
    children: [
      { path: 'index', name: '概览', component: home }
    ]
  },
  {
    path: '/large',
    component: App,
    name: 'large',
    redirect: '/large/index',
    children: [
      { path: 'index', name: '大数据', component: largeData1 },
      { path: 'large2', name: '大数据2', component: largeData },
      { path: 'gmap', name: '设备位置', component: gmap }
    ]
  },
  { path: '*', component: err404 }
]

/**
 * meta.parentList 字段是用于 未在菜单中显示的页面的多级面包屑的显示
 * hidden: true 表示不再菜单中显示
 * */

export const asyncRouterMap = [
  {
    path: '/baseData',
    name: '基础管理',
    isShowMenu: true,
    component: App,
    children: [
      {
        path: 'communityModule',
        name: '社区管理',
        component: layout,
        children: [
          { path: 'communityList', name: '小区列表', component: communityList, meta: { childList: ['/baseData/communityModule/communityHouse', '/baseData/communityModule/footWasteLaunch'] } },
          { path: 'communityHouse', name: '小区列表-查看住户', component: communityHouse, hidden: true },
          { path: 'footWasteLaunch', name: '小区列表-查看住户-厨余记录', component: footWasteLaunch, hidden: true },
          { path: 'communityAdminList', name: '管理员列表', component: communityAdminList },
          { path: 'communityAdminLog', name: '社区管理员日志', component: communityAdminLog }
        ]
      },
      {
        path: 'userModule',
        name: '用户列表',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'userList', name: '社区用户列表', component: userList, meta: { childList: ['/reportModule/integralRecord/integralList'] } }
        ]
      }
    ]
  },
  {
    path: '/equipmentModule',
    name: '设备管理',
    isShowMenu: true,
    component: App,
    children: [
      {
        path: 'equipment',
        name: '设备列表',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'equipmentList', name: '设备列表-列表', component: equipmentList, meta: { childList: ['/equipmentModule/equipment/equipmentEdit', '/equipmentModule/equipment/mapModel'] } },
          { path: 'mapModel', name: '地图模式', component: equipmentMapModel, hidden: true },
          { path: 'equipmentEdit', name: '设备编辑', component: equipmentEdit, hidden: true }
        ]
      },
      {
        path: 'integralEquipment',
        name: '兑换机列表',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'integraleqList', name: '积分兑换机', component: integraleqList, meta: { childList: ['/equipmentModule/integralEquipment/cargoWay'] } },
          { path: 'cargoWay', name: '查看货道信息', component: cargoWay, hidden: true }
        ]
      },
      {
        path: 'equipmentType',
        name: '设备类型',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'equipmentTypeList', name: '设备类型-列表', component: equipmentTypeList }
        ]
      },
      {
        path: 'equipmentFull',
        name: '满桶列表',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'fullList', name: '满桶列表-列表', component: fullList }
        ]
      },
      {
        path: 'equipmentClear',
        name: '清桶列表',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'equipmentClearList', name: '清桶列表-列表', component: equipmentClearList }
        ]
      },
      {
        path: 'equipmentHitch',
        name: '故障列表',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'equipmentHitchList', name: '故障列表-列表', component: equipmentHitchList }
        ]
      },
      {
        path: 'equipmentCheck',
        name: '检测列表',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'equipmentCheckList', name: '检测列表-列表', component: equipmentCheckList }
        ]
      },
      {
        path: 'flowWarn',
        name: '流量预警',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'flowWarnTab', name: '流量预警-tab', component: flowWarnTab }
        ]
      }
    ]
  },
  {
    path: '/reportModule',
    name: '报表统计',
    isShowMenu: true,
    component: App,
    children: [
      {
        path: 'recycleReport',
        name: '回收报表',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'recycleReportList', name: '回收报表-列表', component: recycleReportList }
        ]
      },
      {
        path: 'recycleTypeReport',
        name: '类型报表',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'recycleTypeReportList', name: '回收种类报表-列表', component: recycleTypeReportList }
        ]
      },
      {
        path: 'exchangeRecord',
        name: '兑换明细',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'exchangeList', name: '兑换记录', component: exchangeRecordList }
        ]
      },
      {
        path: 'integralRecord',
        name: '积分明细',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'integralList', name: '积分记录', component: integralRecordList }
        ]
      },
      {
        path: 'recycleRecord',
        name: '回收明细',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'recycleList', name: '回收列表', component: recycleList }
        ]
      },
      {
        path: 'castRecord',
        name: '投放明细',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'castList', name: '投放列表', component: castList }
        ]
      },
      {
        path: 'appointment',
        name: '预约报表',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'appointmentList', name: '预约列表', component: appointmentList }
        ]
      },
      {
        path: 'attenceReport',
        name: '考勤报表',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'attenceList', name: '考勤报表-列表', component: attenceList }
          // { path: 'attenceGatherList', name: '考勤汇总', hidden: true, component: attenceGatherList }
        ]
      }
    ]
  },
  {
    path: '/operation',
    name: '运营管理',
    isShowMenu: true,
    component: App,
    children: [
      {
        path: 'typeRuleModule',
        name: '分类规则管理',
        component: layout,
        children: [
          { path: 'integralRule', name: '积分规则', component: integralRuleList },
          { path: 'recycleSort', name: '回收参考分类', component: recycleSortList },
          { path: 'recycleType', name: '上门回收类型', component: recycleTypeList },
          { path: 'footWasteByHuzhou', name: '湖州厨余管理', component: footWasteByHuzhou },
          { path: 'integralDelList', name: '积分删除记录', component: integralDelList }
        ]
      },
      {
        path: 'cardModule',
        name: '卡片垃圾袋管理',
        component: layout,
        children: [
          { path: 'cardTaskList', name: '卡片生成', component: cardTaskList },
          { path: 'icardList', name: 'IC卡列表', component: icardList },
          { path: 'bagList', name: '垃圾袋列表', component: bagList }
        ]
      },
      {
        path: 'newsModule',
        name: '新闻管理',
        component: layout,
        children: [
          { path: 'newsTypeList', name: '新闻类型', component: newsTypeList },
          { path: 'newsList', name: '新闻列表', component: newsList }
        ]
      },
      {
        path: 'productModule',
        name: '商品管理',
        component: layout,
        children: [
          { path: 'productTypeList', name: '商品类型', component: productTypeList },
          { path: 'productAreaList', name: '商品列表', component: productAreaList, meta: { childList: ['/operation/productModule/productList'] } },
          { path: 'productList', name: '商品列表-列表', component: productList, hidden: true }
        ]
      },
      {
        path: 'feedBack',
        name: '评价反馈管理',
        component: layout,
        children: [
          { path: 'communityAdminExamine', name: '管理员考核列表', component: communityAdminExamine },
          { path: 'feedBackList', name: '意见反馈列表', component: feedBackList }
        ]
      },
      {
        path: 'attenceReport',
        name: '考勤设置',
        component: layout,
        noDropDown: true,
        children: [
          { path: 'attenceSet', name: '考勤设置-列表', component: attenceSet, meta: { childList: ['/operation/attenceReport/attenceTimeSet', '/operation/attenceReport/attenceManage', '/equipmentModule/equipment/equipmentList'] } },
          { path: 'attenceTimeSet', name: '考勤时间设置', hidden: true, component: attenceTimeSet }
        ]
      },
      {
        path: 'banner',
        name: 'banner管理',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'bannerList', name: 'banner列表', component: bannerList }
        ]
      },
      {
        path: 'answerModule',
        name: '答题管理',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'answerAreaList', name: '答题管理-列表', component: answerAreaList, meta: { childList: ['/operation/answerModule/answerList'] } },
          { path: 'answerList', name: '题目列表', component: answerList, hidden: true }
        ]
      },
      {
        path: 'carbonModule',
        name: '减碳管理',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'carbon', name: '减碳管理-列表', component: carbon }
        ]
      },
      {
        path: 'partnerModule',
        name: '公益伙伴管理',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'partnerList', name: '公益伙伴列表', component: partnerList }
        ]
      }
    ]
  },
  {
    path: '/systemModule',
    name: '系统管理',
    isShowMenu: true,
    component: App,
    children: [
      {
        path: 'accountModule',
        name: '账号管理',
        component: layout,
        children: [
          { path: 'adminAccountList', name: '账号列表', component: adminList },
          { path: 'orgList', name: '机构列表', component: orgList }
        ]
      },
      {
        path: 'area',
        name: '地区配置',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'areaList', name: '地区列表', component: areaList }
        ]
      },
      {
        path: 'log',
        name: '操作日志',
        noDropDown: true,
        component: layout,
        children: [
          { path: 'adminLogList', name: '管理员日志', component: adminLogList }
        ]
      }
    ]
  }
  /* {
    path: '/systemModule2',
    name: '系统管理',
    component: layout,
    redirect: '/systemModule2/menuList',
    children: [
      { path: 'menuList', name: '菜单管理', component: menuList },
      { path: 'orgList', name: '机构管理', component: orgList },
      { path: 'adminList', name: '管理员列表', component: adminList },
      { path: 'adminLogList', name: '管理员日志', component: adminLogList }
    ]
  },
  {
    path: '/communityModule',
    name: '社区管理',
    isShowMenu: true,
    component: layout,
    redirect: '/communityModule/userList',
    children: [
      { path: 'userList', name: '用户列表', component: userList },
      { path: 'communityList', name: '小区列表', component: communityList },
      { path: 'communityHouse', name: '查看住户', component: communityHouse, hidden: true, meta: { parentList: [{ name: '小区列表', href: '/communityModule/communityList' }] } },
      { path: 'footWasteLaunch', name: '厨余记录', component: footWasteLaunch, hidden: true, meta: { parentList: [{ name: '小区列表', href: '/communityModule/communityList' }] } },
      { path: 'communityAdminList', name: '社区管理员列表', component: communityAdminList },
      { path: 'areaList', name: '地区列表', component: areaList },
      { path: 'communityAdminLog', name: '社区管理员日志', component: communityAdminLog },
      { path: 'communityAdminExamine', name: '社区管理员考核', component: communityAdminExamine },
      { path: 'specialAdminList', name: '专管员管理', component: specialAdminList }
    ]
  },
  {
    path: '/foodWasteModule',
    name: '厨余垃圾',
    isShowMenu: true,
    component: layout,
    redirect: '/foodWasteModule/foodWasteData',
    children: [
      { path: 'foodWasteData', name: '厨余数据分析', component: foodWasteData },
      { path: 'communityViewList', name: '社区总览表', component: communityViewList },
      { path: 'communityLaunchList', name: '社区投放列表', component: communityLaunchList },
      { path: 'communityLaunchDetail', name: '社区投放日详情', component: communityLaunchDetail, hidden: true, meta: { parentList: [{ name: '社区投放列表', href: '/foodWasteModule/communityLaunchList' }] } },
      { path: 'foodWasteInfoList', name: '厨余垃圾列表', component: foodWasteInfoList },
      { path: 'foodWasteInfoDetail', name: '厨余垃圾详情', component: foodWasteInfoDetail, hidden: true, meta: { parentList: [{ name: '厨余垃圾列表', href: '/foodWasteModule/foodWasteInfoList' }] } }
    ]
  },
  {
    path: '/integralModule',
    name: '积分管理',
    isShowMenu: true,
    component: layout,
    redirect: '/integralModule/appointmentList',
    children: [
      { path: 'appointmentList', name: '预约列表', component: appointmentList },
      { path: 'integralRule', name: '积分规则', component: integralRuleList },
      { path: 'recycleType', name: '回收类型', component: recycleTypeList },
      { path: 'recycleList', name: '回收列表', component: recycleList },
      { path: 'recycleSort', name: '回收分类', component: recycleSortList },
      { path: 'recycleReportData', name: '回收报表', component: recycleReportList },
      { path: 'integralRecord', name: '积分记录', component: integralRecordList },
      { path: 'exchangeRecord', name: '兑换记录', component: exchangeRecordList }
    ]
  },
  {
    path: '/operationModule2',
    name: '运营管理',
    isShowMenu: true,
    component: layout,
    redirect: '/operationModule2/bannerList',
    children: [
      { path: 'bannerList', name: 'banner列表', component: bannerList },
      { path: 'newsList', name: '新闻列表', component: newsList },
      { path: 'newsTypeList', name: '新闻类型列表', component: newsTypeList },
      { path: 'product/productTypeList', name: '商品类型列表', component: productTypeList },
      { path: 'product/productAreaList', name: '商品管理', component: productAreaList },
      { path: 'product/productList', name: '商品列表', component: productList, hidden: true, meta: { parentList: [{ name: '商品管理', href: '/operationModule2/product/productAreaList' }] } },
      { path: 'icardList', name: 'IC卡', component: icardList },
      { path: 'bagList', name: '垃圾袋', component: bagList },
      { path: 'feedBackList', name: '意见反馈列表', component: feedBackList },
      { path: 'cardTaskList', name: '卡片生成任务管理', component: cardTaskList },
      { path: 'answerAreaList', name: '答题管理', component: answerAreaList },
      { path: 'answerList', name: '题目列表', component: answerList, hidden: true, meta: { parentList: [{ name: '答题管理', href: '/operationModule2/answerAreaList' }] } }
    ]
  },
  {
    path: '/equipmentModule',
    name: '设备管理',
    isShowMenu: true,
    component: layout,
    redirect: '/equipmentModule/equipmentList',
    children: [
      { path: 'equipmentList', name: '二分类机', component: equipmentList },
      { path: 'mapModel', name: '地图模式', hidden: true, component: equipmentMapModel, meta: { parentList: [{ name: '二分类机', href: '/equipmentModule/equipmentList' }] } },
      { path: 'equipmentEdit', name: '设备编辑', component: equipmentEdit, hidden: true, meta: { parentList: [{ name: '二分类机', href: '/equipmentModule/equipmentList' }] } },
      // { path: 'equipmentNonIntelList', name: '非智能设备', component: equipmentNonIntelList },
      { path: 'integraleqList', name: '积分兑换机', component: integraleqList },
      { path: 'cargoWay', name: '查看货道信息', hidden: true, component: cargoWay, meta: { parentList: [{ name: '积分兑换机', href: '/equipmentModule/integraleqList' }] } },
      { path: 'equipmentTypeList', name: '设备类型', component: equipmentTypeList },
      { path: 'castList', name: '投放列表', component: castList },
      { path: 'fullList', name: '满桶列表', component: fullList }
    ]
  },
  {
    path: '/attenceReport',
    name: '打卡考勤',
    isShowMenu: true,
    component: layout,
    redirect: '/attenceReport/attenceList',
    children: [
      { path: 'attenceList', name: '考勤报表', component: attenceList },
      { path: 'attenceGatherList', name: '考勤汇总', hidden: true, component: attenceGatherList, meta: { parentList: [{ name: '考勤报表', href: '/attenceReport/attenceList' }] } },
      { path: 'attenceSet', name: '考勤设置', component: attenceSet },
      { path: 'attenceTimeSet', name: '考勤时间设置', hidden: true, component: attenceTimeSet, meta: { parentList: [{ name: '考勤设置', href: '/attenceReport/attenceSetting' }] } },
      { path: 'attenceManage', name: '考勤管理列表', hidden: true, component: attenceManageList, meta: { parentList: [{ name: '考勤设置', href: '/attenceReport/attenceSetting' }] } }
    ]
  } */
]

export default new Router({
  mode: 'history',
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
