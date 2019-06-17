// pages/make/make.js
var dateTimePicker = require('../../utils/dateTimePicker.js')
import regeneratorRuntime from '../../utils/regenerator-runtime'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    index: "",
    casList: [], 
    casArray: [], // 垃圾类型选择器
    dateTime: "",
    dateTimeArray: [], // 时间范围选择器
    time: "",
    startYear: 2018,
    endYear: 2050,
    imgArry: [],
    userName: "",
    phone: "",
    address: "",
    typeCodeId: "",
    isNew: true,
    estimate: 0,
    isMask: false,
    isOption: false,
    timeRangeAry: [],
    timeRangeList: [],
    optionalDate: '',
    optionalTime: '',
    recyCartAry: [],
    levelAry1: [],
    levelAry2: [],
    levelAry3: [],
    levelIndex1: 0,
    levelIndex2: 0,
    levelIndex3:0,
    typeNote: '',
    expectIntegral: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var _this = this
    const userInfo = getApp().getUser()
    if (!userInfo) {
      return
    }
    _this.setData({
      userName: userInfo.name,
      phone: userInfo.phone,
      address: userInfo.house ? userInfo.house.provinceName + userInfo.house.cityName + userInfo.house.districtName + userInfo.house.streetName + userInfo.house.communityName + userInfo.house.address : ""
    })

    /**
     * 获取预约时间段
     */
    _this.getAppointmentTime()
    _this.getTypeAndRule()
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
  preventTouchMove(){},
  /**
   * 获取预约时间段
   */
  getAppointmentTime: function(e){
    var _this = this
    wx.showLoading({
      title: '',
      mask: true,
      icon:'none'
    })
    wx.request({
      url: getApp().data.baseUrl + '/system/api/keyValue/getAppointmentTime',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      method: 'POST',
      success: ((res) => {
        wx.hideLoading()
        if (res.data.code === 0) {
          let timeRange = res.data.data.map(ele => {
            let date = new Date()
            date.setHours(ele.startHour)
            date.setMinutes(ele.startMinute)
            ele.timestamp1 = date.getTime()
            date.setHours(ele.endHour)
            date.setMinutes(ele.endMinute)
            ele.timestamp2 = date.getTime()
            return Object.assign({}, {
              label: `${ele.startHour}:${ele.startMinute} - ${ele.endHour}:${ele.endMinute}`,
              value: `${ele.startHour}:${ele.startMinute} - ${ele.endHour}:${ele.endMinute}`
            }, ele)
          })
          console.log(timeRange)
        let todayTimes = _this.getTimes(timeRange) //去掉当前时间不在规定时间段的单条时间段
        let dayNum = [0,1,2,3,4,5,6]
          if (!todayTimes.length) { //今天不可选，不包含今天，后7天按明天开始算
          dayNum = [1,2,3,4,5,6,7]
         }
         let list = dayNum.map(ele => {
           let date = new Date()
           date.setDate(date.getDate() + ele)
           let transDateStamp = new Date(date.getTime())
            return {
              label: `${transDateStamp.getFullYear()}-${(transDateStamp.getMonth() + 1) < 10 ? '0' + (transDateStamp.getMonth() + 1) : transDateStamp.getMonth() + 1}-${(transDateStamp.getDate()) < 10 ? '0' + (transDateStamp.getDate()) : transDateStamp.getDate() }`,
              value: `${transDateStamp.getFullYear()}/${(transDateStamp.getMonth() + 1) < 10 ? '0' + (transDateStamp.getMonth() + 1) : transDateStamp.getMonth() + 1}/${(transDateStamp.getDate()) < 10 ? '0' + (transDateStamp.getDate()) : transDateStamp.getDate()}`,
              children: ele === 0 ? todayTimes : timeRange
            }
         })
          _this.setData({
            timeRangeAry: [list, list[0].children],
            timeRangeList: list,
          }, () => {
            _this.setData({
              optionalDate: _this.data.timeRangeAry[0][0].label,
              optionalTime: _this.data.timeRangeAry[1][0].label,
              paramTime: `${_this.data.timeRangeAry[0][0].value} ${_this.data.timeRangeAry[1][0].value}`,              
            })
          })
        }else{
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })  
        }
      }),
      fail: (() => {
        wx.showToast({
          title: '服务器连接失败！',
          icon: 'none',
          duration: 2000
        })
      })
    })
  },
  // 获取回收类型
  getTypeAndRule() {
    var _this = this
    const userInfo = getApp().getUser()
    if (!userInfo) {
      return
    }
    wx.request({
      url: getApp().data.baseUrl + '/integral/api/reclaimType/getTypeAndRule',
      header: {
        'content-type': 'application/x-www-form-urlencoded' // 默认值
      },
      data: { token: userInfo.token, username: userInfo.username},
      method: 'POST',
      success: ((res) => {
        if (res.data.code === 0) {
          _this.setData({
            levelAry1: res.data.data,
            levelAry2: res.data.data[_this.data.levelIndex1].children,
            levelAry3: res.data.data[_this.data.levelIndex1].children[0].children,     
            estimate: res.data.data[_this.data.levelIndex1].children[0].children[0].typeValue           
          })
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
            duration: 2000
          }) 
        }
      }),
      fail: (() => {
        wx.showToast({
          title: '服务器连接失败！',
          icon: 'none',
          duration: 2000
        })
      })
    })
  },
  toShowRecyOption() {
    var _this= this
    if (!_this.data.levelAry1.length) {
      wx.showToast({
        title: '暂无数据',
        mask: true,
        icon: 'none'
      })
      return 
    }
    _this.setData({
      isMask: true,
      isOption: true
    })
  },
  toHideRecyOption() {
    var _this = this
    _this.setData({
      isMask: false,
      isOption: false
    }) 
  },
  toShowSpec(e){
    var _this = this
    _this.setData({
      levelIndex2: e.currentTarget.dataset.index,
      levelAry3: _this.data.levelAry2[e.currentTarget.dataset.index].children,
      estimate: _this.data.levelAry2[e.currentTarget.dataset.index].children[_this.data.levelIndex3].typeValue
    })
  },
  specSwitch(e) {
    var _this= this
    _this.setData({
      levelIndex3: e.currentTarget.dataset.index,
      estimate: _this.data.levelAry3[e.currentTarget.dataset.index].typeValue
    })
  },
  typeSwitch(e) {
    var _this= this
    _this.setData({
      levelIndex1: e.currentTarget.dataset.index,
      levelIndex2: 0,
      levelIndex3:0,
      levelAry2: _this.data.levelAry1[e.currentTarget.dataset.index].children,
      levelAry3: _this.data.levelAry1[e.currentTarget.dataset.index].children[0].children,
      estimate:  _this.data.levelAry1[e.currentTarget.dataset.index].children[0].children[0].typeValue
    })
  },
  // 添加至预约列表
  addToList() {
    var _this = this
    let expectIntegral = _this.data.expectIntegral
    const levelAry1 = _this.data.levelAry1
    const levelAry2 = _this.data.levelAry2
    const levelAry3 = _this.data.levelAry3
    const levelIndex1 = _this.data.levelIndex1
    const levelIndex2 = _this.data.levelIndex2
    const levelIndex3 = _this.data.levelIndex3
    let recyCartAry = _this.data.recyCartAry
    let obj = {}
    obj['first'] = levelAry2[levelIndex2]
    obj['second'] = levelAry3[levelIndex3]
    expectIntegral += levelAry3[levelIndex3].typeValue
    recyCartAry.push(obj)
    _this.setData({ recyCartAry, isMask: false, isOption: false, expectIntegral})
  },
  // 删除单条清单
  reduce(e) {
    var _this = this
    let recyCartAry = _this.data.recyCartAry
    let expectIntegral = 0
    console.log('6666', recyCartAry)
    recyCartAry.splice(e.currentTarget.dataset.index,1)
    recyCartAry.map((ele) => {
      expectIntegral += ele['second'].typeValue
    })
    _this.setData({
      recyCartAry,
      expectIntegral
    })
  },
  // textarea提交
  textAreaInput(e) {
    var _this = this
    _this.setData({
      typeNote: e.detail.value
    })
  },
  // 继续添加
  goon() {
    var _this = this
    _this.setData({
      isMask: true,
      isOption: true,
      levelIndex1: 0,
      levelIndex2: 0,
      levelIndex3: 0,
      levelAry2: _this.data.levelAry1[0].children,
      levelAry3: _this.data.levelAry1[0].children[0].children,
      estimate: _this.data.levelAry1[0].children[0].children[0].typeValue
    })
  },
  sure() {
    var _this= this
    let recyCartAry = _this.data.recyCartAry
    let appointmentTime = _this.data.paramTime
    let billsAry = []
    recyCartAry.map(ele => {
      let obj = { integral: `${ele.second.typeValue}`, weight: `${ele.second.weight || 0}`}
      if (ele.first.typeRule) { // 0:按重量 1:按数量
        obj.typeId = ele.second.typeId
        obj.typeName = `${ele.second.typeName}(x1)`
        obj.topTitle = ele.second.typeName
      }else{
        obj.typeId = ele.second.typeId
        obj.typeName = `${ele.first.typeName}(${ele.second.typeName})`
        obj.topTitle = ele.first.typeName        
      }
      billsAry.push(obj)
    })
    let title = billsAry.length > 1 ? `${billsAry[0].topTitle}...等${billsAry.length}个品类回收` : `${billsAry[0].topTitle}`
    let reqData = {
      bills: JSON.stringify(billsAry),
      appointmentTime,
      title,
      typeNote: _this.data.typeNote
    }
    wx.getStorage({
      key: 'user',
      success: function(res) {
        wx.showLoading({
          title: '预约中...',
          mask: true,
          icon: 'none'
        })
        let reqData2 = Object.assign(reqData, {username:res.data.username, token: res.data.token})
        wx.request({
          url: getApp().data.baseUrl + '/integral/api/appointment/addAppointment',
          header: {
            'content-type': 'application/x-www-form-urlencoded' // 默认值
          },
          data: reqData2,
          method: 'POST',
          success: ((ress) => {
            if (ress.data.code === 0) {
              wx.hideLoading()
              _this.setData({
                recyCartAry: [],
                estimate: _this.data.levelAry1[0].children[0].children[0].typeValue,
                expectIntegral: 0,
                levelIndex3: 0                  
              })
              wx.showModal({
                title: '预约成功！',
                content: '爱家管理员会在2小时内上门回收！',
                confirmText: '查看预约',
                success: (resss) => {
                  
                  if (resss.confirm) {
                    wx.redirectTo({
                      url: '/pages/makeDetails/makeDetails?id=' + ress.data.data.id+'',
                    })
                  }
                }
              })
            }
          }),
          fail: (() => {
            wx.showToast({
              title: '服务器连接失败！',
              icon: 'none',
              duration: 2000
            })
          })
        })
      },
    })
  },
  // 过滤时间段
  getTimes(timeRange) {
    if (!timeRange || !timeRange.length) {
      return []
    }
    let timeRangeList = JSON.parse(JSON.stringify(timeRange))
    let max = timeRangeList.length
    let nowDate = new Date()
    let now = nowDate.getTime()
    for (let i = 0; i < timeRangeList.length; i++) {
      if (now < timeRangeList[i].timestamp2) {
        // return timeRangeList
        if (i > 0) timeRangeList.splice(0, i)
        return timeRangeList
      }
      // else{
      //   return timeRangeList.splice(i - 1, 1)
      // }
    }
    return []
  },
  bindcolumnchange(e) {
    var _this = this
    console.log(e)
    if (e.detail.column === 0) {
      let list = []
      list.push(this.data.timeRangeList)
      list.push(this.data.timeRangeList[e.detail.value].children)
      console.log(e.detail, list)
  
      this.setData({
        timeRangeAry: list,
      })
    }
    
  },
  /**
   * picker组件选中事件
   */
  setTime(e) {
    var _this = this
    _this.setData({
      optionalDate: _this.data.timeRangeAry[0][e.detail.value[0]].label,
      optionalTime: _this.data.timeRangeAry[1][e.detail.value[1]].label,  
      paramTime: `${_this.data.timeRangeAry[0][e.detail.value[0]].value} ${_this.data.timeRangeAry[1][e.detail.value[1]].label}`
    })
  }
})