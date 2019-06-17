// pages/login/login.js
var check = require('../../utils/check.js')
var request = require('../../utils/request.js');
import regeneratorRuntime from '../../utils/regenerator-runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    loginType: 1,
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
  toPas() {
    this.setData({
      loginType: 2
    })
  },
  toPhone() {
    this.setData({
      loginType: 1
    })
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
    let res = await request.$isPost('/user/api/user/sendMsg', {
      phone: _this.data.phone,
      typeCode: 4
    }, {
      show: false
    })
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
    const loginType = this.data.loginType
    _this.toLogin(loginType, e.detail.value)
  },
  async toLogin(loginType, params) {
    let url = ''
    switch(loginType) {
      case 1:
        if (!params.phone || !params.code) {
          wx.showToast({
            title: '请确认表单信息',
            mask:true,
            icon:'none'
          })
          return
        }
        url = '/user/api/user/loginBySms'
        let res = await request.$isPost(url, { phone: params.phone, code: params.code, flag: 2 }, { show: true, text: '' })
        if (res.code === 0) {
          wx.showToast({
            title: '',
            mask: true,
            icon: 'success',
            duration:2000
          })
          wx.setStorageSync('user', res.data)
          if (!res.data.house) {
            wx.showModal({
              title: '是否前往绑定地址',
              content: '没有绑定地址会导致部分功能不可用',
              success(ress) {
                if (ress.confirm) {
                  wx.navigateTo({
                    url: '/pages/binding/binding',
                  })
                } else if (ress.cancel) {
                  wx.navigateTo({
                    url: '/pages/index/index',
                  })
                }
              }
            })
          }
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }else{
          wx.showToast({
            title: res.msg || res.message,
            icon: 'none',
            duration: 2000
          })
        }
        break
      case 2:
        if (!params.username || !params.password) {
          wx.showToast({
            title: '请确认表单信息',
            mask: true,
            icon: 'none'
          })
          return
        }
        url = '/user/api/user/login'
        let res2 = await request.$isPost(url, { username: params.username, password: params.password, flag: 2 }, { show: true, text: '正在登录' })
        if (res2.code === 0) {
          wx.showToast({
            title: '登录成功！',
            mask: true,
            icon: 'none'
          })
          wx.setStorageSync('user', res2.data)
          wx.reLaunch({
            url: '/pages/index/index',
          })
        } else {
          wx.showToast({
            title: res2.msg || res2.message,
            icon: 'none',
            duration: 2000
          })
        }
    }
  },
  getWxAuthorCode() {
    var _this = this
    wx.login({
      success(res) {
        _this.wxLogin(res.code)
      },
      fail: function() {
        wx.showToast({
          title: '获取微信授权码失败！',
          mask: true,
          icon: 'none'
        })
      }
    })
  },
  async wxLogin(code) {
    wx.showLoading({
      title: '',
      mask: true,
      icon: 'none'
    })
    let res = await request.$isPost('/user/api/user/loginByWechatSp', {code}, {show: true,text: ''})
    wx.hideLoading()
    if (res.code === 0) {
      if (res.data.isRegister == false) {
        wx.showToast({
          title: '即将前往绑定手机',
          mask: true,
          icon: 'none'
        })
        delete res.data.isRegister
        setTimeout(() => {
          wx.navigateTo({
            url: "/pages/bindPhone/bindPhone?params=" + JSON.stringify(res.data),
          })
        }, 2000)
      } else {
        wx.showToast({
          title: '登录成功',
          mask: true,
          icon: 'none'
        })
        wx.setStorage({
          key: 'user',
          data: res.data.user,
          success() {
            wx.reLaunch({
              url: '/pages/index/index',
            })
          }
        })
      }
    }
  },
  goRegist() {
    wx.navigateTo({
      url: '/pages/register/register',
    })
  }
})