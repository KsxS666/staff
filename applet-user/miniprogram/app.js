//app.js
App({
  data: {
    // baseUrl: "https://backend.ajhbw.cn",
    // baseUrl: "http://172.16.21.132:10000",
    baseUrl: "https://backend.ajhbw.cn",    
    codeId: "",
    encryptedData: "",
    iv: "",
    houseId: "",
    phone: "",
    password: "",
    userInfo: {},
    addres: "",
  },
  onLaunch: function() {
    // this.globalData = {}
  },
  getUser() {
    let userInfo = wx.getStorageSync('user')
    if (!userInfo) {
      wx.showToast({
        title: '登录信息已过期',
        mask: true,
        icon: 'none',
        duration: 2000,
        success() {
          wx.clearStorage()
          wx.reLaunch({
            url: '/pages/login/login',
          })
        }
      })
    }else{
      return userInfo
    }
  },
  authSet() {
    wx.authorize({
      scope: 'scope.userLocation',
      success (res){
        console.log('wx.getLocation', res)
      },
      fail (err) {
        console.log('wx.getLocation err', err)
        wx.showModal({
          title: '请求授权当前位置',
          content: '需要获取您的地理位置，请确认授权',
          showCancel: true,
          success(res) {
            if (res.confirm) {
              wx.openSetting({
                success: function (res) {
                  console.log(' wx.openSetting success', res)
                  if (res.authSetting["scope.userLocation"] == true) {
                    wx.showToast({
                      title: '授权成功',
                      icon: 'success',
                      duration: 1000
                    })
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none',
                      duration: 1000
                    })                  
                  }
                },
                complete(res) {
                  console.log(' wx.openSetting complete', res)
                }
              })
            }
          }
        })
      }
    })
    // wx.getLocation({
    //   success: function (res) {},
    //   fail(){
    //     wx.showModal({
    //       title: '请求授权当前位置',
    //       content: '需要获取您的地理位置，请确认授权',
    //       showCancel: true,
    //       success(res) {
    //         if (res.confirm) {
    //           wx.openSetting({
    //             success: function (res) {
    //               console.log(' wx.openSetting success', res)
    //               if (res.authSetting["scope.userLocation"] == true) {
    //                 wx.showToast({
    //                   title: '授权成功',
    //                   icon: 'success',
    //                   duration: 1000
    //                 })
    //                 //再次授权，调用wx.getLocation的API
    //                 _this.geo();
    //               } else {
    //                 wx.showToast({
    //                   title: '授权失败',
    //                   icon: 'none',
    //                   duration: 1000
    //                 })
    //               }
    //             },
    //             complete (res) {
    //               console.log(' wx.openSetting complete', res)
    //             }
    //           })
    //         }
    //       }
    //     })
    //   }
    // })
  },
  interceptUser: function() {
    var _this = this;
    // wx.getStorage({
    //   key: 'userInfoData',
    //   success: function(res) {
    //     _this.data.userInfo = res.data;
    //   },
    //   fail: function(res) {
    //     wx.redirectTo({
    //       url: '/pages/login/login'
    //     })
    //   }
    // })
  }

})