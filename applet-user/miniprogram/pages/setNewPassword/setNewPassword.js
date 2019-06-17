// pages/setNewPassword/setNewPassword.js
var request = require('../../utils/request.js');
import regeneratorRuntime from '../../utils/regenerator-runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    code: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
      code: options.code
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
  formSubmit(e) {
    if (!e.detail.value.password || !e.detail.value.repassword) {
      return wx.showToast({
        title: '请确认表单信息',
        mask: true,
        icon: 'none'
      })
    }
    if (e.detail.value.password !== e.detail.value.repassword) {
      return wx.showToast({
        title: '两次密码输入不一致',
        mask: true,
        icon: 'none'
      })
    }
    this.submit(e.detail.value.password)
  },
  async submit(password) {
    let res = await request.$isPost('/user/api/user/resetPass', { code: this.data.code, phone: this.data.phone, password }, { show: true, text: '请稍后' })
    if (res.code === 0) {
      wx.showToast({
        title: '修改密码成功',
        mask: true,
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/login/login',
        },2000)
      })
    }else{
      wx.showToast({
        title: res.msg||res.message,
        mask: true,
        icon: 'none'
      })
    }
  }
})