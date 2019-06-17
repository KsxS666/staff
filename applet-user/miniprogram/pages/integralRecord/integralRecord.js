// pages/integralRecord/integralRecord.js
var request = require('../../utils/request.js')
var numTo = require('../../utils/numTo.js')
import regeneratorRuntime from '../../utils/regenerator-runtime'
import * as echarts from '../../ec-canvas/echarts.min'
var chart = null
function initChart(canvas, width, height) {
  chart = echarts.init(canvas, null, {
    width: width,
    height: height
  });
  canvas.setChart(chart);
  // var option1 = option;
  // chart.setOption(option1);
  return chart
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    minIntegral:null,
    integral: 0,
    pieList: [],
    getIntegral:0,
    userIntegral:0,
    tapName:'全部',
    noPie: false,
    echartsComponnet: null,
    isPie: false,
    ec: {
      onInit: initChart
    },
    tapIndex: '',
    totalPage: '',
    page: 1,
    isLoading: false,
    isOver: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.echartsComponnet = this.selectComponent('#mychart-dom-pie')
    this.getMinIntegral()
    this.getPieList()    
    this.getIntegralRecord()
    this.getIntegralAndCast()
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
    this.setData({
      page: 1
    })
    this.getMinIntegral()
    this.getPieList()
    this.getIntegralRecord()
    this.getIntegralAndCast()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    let page = _this.data.page
    let totalPage = _this.data.totalPage
    let tapIndex = _this.data.tapIndex
    if (page <= totalPage) {
      _this.setData({
        isLoading: true
      })
      _this.getIntegralRecord(tapIndex, page, true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  // 点击过滤按钮
  showFilterSheet() {
    var _this = this
    wx.showActionSheet({
      itemList: ['全部', '获取', '使用'],
      success(res) {
        let ttype = ''
        if (res.tapIndex === 0) {
          ttype = ''
          _this.setData({
            tapIndex: '',
            tapName: '全部',
            page: 1
          })
        } else if (res.tapIndex === 1) {
          ttype = 0
          _this.setData({
            tapIndex: 0,
            tapName: '获取',
            page: 1
          })
        }else{
          _this.setData({
            tapIndex: 1,
            tapName: '使用',
            page: 1
          })
          ttype = 1
        }
        _this.getIntegralRecord(ttype)
      }
    })
  },
  getPieList() {
    var _this = this
    wx.getStorage({
      key: 'integralAndCast',
      success: function(res) {
        _this.setData({
          pieList: res.data.equipmentStatisticsList
        },() => {
          const pieList = res.data.equipmentStatisticsList
          let data = []
          pieList.map(ele => {
            if (ele.weight <= 0) return
            let obj = { name: ele.typeName, value: ele.weight }
            data.push(obj)
          })
          if (!data.length) {
            _this.setData({
              noPie: true
            })
            return
          }
          _this.init_echarts()
        })
      },
      fail: function() {
        wx.showToast({
          title: '获取图表数据失败！',
          mask: true,
          icon: 'none'
        })
      }
    })
  },
  init_echarts: function () {
    this.data.echartsComponnet.init((canvas, width, height) => {
      // 初始化图表
      const Chart = echarts.init(canvas, null, {
        width: width,
        height: height
      });
      var _this = this
      Chart.setOption(_this.getOption());
      // 注意这里一定要返回 chart 实例，否则会影响事件处理等
      // return Chart;
    });
  },
  getOption() {
    var _this = this
    const pieList = _this.data.pieList
    let colors = []
    let data = []
    pieList.map(ele => {
      if (ele.integral <= 0) return
      let obj = { name: ele.typeName, value: ele.integral }
      data.push(obj)
      colors.push(ele.color)
    })
    const option = {
      backgroundColor: "#ffffff",
      color: colors,
      legend: {
        type: 'plain',
        orient: 'vertical',
        left: 40,
        top: '20%',
        align: 'left',
        itemWidth: 8,
        itemHeight: 8,
        itemGap: 12,
        textStyle: {
          color: '#999999',
          fontSize: 12
        },
        formatter: function (name) {
          let index = 0
          data.map((value, i) => {
            if (value.name == name) {
              index = i;
            }
          })
          return name + "   " + data[index].value;
        }
      },
      series: [{
        label: {
          show: false
        },
        labelLine: {
          show: false
        },
        type: 'pie',
        center: ['70%', '45%'],
        radius: ['20%', '80%'],
        roseType: 'radius',
        data: data,
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 2, 2, 0.3)'
          }
        }
      }]
    }
    return option
  },
  getIntegralAndCast() {
    var _this = this
    wx.getStorage({
      key: 'integralAndCast',
      success: function (res) {
        _this.setData({ integral: numTo.handleNumber(res.data.integral) },(() => {wx.stopPullDownRefresh()}))
      },
    })
  },
  async getMinIntegral() {
    var _this = this
    const userInfo = wx.getStorageSync('user')
    if (!userInfo) {
      return
    }
    let res = await request.$isPost('/system/api/product/getMinIntegral', { username: userInfo.username, token: userInfo.token }, { show: false })
    if (res.code === 0) {
      _this.setData({
        minIntegral: res.data
      })
    } else {
      wx.showToast({
        title: res.msg,
        mask: true,
        icon: 'none'
      })
    }
  },
  async getIntegralRecord(type = '', page = 1, isBottom = false) {
    var _this = this
    const userInfo = wx.getStorageSync('user')
    if (!userInfo) {
      wx.reLaunch({
        url: '/pages/login/login',
      })
      return
    }else{
      let res = await request.$isPost('/integral/api/integralRecord/getPage', { username: userInfo.username, token: userInfo.token, type: type, page }, { show: isBottom ? false : true, text: '' })
      if (isBottom) {
        _this.setData({
          isLoading: false
        })
      }
      if (res.code === 0) {
        let integralRecordList = _this.data.integralRecordList
        _this.setData({
          integralRecordList: isBottom ? integralRecordList.concat(res.data.resultList) : res.data.resultList ,
          totalPage: res.data.totalPage,
          // page: page < res.data.totalPage ? page + 1 : page,
          page: page + 1,
          getIntegral: res.data.getIntegral,
          useIntegral: res.data.useIntegral,
          isOver: res.data.totalPage > _this.data.page ? false : true,
        })
      }else{
        wx.showToast({
          title: res.msg,
          mask: true,
          icon: 'none'
        })
      }
    }
  }
})