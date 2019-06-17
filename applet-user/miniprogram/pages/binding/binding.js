// pages/binding/binding.js
var request = require('../../utils/request.js');
var check = require('../../utils/check.js')
import regeneratorRuntime from '../../utils/regenerator-runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addres: "",
    houseId: "",
    name: "",
    phone: "",
    isChecked1: false,
    selectChenak: false,
    joinFamily: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = getApp().getUser()
    if (!userInfo) {
      return
    }
    this.setData({
      name: userInfo.name,
      addres: userInfo.house ? userInfo.house.cityName + userInfo.house.districtName + userInfo.house.communityName + userInfo.house.address : '',
      phone: userInfo.phone,
      houseId: userInfo.house ? userInfo.house.id: ''
    })
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
    this.onLoad()
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
  nameInput(e) {
    console.log(e)
    this.setData({
      name: e.detail.value
    })
  },
  showActionSheet: function() {
    wx.showActionSheet({
      itemList: ['我是学生', '我是居民'],
      itemColor: '#007ACC',
      success(res) {
        let tapIndex = res.tapIndex
        if (tapIndex === 0) {
          wx.navigateTo({
            url: '/pages/selectaddress/selectaddress?isSchool='+true+'',
          })
        }
        else{
          wx.navigateTo({
            url: '/pages/selectaddress/selectaddress?isSchool=' + false + '',
          })
        }
      }
    })
  },


  searchBox: function(e) {
    var _this = this;
    if (e.detail.value.name == "") {
      return wx.showToast({
        title: '请输入真实姓名！',
        icon: 'none',
        duration: 1000
      })
    }
    if (this.data.houseId == "" || this.data.addres == "") {
      return wx.showToast({
        title: '请选择住址！',
        icon: 'none',
        duration: 1000
      })
    }
    _this.sureEdit()
    // wx.getStorage({
    //   key: 'user',
    //   success: function(resr) {
    //     wx.showLoading({
    //       title: '提交中...',
    //     })
    //     wx.request({
    //       method: 'post',
    //       url: getApp().data.baseUrl + '/user/api/user/update',
    //       data: {
    //         token: resr.data.token,
    //         username: resr.data.username,
    //         name: e.detail.value.name,
    //         houseId: _this.data.houseId,
    //         joinFamily: _this.data.joinFamily ? "1" : "0"
    //       },
    //       header: {
    //         "Content-Type": "application/x-www-form-urlencoded"
    //       },
    //       success: (res) => {
    //         if (res.data.code == 0) {
    //           wx.hideLoading()
    //           wx.setStorageSync('userInfoData', res.data.data)
    //           wx.redirectTo({
    //             url: '/pages/index/index'
    //           })
    //         } else {
    //           wx.showToast({
    //             title: res.data.msg,
    //             icon: 'none',
    //             duration: 1000
    //           })
    //         }

    //         // if (res.data.code == 0) {

    //         // } else {
    //         //   wx.showToast({
    //         //     title: res.data.msg,
    //         //     icon: 'none',
    //         //     duration: 1000
    //         //   })
    //         // }

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
  selectChenke: function() {
    this.setData({
      selectChenak: !this.data.selectChenak
    })
  },
  changeSwitch1: function(e) {
    this.setData({
      isChecked1: e.detail.value,
      joinFamily: e.detail.value == true ? "1" : "0"
    })
  },
  async sureEdit() {
    var _this = this
    const name = _this.data.name
    const userInfo = getApp().getUser()
    if (!userInfo) {
      return
    }
    let res = await request.$isPost('/user/api/user/update', { username: userInfo.username, token: userInfo.token, name, joinFamily: _this.data.joinFamily ? "1" : "0" }, { show: true, text: '请稍后' })
    if (res.code === 0) {
      wx.setStorageSync('user', res.data)
      wx.navigateBack()
    }else{
      wx.showToast({
        title: res.msg || res.message,
        mask: true,
        icon: 'none'
      })
    }
  }
})