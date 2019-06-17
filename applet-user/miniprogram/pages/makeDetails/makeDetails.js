// pages/makeDetails/makeDetails.js
var request = require('../../utils/request.js');
import regeneratorRuntime from '../../utils/regenerator-runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    stateCode: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    var _this = this
    _this.setData({
      stateCode: options.stateCode ? options.stateCode : 1
    })
    wx.getStorage({
      key: 'user',
      success: function(res) {
        wx.showLoading({
          title: '',
          mask: true,
          icon: 'none'
        })
        wx.request({
          url: getApp().data.baseUrl + '/integral/api/appointment/getAppointment',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: { token: res.data.token, username: res.data.username, id: options.id },
          method: 'POST',
          success: ((res) => {
            if (res.data.code === 0) {
              wx.hideLoading()
              _this.setData({
                dataList: res.data.data || []
              })
            } else {
              wx.showToast({
                title: res.data.msg,
                icon: 'none',
                duration: 2000
              })
            }
          }),
          fail: (() => {
            wx.showToast({
              title: '服务器连接失败！',
              icon: 'none',
              duration: 2000
            })
          })
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
  toCall(e) {
    console.log(e)
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.adminphone,
    })
  }
})