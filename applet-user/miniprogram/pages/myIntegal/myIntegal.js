// pages/myIntegal/myIntegal.js
var request = require('../../utils/request.js');
var numTo = require('../../utils/numTo.js')
import regeneratorRuntime from '../../utils/regenerator-runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    integral: 0,
    needIntegral: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getIntegralAndCast()
    this.getMinIntegral()
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
    this.getIntegralAndCast()
    this.getMinIntegral()
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
  getIntegralAndCast() {
    var _this = this
    wx.getStorage({
      key: 'integralAndCast',
      success: function (res) {
        _this.setData({ integral: numTo.handleNumber(res.data.integral) })
      },
    })
  },
  async getMinIntegral() {
    var _this = this
    const userInfo = wx.getStorageSync('user')
    const integralAndCast = wx.getStorageSync('integralAndCast')
    
    if (!userInfo) {
      return
    }
    let res = await request.$isPost('/system/api/product/getMinIntegral', { username:userInfo.username, token: userInfo.token }, { show: false })
    wx.stopPullDownRefresh()
    if (res.code === 0) {
      if (parseInt(integralAndCast.integral) > parseInt(res.data.minIntegral)){
        _this.setData({
          needIntegral: ''
        })
      }else{
        _this.setData({
          needIntegral: parseInt(res.data.minIntegral) - parseInt(integralAndCast.integral)
        })
      }
    }else{
      wx.showToast({
        title: res.msg,
        mask: true,
        icon: 'none'
      })
    }
  }
})