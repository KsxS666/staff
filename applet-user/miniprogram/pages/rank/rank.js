// pages/rank/rank.js
var request = require('../../utils/request.js');
import regeneratorRuntime from '../../utils/regenerator-runtime'
var dataList1 = []
var dataList2 = [] 
var dataList3 = []
var dataList4 = []
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    current: 0,
    currentIndex: 0,
    optionStaticList:['本月','上月','社区总榜','全国总榜'],
    rankNum:'',
    dataList1: [],
    dataList2: [],
    dataList3: [],
    dataList4: [],
    isFlag1: false,
    isFlag2: false,
    isFlag3: false ,   
    isFlag4: false,
    page1:2,
    page2: 2,
    page3: 2,
    page4: 2,
    totalPage1: 0,
    totalPage2: 0,
    totalPage3: 0,
    totalPage4: 0,  
    isLoading1: false,
    isLoading2: false,   
    isLoading3: false,   
    isLoading4: false,  
    isOver1: false,
    isOver2: false, 
    isOver3: false, 
    isOver4: false, 
    rank1: '',
    rank2: '',
    rank3: '',
    rank4: '',    
     
       
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUser()
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
    var _this = this
    let current = _this.data.current
    _this.getList(current, true)
    switch(current) {
      case 0:
        _this.setData({
          page1: 2
        })
      case 1:
        _this.setData({
          page2: 2
        })
      case 2:
        _this.setData({
          page3: 2
        })
      case 3:
        _this.setData({
          page4: 2
        })
    }
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
  // swiper点击触发
  switchCard(e) {
    console.log(e)
    this.setData({
      currentIndex: e.currentTarget.dataset.index
    })
  },
  // swiper滚动触发
  bindchange(e) {
    let current = e.detail.current    
    this.setData({current})
    this.getList(current)
    this.getRanking(current)
  },
  getUser() {
    var _this = this
    wx.getStorage({
      key: 'user',
      success: function(res) {
        _this.setData(
          { userInfo: res.data}
        )
        _this.getList1({token: res.data.token, username: res.data.username})
      },
      fail: function() {
        wx.reLaunch({
          url: '/pages/login/login',
        })
      }
    })
  },
  async getList1(params) {
    var _this = this
    let res = await request.$isPost('/user/api/userRank/getIntegralRank', {token: params.token, username:params.username, type: 0}, { show: true, text: '' })
    let res2 = await request.$isPost('/user/api/userRank/getRanking', { token: params.token, username: params.username, type: 0 }, { show: false })
    _this.setData({
      dataList1: res.data.resultList,
      rankNum: res2.data.ranking,
      updataTime: res.data.updateTime,
      rank1: res2.data.ranking
    })
  },
  async getList(current, isPull = false, page = 1) {
    if (!isPull) {
      switch (current) {
        case 0:
          if (this.data.dataList1 && this.data.dataList1.length) {
            return
          }
          break
        case 1:
          if (this.data.dataList2 && this.data.dataList2.length) {
            return
          }
          break
        case 2:
          if (this.data.dataList3 && this.data.dataList3.length) {
            return
          }
          break
        case 3:
          if (this.data.dataList4 && this.data.dataList4.length) {
            return
          }
          break
      }
    }

    var _this = this
    const userInfo = wx.getStorageSync('user')
    let res = await request.$isPost('/user/api/userRank/getIntegralRank', { token: userInfo.token, username: userInfo.username, type: current, page }, { show: true, text: '' })
    wx.stopPullDownRefresh()
    if (res.code === 0) {
      _this.setData({
        updataTime: res.data.updateTime
      })
      switch (current) {
        case 0:
          _this.setData({ dataList1: res.data.resultList, totalPage1: res.data.totalPage })
          dataList1 = res.data.resultList
          break
        case 1:
          _this.setData({ dataList2: res.data.resultList, totalPage2: res.data.totalPage })
          dataList2 = res.data.resultList
          break
        case 2:
          _this.setData({ dataList3: res.data.resultList, totalPage3: res.data.totalPage })
          dataList3 = res.data.resultList
          break
        case 3:
          _this.setData({ dataList4: res.data.resultList, totalPage4: res.data.totalPage })
          dataList4 = res.data.resultList
          break
      }
    } else {
      wx.showToast({
        title: res.msg,
        mask: true,
        icon: 'none'
      })
    }
  },
  async getRanking(current) {
    var _this = this
    const userInfo = getApp().getUser()
    if (!userInfo) {
      return
    }
    switch(current) {
      case 0:
        if (_this.data.rank1!== '') {
          _this.setData({
            rankNum: _this.data.rank1
          })
          return
        }
        break
      case 1:
        console.log(_this.data.rankNum)
        if (_this.data.rank2 !== '') {
          _this.setData({
            rankNum: _this.data.rank2
          })
          return
        }
        break
      case 2:
        if (_this.data.rank3 !== '') {
          _this.setData({
            rankNum: _this.data.rank3
          })
          return
        }
        break
      case 3:
        if (_this.data.rank4 !== '') {
          _this.setData({
            rankNum: _this.data.rank4
          })
          return
        }
        break
    }
    let res2 = await request.$isPost('/user/api/userRank/getRanking', { token: userInfo.token, username: userInfo.username, type: current }, { show: false })

    if (res2.code === 0) {
      switch(current) {
        case 0:
        _this.setData({
          rankNum: res2.data.ranking,
          rank1: res2.data.ranking
        })
        break
        case 1:
          _this.setData({
            rankNum: res2.data.ranking,
            rank2: res2.data.ranking
          })
        break
        case 2:
        _this.setData({
          rankNum: res2.data.ranking,
          rank3: res2.data.ranking
        })
        break
        case 3:
        _this.setData({
          rankNum: res2.data.ranking,
          rank4: res2.data.ranking
        })
        break
      }
      // _this.setData({
      //   rankNum: res2.data.ranking,
      // })
    } else {
      wx.showToast({
        title: res.msg,
        mask: true,
        icon: 'none'
      })
    }
  },
  async toBottom() {
    var _this = this
    let current = _this.data.current
    const userInfo = getApp().getUser()
    if (!userInfo) {
      return
    }
    switch(current) {
      case 0:

        let page1 = _this.data.page1
        let totalPage1 = _this.data.totalPage1
        let dataList1 = _this.data.dataList1
        if (page1 <= totalPage1) {
          _this.setData({
            isLoading1: true
          })
          let res1 = await request.$isPost('/user/api/userRank/getIntegralRank', { token: userInfo.token, username: userInfo.username, type: current, page: page1 }, { show: false })
          if (res1.code === 0) {
            _this.setData({
              page1: page1 + 1,
              dataList1: page1 < totalPage1 ? dataList1.concat(res1.data.resultList) : dataList1,
              isOver1: res1.data.totalPage > _this.data.page1 ? false : true,
              isLoading1: false
            })
          }
        }
        break
      case 1:

        let page2 = _this.data.page2
        let totalPage2 = _this.data.totalPage2
        let dataList2 = _this.data.dataList2
        if (page2 <= totalPage2) {
          _this.setData({
            isLoading2: true
          })
          let res2 = await request.$isPost('/user/api/userRank/getIntegralRank', { token: userInfo.token, username: userInfo.username, type: current, page: page2 }, { show: false })
          if (res2.code === 0) {
            _this.setData({
              page2: page2 < totalPage2 ? page2 + 1 : page2,
              dataList2: page2 < totalPage2 ? dataList2.concat(res2.data.resultList) : dataList2,
              isOver2: res2.data.totalPage > _this.data.page2 ? false : true,
              isLoading2: false
            })
          }
        }
        break
      case 2:
        let page3 = _this.data.page3
        let totalPage3 = _this.data.totalPage3
        let dataList3 = _this.data.dataList3
        if (page3 <= totalPage3) {
          _this.setData({
            isLoading3: true
          })
          let res3 = await request.$isPost('/user/api/userRank/getIntegralRank', { token: userInfo.token, username: userInfo.username, type: current, page: page3 }, { show: false })
          if (res3.code === 0) {
            _this.setData({
              page3: page3 < totalPage3 ? page3 + 1 : page3,
              dataList3: page3 < totalPage3 ? dataList3.concat(res3.data.resultList) : dataList3,
              isOver3: res3.data.totalPage > _this.data.page3 ? false : true,
              isLoading3: false
            })
          }
        }
        break
      case 3:

      let page4 = _this.data.page4
      let totalPage4 = _this.data.totalPage4
      let dataList4 = _this.data.dataList4
      if (page4 <= totalPage4) {
        _this.setData({
          isLoading4: true
        })
        let res4 = await request.$isPost('/user/api/userRank/getIntegralRank', { token: userInfo.token, username: userInfo.username, type: current, page: page4 }, { show: false })
        if (res4.code === 0) {
          _this.setData({
            page4: page4 < totalPage4 ? page4 + 1 : page4,
            dataList4: page4 < totalPage4 ? dataList4.concat(res4.data.resultList) : dataList4,
            isOver4: res4.data.totalPage > _this.data.page4 ? false : true,
            isLoading4: false
          })
        }
      }

      break
    }
  }
})