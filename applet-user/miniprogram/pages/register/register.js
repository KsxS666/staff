// pages/chooseLib/chooseLib.js
var request = require('../../utils/request.js');
var check = require('../../utils/check.js')
import regeneratorRuntime from '../../utils/regenerator-runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    second: 60,
    disabled: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {


  },
  bindPhoneInput(e) {
    var _this = this
    _this.setData({
      phone: e.detail.value
    })
  },
  async getPhoneCode() {
    var _this = this
    if (!check.checkPhone(_this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        mask: true,
        icon: 'none'
      })
      return
    }
    let res = await request.$isPost('/user/api/user/sendMsg', { phone: _this.data.phone, typeCode: 0 }, { show: false })
    if (res.code === 0) {
      let countdown = 60
      var timeMachine = setInterval(() => {
        countdown -= 1
        _this.setData({
          second: countdown
        })
        if (countdown < 0) {
          clearInterval(timeMachine)
          _this.setData({
            second: 60,
            disabled: false
          })
        }
      }, 1000)
      _this.setData({
        disabled: true
      })
      wx.showToast({
        title: '发送成功',
        mask: true,
        icon: 'none'
      })
      _this.setData({
        sendDisabled: true
      })
    }else{
      wx.showToast({
        title: res.msg || res.message,
        mask: true,
        icon: 'none'
      })
      return
      // if (res.code === 109) {
      //   wx.reLaunch({
      //     url: '/pages/login/login',
      //   })
      // }
    }
  },
  formSubmit(e) {
    var _this = this
    if (!e.detail.value.phone || !e.detail.value.code || !e.detail.value.password || !check.checkPhone(_this.data.phone)) {
      wx.showToast({
        title: '请确认表单信息！',
        mask: true,
        icon: 'none'
      })
      return
    }else {
      _this.toVeriFyCode(e.detail.value)
    }
  },
  async toVeriFyCode(paramsparams) {
    let res = await request.$isPost('/user/api/user/verifyCode', { phone: params.phone, code: params.code, typeCode: 0 }, { show: false, text: '' })
    if (res.code === 0) {
      _this.toRegist()
    }else{
      wx.showToast({
        title: '验证码错误',
        mask: true,
        icon: 'none'
      })
    }
  },
  async toRegist(params) {
    let res = await request.$isPost('/user/api/user/register', { phone: params.phone, password: params.password }, { show: true, text: '' })
    if (res.code === 0) {
      wx.showToast({
        title: '注册成功！',
        mask: true,
        icon: 'none',
        success() {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }
      })
    }
  }
})