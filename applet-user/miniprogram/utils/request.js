var baseUrl = 'https://backend.ajhbw.cn'
var header = {
  'Accept': 'application/json',
  'content-type': 'application/json',
  'Authorization': null,
}
 function isPost(url, data, isLoading) {

   return new Promise((resolve, rej) => {
     if (isLoading.show) {
       wx.showLoading({
         title: isLoading.text,
         mask: true,
         icon: 'none'
       })
     }
     wx.request({

       url: baseUrl + url,
       header: {
         'content-type': 'application/x-www-form-urlencoded' // 默认值
       },
       data: data,
       method: 'POST',
       success: ((res) => {
         console.log('成功')
         console.log(res.data)
         wx.hideLoading()
         if (res.data.code === 100) {
           wx.showModal({
             title: '',
             content: res.data.msg,
             showCancel: false,
             success(ress) {
               if (ress.confirm) {
                 wx.removeStorage({
                   key: 'user',
                   success: function (res) {
                     wx.reLaunch({
                       url: '/pages/login/login',
                     })
                   },
                 })
               }
             }
           })
           return
         } else {
           return resolve(res.data)
         }
       }),
       fail: (() => {
         wx.hideLoading()
         wx.showToast({
           title: '服务器连接失败！',
           icon: 'none',
           duration: 2000
         })
         return resolve({
           code: 1,
           msg: '服务器连接失败！'
         })
       })
     });
   });

  // wx.request({
  //   url: baseUrl + url,
  //   header: {
  //     'content-type': 'application/x-www-form-urlencoded' // 默认值
  //   },
  //   data: data,
  //   method: 'POST',
  //   success: ((res) => {
  //     console.log('成功')
  //     wx.hideLoading()
  //     if (res.data.code === -100) {
  //       wx.showToast({
  //         title: '账号信息已过期',
  //         mask: true,
  //         icon: 'error'
  //       })
  //       return 111
  //     }else{
  //       return res
  //     }
  //   }),
  //   fail: (() => {
  //     wx.hideLoading()
  //     wx.showToast({
  //       title: '服务器连接失败！',
  //       icon: 'none',
  //       duration: 2000
  //     })
  //   })
  // })
}
module.exports = {
  $isPost: isPost
}