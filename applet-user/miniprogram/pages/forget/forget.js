// pages/forget/forget.js
var request = require('../../utils/request.js');
import regeneratorRuntime from '../../utils/regenerator-runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    disabled: true
  },
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
  phoneInput(e) {
    this.setData({
      phone: e.detail.value,
      disabled: e.detail.value.length === 11 ? false : true
    })
  },
  async getPhoneCode() {
    var _this = this
    let res = await request.$isPost('/user/api/user/sendMsg', {phone: _this.data.phone,typeCode: 2}, {show: true, text: ''})
    if (res.code === 0) { 
      wx.navigateTo({
        url: '/pages/forgetCode/forgetCode?phone='+_this.data.phone+'',
      })
    } else {
      wx.showToast({
        title: res.msg || res.message,
        icon: 'none',
        duration: 2000
      })
    }
  },
})