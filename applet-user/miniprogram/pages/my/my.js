// pages/my/my.js
import regeneratorRuntime from '../../utils/regenerator-runtime'
var numTo = require('../../utils/numTo.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    integral: 0,
    equipmentTotalCast: 0,
    cumulativeIntegral: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this
    wx.getStorage({
      key: 'user',
      success: function(res) {
        _this.setData({
          userInfo:res.data
        })
      },
    })
    wx.getStorage({
      key: 'integralAndCast',
      success: function(res) {
        _this.setData(
          { 
            integral: numTo.handleNumber(res.data.integral),
            equipmentTotalCast: numTo.handleNumber(res.data.equipmentTotalCast),
            cumulativeIntegral: numTo.handleNumber(res.data.cumulativeIntegral)
          })
      },
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  toCall() {
    wx.makePhoneCall({
      phoneNumber: '(0592)602 8705',
    })
  },
  logOut() {
    wx.showActionSheet({
      itemList: ['退出登录'],
      itemColor: '#DD4F42',
      success(res) {
        if (res.tapIndex === 0) {
          wx.clearStorage()
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      }
    })
  },
  // 底部导航跳转
  myurl: function () {
    wx.reLaunch({
      url: '/pages/index/index',
    })
  },
  roalert: function () {
    wx.reLaunch({
      url: '/pages/qrcode/qrcode',
    })
  }
})