// pages/cast/cast.js
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
    echartsComponnet: null,
    equipmentTotalCast: 0,
    equipmentTotalWeight: 0,   
    inspectionStatus: '', 
    castList: [],
    ec: {
      onInit: initChart
    },
    noPie: false,
    isLoading: false,
    tapName: '全部',
    page:1,
    totalPage: '',
    isOver: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.data.echartsComponnet = this.selectComponent('#mychart-dom-pie')
    this.getPieList()
    this.getCast()
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
      tapName:'全部',
      page:1
    })
    this.getPieList()
    this.getCast()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var _this = this
    let page = _this.data.page
    let totalPage = _this.data.totalPage
    let inspectionStatus = _this.data.inspectionStatus
    if (page <=totalPage) {
      _this.setData({
        isLoading: true
      })
      this.getCast(page, inspectionStatus, true)
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getPieList() {
    var _this = this
    wx.getStorage({
      key: 'integralAndCast',
      success: function (res) {
        _this.setData({
          equipmentTotalCast: res.data.equipmentTotalCast,
          equipmentTotalWeight: numTo.handleNumber(res.data.equipmentTotalWeight/1000),
          pieList: res.data.equipmentStatisticsList
        },(() => {
            // chart.setOption(_this.getOption(res.data.equipmentStatisticsList))
            // _this.getOption(res.data.equipmentStatisticsList)
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
        }))
      },
      fail: function () {
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
      if (ele.weight <= 0) return
      let obj = { name: ele.typeName, value: ele.weight }
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
          return name + "   " + data[index].value/1000 + 'kg';
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
  async getCast(page = 1, inspectionStatus = '', isBottom = false) {
    var _this = this
    const userInfo = getApp().getUser()
    if (!userInfo) {
      return
    }
    let res = await request.$isPost('/equipment/api/equipmentCast/getPage', { userId:userInfo.id, inspectionStatus, page }, { show: isBottom ? false : true , text: '' })
    if (isBottom) {
      _this.setData({
        isLoading: false
      })
    }
    wx.stopPullDownRefresh()
    if (res.code === 0) {
      let castList = _this.data.castList
      _this.setData({
        castList: isBottom ? castList.concat(res.data.resultList) : res.data.resultList,
        totalPage: res.data.totalPage ? res.data.totalPage : '',
        // page: res.data.resultList.length ? _this.data.page + 1 : _this.data.page,e
        page: page + 1,
        isOver: res.data.totalPage > _this.data.page ? false : true,
      })
    }else{
      wx.showToast({
        title:res.msg,
        mask:true,
        icon:'none'
      })
    }
  },
  showSheet() {
    var _this = this
    const itemList = ['全部', '待巡检', '已通过', '不通过']
    wx.showActionSheet({
      itemList: ['全部', '待巡检', '已通过', '不通过'],
      success(res) {
        console.log(res)

        let tapIndex = ''
        if (res.tapIndex !== 0) {
          tapIndex = res.tapIndex - 1
        }
        _this.setData({
          castList: [],
          tapName: itemList[res.tapIndex],
          inspectionStatus: tapIndex,
          page: 1
        })
        _this.getCast(1, tapIndex)
      }
    })
  }
})