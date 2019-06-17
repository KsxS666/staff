// pages/my/user.js
var QRCode = require('../../qrcode.js');
var request = require('../../utils/request.js')
var amapFile = require('..­/../../../libs/amap-wx.js')
import regeneratorRuntime from '../../utils/regenerator-runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    active: 0,
    dataList: [],
    typeName: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function(options) {
    wx.setScreenBrightness({value: 1})
    this.getList()
    // var _this = this;
    // wx.showLoading({
    //   title: '',
    //   mask: true,
    //   icon: 'none'
    // })
    // wx.getStorage({
    //   key: 'user',
    //   success: function(resr) {
    //     wx.request({
    //       method: 'post',
    //       url: getApp().data.baseUrl + '/equipment/api/equipmentType/getListByType',
    //       data: {
    //         token: resr.data.token,
    //         username: resr.data.username,
    //         type: 2
    //       },
    //       header: {
    //         "Content-Type": "application/x-www-form-urlencoded"
    //       },
    //       success: (res) => {
    //         // 生成首位垃圾类型的二维码
    //         new QRCode('canvas', {
    //           text: res.data.data[0].textValue,
    //           width: 226,
    //           height: 229,
    //           colorDark: "#000000",
    //           colorLight: "#ffffff",
    //           correctLevel: QRCode.CorrectLevel.H,
    //         });
    //         wx.hideLoading();
    //         _this.setData({
    //           navBarList: res.data.data,
    //           typeName: res.data.data[0].name
    //         })
    //       }
    //     })
    //   },
    //   fail: function(res) {
    //     wx.redirectTo({
    //       url: '/pages/login/login'
    //     })
    //   }
    // })


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
  async getList() {
    var _this = this
    const userInfo = getApp().getUser()
    if (!userInfo) {
      return
    }
    let res = await request.$isPost('/equipment/api/equipmentType/getListByType', {
      username: userInfo.username,
      token: userInfo.token,
      type: 2
    }, {
      show: true,
      text: '请稍后'
    })
    if (res.code === 0) {
      _this.setData({
        dataList: res.data,
        typeName: res.data[0].name
      })
      new QRCode('canvas', {
        text: res.data[0].textValue,
        width: 226,
        height: 229,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H,
      });
    }
  },
  myurl: function() {
    wx.setScreenBrightness({ 
        value: 0.6,
        complete() {
          wx.reLaunch({
            url: '/pages/index/index',
          })
        }
      })

  },
  user: function() {
    wx.setScreenBrightness({
      value: 0.6,
      complete() {
        wx.reLaunch({
          url: '/pages/my/my',
        })
      }
    })
  },
  /**
   * 垃圾类型切换对应的二维码
   */
  toVote: function(e) {
    var _this = this;
    wx.showLoading({
      title: '',
      mask: true,
      icon: 'none'
    })
    // 生成二维码
    new QRCode('canvas', {
      text: _this.data.dataList[e.currentTarget.dataset.id].textValue,
      width: 226,
      height: 229,
      colorDark: "#000000",
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H,
    });
    _this.setData({
      typeName: _this.data.dataList[e.currentTarget.dataset.id].name,
      active: e.currentTarget.dataset.id
    }, (() => {
      wx.hideLoading()
    }))
  }
})