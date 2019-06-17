// pages/forgetCode/forgetCode.js
var request = require('../../utils/request.js');
import regeneratorRuntime from '../../utils/regenerator-runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    code: '',
    phone: '',
    num0: '',
    num1: '',
    num2: '',
    num3: '', 
    num4: '',    
    num5: '',   
    focus: true,
    isFocus: false,
    second: 60,
    over: false        
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      phone: options.phone,
    })
    this.getCountDown()
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
  getCountDown() {
    var _this = this
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
          over: true
        })
      }
    }, 1000)
    wx.showToast({
      title: '已发送',
      mask: true,
      icon: 'none'
    })
  },
  codeInput(e) {
    this.setData({
      focus: e.detail.value.length === 6 ? false : true,  
      code: e.detail.value,    
      num0: e.detail.value.substr(0,1) ,
      num1: e.detail.value.substr(1, 1),              
      num2: e.detail.value.substr(2, 1),              
      num3: e.detail.value.substr(3, 1),              
      num4: e.detail.value.substr(4, 1),              
      num5: e.detail.value.substr(5, 1),                            
    })
    if (e.detail.value.length === 6) {
      this.submit()
      
    }
  },
  async submit() {
    var _this = this
    let res = await request.$isPost('/user/api/user/verifyCode', { phone: _this.data.phone, code: _this.data.code,typeCode: 2 }, { show: true, text: '验证中...' })
    if (res.code === 0) {
      wx.navigateTo({
        url: '/pages/setNewPassword/setNewPassword?phone=' + _this.data.phone+'&code= '+_this.data.code+'',
      })
    }else{
      _this.setData({
        code: ''
      })
      wx.showToast({
        title: res.msg,
        mask: true,
        icon: 'none'
      })
    }
  },
  bindfocus() {
    this.setData({
      isFocus: true
    })
  },
  bindblur() {
    this.setData({
      isFocus: false
    })
  },
  async retry() {
    var _this = this
    let res = await request.$isPost('/user/api/user/sendMsg', { phone: _this.data.phone, typeCode: 2 }, { show: true, text: '' })
    if (res.code === 0) {
      this.getCountDown()      
    }else{
      wx.showToast({
        title: res.msg,
        mask: true,
        icon: 'none'
      })
    }
  }
})