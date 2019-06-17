//index.js
var request = require('../../utils/request.js')
var numTo = require('../../utils/numTo.js')
var amapFile = require('..­/../../../libs/amap-wx.js')
import regeneratorRuntime from '../../utils/regenerator-runtime'
Page({
  data: {
    bannerList:null,
    gpsCity:'',
    nearbyList:null,
    integral: 0,
    equipmentTotalCast: 0,
    cumulativeIntegral: 0
  },
  onLoad: function () {
    this.checkHouse()
    this.getIntegralAndCast()
    this.getBanner()
  },
  onShow: function() {
    let userInfo = wx.getStorageSync('user')
    if (userInfo) {
      getApp().authSet()
    }
  },
  onReady: function() {},
  onPullDownRefresh: function() {
    // 下拉刷新
    var _this = this;
    _this.getIntegralAndCast()
    _this.checkHouse()
    _this.getBanner()
  },
  async getBanner() {
    var _this = this
    const userInfo = getApp().getUser()
    if (!userInfo) {
      return
    }
    wx.showLoading({
      title: '',
      mask: true,
      icon:'none'
    })
    let res = await request.$isPost('/system/api/banner/getPage', { username: userInfo.username, token: userInfo.token, locationCode: 4 }, { show: false })
    wx.hideLoading()
    if (res.code === 0) {
      _this.setData({
        bannerList: res.data.resultList
      })
    }else{
      wx.showToast({
        title: res.msg,
        mask: true,
        icon:'none'
      })
    }
  },
  async getIntegralAndCast() {
    var _this = this
    const userInfo = wx.getStorageSync('user')
    if (!userInfo) {
      return
    }
    let res = await request.$isPost('/equipment/api/equipmentCast/getIntegralAndCast', { username: userInfo.username, token: userInfo.token }, { show: false })
    if (res.code === 0) {
      _this.setData({
        integral: numTo.handleNumber(res.data.integral),
        equipmentTotalCast: numTo.handleNumber(res.data.equipmentTotalCast),
        cumulativeIntegral: numTo.handleNumber(res.data.cumulativeIntegral)
      })
      wx.setStorage({
        key: 'integralAndCast',
        data: res.data,
      })
    }
  },
  checkHouse() {
    var _this = this
    wx.getStorage({
      key: 'user',
      success: function(res) {
        let userInfo = res.data
        if (userInfo.house) {
          _this.getNearby1({cityName: userInfo.house.cityName})
        }else{
          _this.getLoc()
        }
      },
      fail: function() {
        wx.reLaunch({
          url: '/pages/login/login',
        })
      }
    })
  },
  async getNearby1(params) {  //已绑定地址
    var _this = this
    let res = await request.$isPost('/equipment/api/equipmentPosition/getNearbyEquipmentList', { cityName: params.cityName }, { show: true, text: '' })
    wx.stopPullDownRefresh()
    if (res.code === 0) {
      _this.setData({
        nearbyList: res.data
      })
    }else {
      wx.showToast({
        title: res.msg,
        mask: true,
        icon: 'none'
      })
    }
  },
  async getLoc() { //未绑定地址获取当前所在位置的坐标
    var _this = this  
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // 用户已经同意小程序使用位置功能，后续调用 wx.startRecord 接口不会弹窗询问
              console.log('已弹窗地理授权弹窗')
            }
          })
        } else {
          wx.getLocation({
            type: 'gcj02',
            success(res) {
              var myAmapFun = new amapFile.AMapWX({ key: 'de6786092eaa7c454d0b46f00f763f1e' })
              myAmapFun.getRegeo({
                data: [res.longitude, res.latitude],
                success: function (gpsRes) {
                  _this.getNearBy2({ cityName: gpsRes[0].regeocodeData.addressComponent.city})
                },
                fail: function (info) {
                  //失败回调
                  console.log(info)
                }
              })
            }
          })
        }
      }
    })
  },
  async getNearBy2(params) {
    var _this = this
    let res = await request.$isPost('/equipment/api/equipmentPosition/getNearbyEquipmentList', { cityName: params.cityName }, { show: true, text: '' })
    wx.stopPullDownRefresh()
    if (res.code === 0 ) {
      _this.setData({
        nearbyList: res.data
      })
    } else {
      wx.showToast({
        title: res.data.msg,
        icon: 'none',
        duration: 2000
      })
    }
  },
  makeRef: function() {
    //预约跳转
    wx.getStorage({
      key: 'user',
      success: function(res) {
        if (res.data.house) {
          wx.navigateTo({
            url: '/pages/make/make',
          })
        }else{
          wx.showToast({
            title: '请先绑定地址',
            mask: true,
            icon:'none'
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/binding/binding'
            })
          },2000)
        }
      },
    })
  },
  goSort :function() {
    wx.navigateTo({
      url: '/pages/sortt/sortt',
    }) 
  },
  gorank: function () {
    wx.navigateTo({
      url: '/pages/rank/rank',
    })
  },
  goguide: function() {
    wx.navigateTo({
      url: '/pages/guide/guide',
    })
  },
  gonear: function() {
    wx.navigateTo({
      url: '/pages/nearby/nearby',
    })
  },
  myurl: function() {
    wx.reLaunch({
      url: '/pages/my/my',
    })
  },
  roalert: function() {
    wx.reLaunch({
      url: '/pages/qrcode/qrcode',
    })
  }
})