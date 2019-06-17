// pages/bindPhone/bindPhone.js
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
    disabled: false,
    wxAuthInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      wxAuthInfo: JSON.parse(options.params)
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
  bindPhoneInput(e) {
    var _this = this
    _this.setData({
      phone: e.detail.value
    })
  },
  checkPhone() {
    var _this = this
    if (!check.checkPhone(_this.data.phone)) {
      wx.showToast({
        title: '请输入正确的手机号',
        mask: true,
        icon: 'none'
      })
      return
    }
    _this.getPhoneCode()
  },
  async getPhoneCode() {
    var _this = this
    let res = await request.$isPost('/user/api/user/sendMsg', { phone: _this.data.phone, typeCode: 4 }, { show: false })
    if (res.code === 0) {
      _this.setData({
        disabled: true
      })
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

      wx.showToast({
        title: '已发送',
        mask: true,
        icon: 'none'
      })
    } else {
      wx.showToast({
        title: res.msg,
        icon: 'none',
        duration: 2000
      })
    }
  },
  formSubmit(e) {
    var _this = this
    if (!e.detail.value.phone || !e.detail.value.code) {
      wx.showToast({
        title: '请确认表单信息！',
        mask: true,
        icon: 'none'
      })
      return
    } else {
      _this.bind(e.detail.value)
    }
  },
  async bind(params) {
    var _this = this
    const wxAuthInfo = _this.data.wxAuthInfo
    const reqData = Object.assign(params, wxAuthInfo)
    let res = await request.$isPost('/user/api/user/loginBySms', reqData, { show: false })
    if (res.code === 0) {
      wx.showToast({
        title: '绑定成功',
        mask: true,
        icon:'none'
      })
      wx.setStorage({
        key: 'user',
        data: res.data,
        success() {
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }, 2000)
        }
      })

    }
  }
})