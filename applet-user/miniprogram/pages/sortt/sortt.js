// pages/guide/guide.js
var request = require('../../utils/request.js');
import regeneratorRuntime from '../../utils/regenerator-runtime'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    current: 0,
    dataList: [],
    rightList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList()
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
  async getList() {
    let res = await request.$isPost('/integral/api/reclaimClassify/getList', {}, { show: true, text: '请稍后' })
    if (res.code === 0) {
      this.setData({
        dataList: res.data,
        tipArr:JSON.parse(res.data[0].tip),
        rightList: res.data[0].children
      })
    }
  },
  leftTap(e) {
    this.setData({
      current: e.currentTarget.dataset.index,
      tipArr: JSON.parse(this.data.dataList[e.currentTarget.dataset.index].tip),
      rightList: this.data.dataList[e.currentTarget.dataset.index].children
    })
  }
})