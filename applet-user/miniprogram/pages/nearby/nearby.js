// pages/nearby/nearby.js
var request = require('../../utils/request.js')
var amapFile = require('..­/../../../libs/amap-wx.js')
import regeneratorRuntime from '../../utils/regenerator-runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: '116.40',
    latitude: '39.90',
    markers: [],
    circles: [],
    includePoints: [],
    curLocationInfo: null,
    nearbyList: null,
    isTip: true,
    isSmart: true,
    isNonSmart: true,
    none: false
  },
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    wx.authorize({ 
      scope: "scope.userLocation",
      success(){
        _this.getCurLocation()        
      },
      fail (error) {
        console.log('wx.authorize', error)
        _this.setData({
          none: true
        })
        _this.authModel()
      }
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

  hideTip() {
    this.setData({
      isTip: false
    })
  },
  authModel() {
    wx.showModal({
      title: '请求授权当前位置',
      content: '需要获取您的地理位置，请确认授权',
      success(res) {
        if (res.cancel) {
          wx.showToast({
            title: '拒绝授权',
            icon: 'none',
            duration: 1000
          })
        } else if (res.confirm) {
          wx.openSetting({
            success: function (res) {
            }
          })
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  mapInit() {
    var that = this;
    var myAmapFun = new amapFile.AMapWX({
      key: 'de6786092eaa7c454d0b46f00f763f1e'
    });
    myAmapFun.getPoiAround({
      success: function(data) {
        //成功回调
      },
      fail: function(info) {
        //失败回调
        console.log(info)
      }
    })
  },
  getCurLocation() {
    var _this = this
    var myAmapFun = new amapFile.AMapWX({
      key: 'de6786092eaa7c454d0b46f00f763f1e'
    })
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        myAmapFun.getRegeo({
          data: [res.longitude, res.latitude],
          success: function (gpsRes) {
            console.log(gpsRes)
            _this.setData({
              curLocationInfo: gpsRes[0],              
              none: false,
              latitude: res.latitude,
              longitude: res.longitude,
              circles: [{
                latitude: res.latitude,
                longitude: res.longitude,
                color: '#C2DBA2',
                fillColor: '#E3F0DE88',
                radius: 1800,
                strokeWidth: 1
              }]
            })
            _this.getNearBy({
              cityName: gpsRes[0].regeocodeData.addressComponent.city
            })
          },
          fail: function (info) {
            //失败回调
            console.log(info)
          }
        })
      },
    })

  },
  async getNearBy(params) {
    var _this = this
    let res = await request.$isPost('/equipment/api/equipmentPosition/getNearbyEquipmentList', {
      cityName: params.cityName
    }, {
      show: true,
      text: '请稍后'
    })
    if (res.code === 0) {
      let markers = []
      let obj = {}
      let points = []
      res.data.map(ele => {
        let pointsObj = {
          longitude: ele.longitude,
          latitude: ele.dimensionality
        }
        points.push(pointsObj)
        let content = `${ele.address}`
        if (ele.type === 1 && ele.barrelList.length) {
          content += '\n\n'
          ele.barrelList.map((item, index) => {
            if (item.isFull) {
              content += index === ele.barrelList.length - 1 ? `${item.typeName}(满桶)` : `${item.typeName}、`
            } else {
              content += index === ele.barrelList.length - 1 ? `${item.typeName}` : `${item.typeName}、`
            }
            // if (index === ele.barrelList.length - 1) {
            //   content += `${item.typeName}`
            // } else {
            //   content += `${item.typeName}、`
            // }
          })
          obj = {
            iconPath: '../../images/nearby/4.png',
            longitude: ele.longitude,
            latitude: ele.dimensionality,
            width: 26,
            height: 26,
            callout: {
              content: content,
              padding: 12,
              bgColor: '#00000096',
              color: '#06E5F9',
              borderRadius: 6,
              // borderColor: '#0CA1FF',
              // borderWidth: 3,
              fontSize: 16,
              fontWeight: 700
            }
          }
        } else {
          obj = {
            iconPath: '../../images/nearby/6.png',
            longitude: ele.longitude,
            latitude: ele.dimensionality,
            width: 26,
            height: 26,
            callout: {
              content: content,
              padding: 12,
              bgColor: '#00000096',
              color: '#06E5F9',
              borderRadius: 6,
              // borderColor: '#0CA1FF',
              // borderWidth: 3,
              fontSize: 16,
              fontWeight: 700
            }
          }
        }
        markers.push(obj)
      })

      _this.setData({
        markers
      })
      this.mapCtx = wx.createMapContext('map'); //获取地图对象同canvas相似，获取后才能调用相应的方法
      // this.mapCtx.includePoints({
      //   padding: [20],
      //   points: points
      // })//缩放视野展示所有经纬度
      wx.setStorageSync('nearList', res.data)
    } else {
      wx.showToast({
        title: res.msg,
        mask: true,
        icon: 'none'
      })
    }
  },
  typeSwitch(e) {
    var _this = this
    let markers = _this.data.markers
    console.log(markers)
    let index = e.currentTarget.dataset.index
    switch (index) {
      case '0':
        _this.setData({
          isSmart: !_this.data.isSmart
        })
        break
    }
  },
  goNearbyList() {
    wx.navigateTo({
      url: '/pages/nearbyList/nearbyList',
    })
  }
})