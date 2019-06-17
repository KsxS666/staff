// pages/chooseLib/chooseLib.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    temp: {
      memberId: "",
      phone: "",
      typeCode: 0
    },
    phone: "",
    password: "",
    numshow: false,
    code: "",
    codename: "获取验证码",
    selectChenak: false
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
  selectChenke: function() {
    this.setData({
      selectChenak: !this.data.selectChenak
    })
  },
  getInput: function(e) {
    this.data.phone = e.detail.value;
  },
  getCode: function() {
    var that = this;
    var reg = new RegExp('^(13[0-9]|14[579]|15[0-3,5-9]|16[6]|17[0135678]|18[0-9]|19[89])\\d{8}$');
    if (this.data.phone == "") {
      return wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1000
      })
    } else if (!reg.test(this.data.phone)) {
      return wx.showToast({
        title: '请输入正确手机号码！',
        icon: 'none',
        duration: 1000
      })
    } else {
      if (this.data.numshow) {
        return;
      }
      wx.request({
        method: 'Post',
        url: getApp().data.baseUrl + '/user/api/user/sendMsg',
        data: {
          memberId: "",
          phone: parseInt(this.data.phone),
          typeCode: 2
        },
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: (res) => {
          wx.hideLoading()
          if (res.data.code == 0) {
            var num = 61;
            var timer = setInterval(function() {
              num--;
              if (num <= 0) {
                clearInterval(timer);
                that.setData({
                  codename: '重新发送',
                  disabled: false,
                  numshow: false
                })

              } else {
                that.setData({
                  codename: "重新发送(" + num + "s)",
                  numshow: true
                })
              }
            }, 1000)
          } else {
            wx.showToast({
              title: res.data.msg,
              icon: 'none',
              duration: 1000
            })
          }

        }
      })

    }

  },

  subRegister: function(e) {
    if (e.detail.value.password == "") {
      return wx.showToast({
        title: '请输入新密码！',
        icon: 'none',
        duration: 1000
      })
    }

    wx.request({
      method: 'Post',
      url: getApp().data.baseUrl + '/user/api/user/resetPass',
      data: {
        phone: e.detail.value.phone,
        password: e.detail.value.password,
        code: e.detail.value.code
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.code == 0) {
          wx.showToast({
            title: '成功',
            icon: 'success',
            duration: 2000,
            success: function() {
              wx.reLaunch({
                url: '/pages/login/login'
              })
            }
          })

        } else {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 1000
          })
        }

      }
    })

  },


})