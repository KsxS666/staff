// pages/makeRecord/makeRecord.js
var check = require('../../utils/check.js')
var request = require('../../utils/request.js');
import regeneratorRuntime from '../../utils/regenerator-runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dataList: [],
    page: 2,
    isLoading: false,
    isOver: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    _this.getList()
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
    this.getList()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    var _this = this
    let page = _this.data.page
    let totalPage = _this.data.totalPage
    if (page < totalPage) {
      _this.setData({
        isLoading: false
      })
      this.getList(page, true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  // 获取预约记录列表
  async getList(page = 1, isBottom = false) {
    var _this = this
    const userInfo = getApp().getUser()
    if (!userInfo) {
      return
    }
    let res = await request.$isPost('/integral/api/appointment/getMyList', {
      username: userInfo.username,
      token: userInfo.token,
      page
    }, {
      show: isBottom ? false : true,
      text: '请稍后...'
    })
    wx.stopPullDownRefresh()
    if (isBottom) {
      _this.setData({
        isLoading: true
      })
    }
    if (res.code === 0) {
      let dataList = _this.data.dataList
      _this.setData({
        dataList: isBottom ? dataList.concat(res.data.resultList) : res.data.resultList,
        page: page < res.data.totalPage ? page + 1 : page,
        isOver: res.data.totalPage > _this.data.page ? false : true,
        totalPage: res.data.totalPage
      })
    } else {
      wx.showToast({
        title: res.msg,
        mask: true,
        icon: 'none'
      })
    }
  },
  // 取消预约
  async appointCancel(e) {
    var _this = this

    wx.showModal({
      title: '确定取消预约？',
      content: '',
      success(res) {
        if (res.confirm) {
          _this.sureCancel(e)
        }
      }
    })

  },
  async sureCancel(e) {
    var _this = this
    const userInfo = getApp().getUser()
    if (!userInfo) {
      return
    }
    let res = await request.$isPost('/integral/api/appointment/cancelAppointment', {
      id: e.currentTarget.dataset.id,
      token: userInfo.token,
      username: userInfo.username
    }, {
        show: false
      })
    if (res.code === 0) {
      wx.showToast({
        title: '取消成功',
        mask: true,
        duration: 2000,
        success: (() => {
          _this.getList()
        })
      })
    }
  }
})