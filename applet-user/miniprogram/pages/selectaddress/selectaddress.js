// pages/selectaddress/selectaddress.js
var request = require('../../utils/request.js');
var check = require('../../utils/check.js')
import regeneratorRuntime from '../../utils/regenerator-runtime'
let multiArray0 = [];
let multiArray1 = [];
let multiArray2 = [];
let addres = "";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    areaType: "",
    multiArray: [multiArray0, multiArray1, multiArray2], //封装obj
    mult1: [],
    mult2: [],
    multiIndex: [0, 0, 0],
    location_id: 41, //默认省份id   
    cityid: "", //区,
    addres: "",
    provinceName: "",
    cityName: "",
    distinguishName: "",
    streetList: [], //存储街道集合
    streetArry: [], //获取街道集合
    streetVaule: "",
    streetName: "",
    communityList: [], //存储社区集合
    communityArry: [], //获取社区集合 
    communityVaule: "",
    communityName: "",
    boamderRoander: [],
    buildingNumberList: [], //存储楼号集合
    buildingNumberArry: [], //获取楼号集合 
    buildingNumberVaule: "",
    buildingNumberName: "",
    unitArry: [], //获取单元集合   
    unitVaule: "",
    unitName: "",
    houseDetail: [],
    houseList: [], //存储门户集合
    houseArry: [], //获取门户集合   
    houseVaule: "",
    houseName: "",
    isSchool: '',
    houseId: ''
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this;
    _this.setData({
      isSchool: options.isSchool
    })
    _this.huixian()
    multiArray0 = [];
    multiArray1 = [];
    multiArray2 = [];
    wx.request({
      method: 'post',
      url: getApp().data.baseUrl + '/community/api/community/getAreaList',
      data: {},
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.code == 0) {
          if (res.data.data) {
            var list = res.data.data;
            // picker组件数组构造               
            var mult1 = []
            var mult2 = []
            for (var i = 0; i < list.length; i++) {
              // var obj = { id: list[i].id, label: list[i].label}
              multiArray0.push(list[i].label);
              for (var k = 0; k < list[i].children.length; k++) {
                var obj = {
                  id: list[i].children[k].id,
                  label: list[i].children[k].label,
                  prentId: list[i].id,
                  name: list[i].label
                }
                mult1.push(obj);
                for (var j = 0; j < list[i].children[k].children.length; j++) {
                  var obj = {
                    id: list[i].children[k].children[j].id,
                    label: list[i].children[k].children[j].label,
                    prentName: list[i].label,
                    name: list[i].children[k].label
                  }
                  mult2.push(obj);
                }
              }
            }
            for (let t = 0; t < list[0].children.length; t++) {
              multiArray1.push(list[0].children[t].label);
            }
            for (let i = 0; i < list[0].children[0].children.length; i++) {
              multiArray2.push(list[0].children[0].children[i].label);
            }
            this.data.cityid = mult2[0].id;
            this.data.provinceName = multiArray0[0];
            this.data.cityName = multiArray1[0];
            this.data.distinguishName = multiArray2[0];
            addres = multiArray0[0] + multiArray1[0] + multiArray2[0];
            _this.setData({
              multiArray: [multiArray0, multiArray1, multiArray2],
              mult1: mult1,
              mult2: mult2
            })
          }
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
  huixian() {
    var _this = this
    wx.getStorage({
      key: 'user',
      success: function(res) {
        if (res.data.house && res.data.house.doorNumber && _this.data.isSchool === 'true') {
          return
        }
        if (res.data.house) {
          _this.getStreet(res.data.house.districtId)
          _this.getListByStreet(res.data.house.streetId)
          _this.getDetail(res.data.house.communityId)
          _this.getDetail2(res.data.house.communityId, res.data.house.building)
          _this.getDetail3(res.data.house.communityId, res.data.house.building, res.data.house.unit)          
        }
        _this.setData({
          addres: res.data.house ? res.data.house.provinceName + res.data.house.cityName + res.data.house.districtName : '',
          streetName: res.data.house ? res.data.house.streetName : '',
          communityName: res.data.house ? res.data.house.communityName : '',    
          buildingNumberName: res.data.house ? res.data.house.building : '',
          unitName: res.data.house ? res.data.house.unit : '',
          houseName: res.data.house ? res.data.house.doorNumber : ''                    
        })
      },
    })
  },
  changeDateTimeColumn: function(e) {
    var _this = this;
    if (e.detail.column == 0) {

      var arry = [],
        arryid = [],
        arry1 = [];
      for (var i = 0; i < this.data.mult1.length; i++) {
        if (this.data.mult1[i].name == multiArray0[e.detail.value]) {
          arry.push(this.data.mult1[i].label)
        }
      }
      for (var i = 0; i < this.data.mult2.length; i++) {
        if (this.data.mult2[i].name == arry[0]) {
          arry1.push(this.data.mult2[i].label)
          arryid.push(this.data.mult2[i].id)
        }
      }
      multiArray1 = arry;
      multiArray2 = arry1;
      _this.setData({
        multiArray: [multiArray0, arry, arry1],
        cityid: arryid[0]
      })
      this.data.provinceName = multiArray0[e.detail.value];
      this.data.cityName = multiArray1[0];
      this.data.distinguishName = multiArray2[0];
    }
    if (e.detail.column == 1) {
      var arry1 = [],
        arryid = [];
      _this.setData({
        multiArray: [multiArray0, multiArray1, []],
      })
      multiArray2 = [];
      for (var i = 0; i < this.data.mult2.length; i++) {
        if (this.data.mult2[i].name == multiArray1[e.detail.value]) {
          arry1.push(this.data.mult2[i].label)
          arryid.push(this.data.mult2[i].id)
        }
      }
      multiArray2 = arry1;
      _this.setData({
        multiArray: [multiArray0, multiArray1, multiArray2],
        cityid: arryid[0]
      })
      this.data.cityName = multiArray1[e.detail.value];
      this.data.distinguishName = multiArray2[0];
    }
    if (e.detail.column == 2) {

      var arryid = "";
      for (var i = 0; i < this.data.mult2.length; i++) {
        if (this.data.mult2[i].label == multiArray2[e.detail.value]) {
          arryid = this.data.mult2[i].id
        }
      }
      _this.setData({
        cityid: arryid
      })
      this.data.distinguishName = multiArray2[e.detail.value];
    }
  },

  bindCasPickerChange: function() {

    if (this.data.provinceName || this.data.cityName || this.data.distinguishName) {
      addres = this.data.provinceName + this.data.cityName + this.data.distinguishName;
    }
    var _this = this;
    this.setData({
      addres: addres,
      streetName: "",
      streetVaule: "",
      communityName: "",
      communityVaule: "",
      buildingNumberName: "",
      buildingNumberVaule: "",
      unitName: "",
      unitVaule: "",
      houseName: "",
      houseVaule: "",
      streetArry: [],
      communityArry: [],
      houseDetail: [],
      unitArry: [],
      houseArry: []
    })

    wx.request({
      method: 'post',
      url: getApp().data.baseUrl + '/community/api/community/getStreetList',
      data: {
        districtId: this.data.cityid
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.code == 0) {
          if (res.data.data) {
            _this.setData({
              streetArry: res.data.data
            })
          }
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

  bindChangeStreet: function(e) {
    var _this = this;
    let isSchool = _this.data.isSchool
    this.setData({
      streetVaule: e.detail.value,
      streetName: _this.data.streetArry[e.detail.value].streetName,
      communityName: "",
      communityVaule: "",
      buildingNumberName: "",
      buildingNumberVaule: "",
      unitName: "",
      unitVaule: "",
      houseName: "",
      houseVaule: "",
      unitArry: [],
      houseArry: [],
      houseDetail: []
    })

    wx.request({
      method: 'post',
      url: getApp().data.baseUrl + '/community/api/community/getListByStreet',
      data: {
        streetId: _this.data.streetArry[e.detail.value].streetId,
        areaType: isSchool === 'true' ? 1 : 0
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        wx.hideLoading()
        if (res.data.code == 0) {
          if (res.data.data) {
            _this.setData({
              communityList: res.data.data,
              communityArry: res.data.data,
            })
          }

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

  bindChangeCommunity: function(e) {
    var _this = this
    this.setData({
      communityVaule: e.detail.value,
      communityName: _this.data.communityArry[e.detail.value].name,
      buildingNumberName: "",
      buildingNumberVaule: "",
      unitName: "",
      unitVaule: "",
      houseName: "",
      houseVaule: "",
      areaType: _this.data.communityArry[e.detail.value].areaType,
      unitArry: [],
      houseArry: [] 
    })
    wx.showLoading({
      title: '',
      mask: true,
      icon: 'none'
    })
    wx.request({
      method: 'post',
      url: getApp().data.baseUrl + '/user/api/house/getList',
      data: {
        communityId: this.data.communityArry[e.detail.value].id
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: (res) => {
        if (res.data.code == 0) {
          if (res.data.data) {
            _this.data.boamderRoander = res.data.data;
            _this.setData({
              houseDetail: res.data.data,             
            },(() => {
                wx.hideLoading()              
            }))
          }

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

  buildingNumber: function(e) {
    var _this = this;
    this.setData({
      buildingNumberVaule: e.detail.value,
      buildingNumberName: _this.data.houseDetail[e.detail.value].label,
      unitName: "",
      unitVaule: "",
      houseName: "",
      houseVaule: ""
    })
    _this.setData({
      unitArry: _this.data.houseDetail[e.detail.value].children
    })
  },


  bindChangeunit: function(e) {
    var _this = this;
    this.setData({
      unitVaule: e.detail.value,
      unitName: _this.data.unitArry[e.detail.value].label,
      houseName: "",
      houseVaule: ""
    })
    if (this.data.areaType == 1) {
      return;
    }
    var houseArry = [];
    _this.setData({
      houseArry: _this.data.houseDetail[_this.data.buildingNumberVaule].children[e.detail.value].children,
    })
  },

  bindChangehouse: function(e) {
    console.log(e.detail.value)
    var _this = this
    const houseArry = _this.data.houseArry
    let houseId = houseArry[e.detail.value].value
    this.setData({
      houseVaule: e.detail.value,
      houseName: _this.data.houseArry[e.detail.value].label,
      houseId
    })

  },


  searchBox: function() {
    var _this = this;
    if (this.data.addres == "") {
      return wx.showToast({
        title: '请选择城市区！',
        icon: 'none',
        duration: 1000
      })
    }
    if (this.data.streetName == "") {
      return wx.showToast({
        title: '请选择街道！',
        icon: 'none',
        duration: 1000
      })
    }
    if (this.data.communityName == "") {
      return wx.showToast({
        title: this.data.isSchool === 'true' ? "请选择学校！" : "请选择小区！",
        icon: 'none',
        duration: 1000
      })
    }
    if (this.data.buildingNumberName == "") {
      return wx.showToast({
        title: '请选择楼号！',
        icon: 'none',
        duration: 1000
      })
    }
    if (this.data.unitName == "") {
      return wx.showToast({
        title: '请选择单元！',
        icon: 'none',
        duration: 1000
      })
    }

    if (this.data.houseName == "" && this.data.areaType == 0) {
      return wx.showToast({
        title: '请选择门户！',
        icon: 'none',
        duration: 1000
      })
    }
    const houseId = _this.data.houseId    
    _this.bind(houseId)

    // getApp().data.addres = this.data.addres + this.data.streetName + this.data.communityName + this.data.buildingNumberName + this.data.unitName + this.data.houseName;
    // getApp().data.houseId = this.data.cityid;
    // wx.navigateBack(); 
  },
  async bind(houseId) {
    const userInfo = getApp().getUser()
    if (!userInfo) {
      return
    }
    let res = await request.$isPost('/user/api/user/update', { username: userInfo.username, token: userInfo.token, houseId }, { show: true, text: '请稍后' }) 
    if (res.code === 0) {
      wx.setStorageSync('user', res.data)
      wx.showToast({
        title: '绑定成功',
        icon: 'success',
        image: '',
        duration: 2000,
        mask: true,
        success: function() {
          setTimeout(() => {
            wx.navigateBack()
          },2000)
        },
      })
    }else{
      wx.showToast({
        title: res.msg,
        mask: true,
        icon: 'none'
      })
    }  
  },
  async getStreet(districtId) {
    var _this = this
    let res = await request.$isPost('/community/api/community/getStreetList', { districtId}, { show: false}) 
    if (res.code === 0) {
      _this.setData({
        streetArry: res.data
      })
    }else{
      wx.showToast({
        title: res.msg || res.message,
        mask: true,
        icon:'none'
      })
    }
  },
  async getListByStreet (streetId) {
    var _this = this
    let res = await request.$isPost('/community/api/community/getListByStreet', { streetId }, { show: false })
    if (res.code === 0) {
      _this.setData({
        communityArry: res.data
      })
    } else {
      wx.showToast({
        title: res.msg || res.message,
        mask: true,
        icon: 'none'
      })
    }
  },
  async getDetail(communityId) {
    var _this = this
    let res = await request.$isPost('/user/api/house/getList', { communityId }, { show: false })
    if (res.code === 0) {
      _this.setData({
        houseDetail: res.data,
      })
    } else {
      wx.showToast({
        title: res.msg || res.message,
        mask: true,
        icon: 'none'
      })
    }
  },
  async getDetail2(communityId, building) {
    var _this = this
    let res = await request.$isPost('/user/api/house/getChildList', { communityId, building }, { show: true, text: '' })
    if (res.code === 0) {
      _this.setData({
        unitArry: res.data,
      })
    } else {
      wx.showToast({
        title: res.msg || res.message,
        mask: true,
        icon: 'none'
      })
    }
  }, 
  async getDetail3(communityId, building, unit) {
    var _this = this
    let res = await request.$isPost('/user/api/house/getChildList', { communityId, building, unit }, { show: true, text: '' })
    if (res.code === 0) {
      _this.setData({
        houseArry: res.data,
      })
    } else {
      wx.showToast({
        title: res.msg || res.message,
        mask: true,
        icon: 'none'
      })
    }
  }
})