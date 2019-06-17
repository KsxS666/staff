<!-- 设备地址 -->
<template>
  <div class="wrap" v-loading="mainLoading">
    <!--<el-input id="keyword"></el-input>-->
    <div class="el-input el-input--small" style="margin-bottom: 20px">
      <input type="text" v-model="address" autocomplete="off" placeholder="请输入地址搜索" id="keyword" class="el-input__inner">
    </div>
    <!--<input type="text"  id="keyword">-->
    <div class="mapBox" id="mapBox"></div>
  </div>
</template>

<script>
export default {
  name: 'mapPosition',
  props: {
    initAddress: { // 初始地址文案
      type: String,
      default: ''
    },
    lng: { // 初始地址经度
      type: Number,
      default: null
    },
    lat: { // 初始地址纬度
      type: Number,
      default: null
    }
  },
  data () {
    return {
      mainLoading: false,
      address: '',
      mapObj: null, // 地图对象
      autocomplete: null, // 输入的对象
      // placeSearchObj: null,
      marker: null
    }
  },
  mounted () {
    this.mapInit()
  },
  methods: {
    // 创建一个map
    mapInit () {
      this.mainLoading = true
      // eslint-disable-next-line no-undef
      this.mapObj = new AMap.Map('mapBox', {
        resizeEnable: true
      })
      // eslint-disable-next-line no-undef
      AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.Geocoder'
      ], () => {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        // eslint-disable-next-line no-undef
        this.mapObj.addControl(new AMap.ToolBar())

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        // eslint-disable-next-line no-undef
        this.mapObj.addControl(new AMap.Scale())

        // eslint-disable-next-line no-undef
        this.geocoder = new AMap.Geocoder({
          // city: cityCode, // 城市，默认：“全国”
          radius: 100 // 范围，默认：500
        })
        this.showBack()
      })
      // 地图图块加载完成后触发
      this.mapObj.on('complete', () => {
        // 同时引入工具条插件，比例尺插件
        this.placeSearch()
        this.setMapClick()
        this.mainLoading = false
      })
    },
    // input输入文本动态获得地址
    placeSearch () {
      // AMap.plugin(['AMap.Autocomplete', 'AMap.PlaceSearch'], () => {
      // eslint-disable-next-line no-undef
      AMap.plugin(['AMap.Autocomplete'], () => {
        // eslint-disable-next-line no-undef
        this.autocomplete = new AMap.Autocomplete({
          // city: '',
          citylimit: true,
          input: 'keyword'// 使用联想输入的input的id
        })
        // eslint-disable-next-line no-undef
        this.DistrictSearch = new AMap.DistrictSearch({
          subdistrict: 0, // 获取边界不需要返回下级行政区
          extensions: 'all' // 返回行政区边界坐标组等具体信息
        })
        // eslint-disable-next-line no-undef
        // this.placeSearchObj = new AMap.PlaceSearch({
        //   // city: '厦门',
        //   map: this.mapObj
        // })
        // 监听input 输入选择的地址
        // eslint-disable-next-line no-undef
        this.autocompleteListener = AMap.event.addListener(this.autocomplete, 'select', (e) => {
          console.log('修改了', e)
          this.address = `${e.poi.district} ${e.poi.address} ${e.poi.name}`
          let location = e.poi.location
          // 在地图上显示附近点
          // this.placeSearchObj.setCity(e.poi.adcode)
          // this.placeSearchObj.search(e.poi.name)
          if (location) {
            this.setMarker(location, this.address)
            return
          }
          // 搜索选择的 没有location信息的时候， 去查询获得市区中心点位置
          // eslint-disable-next-line no-undef
          this.DistrictSearch.search(e.poi.adcode, (status, result) => {
            console.log('status, result', status, result)
            if (result.info === 'OK' && result.districtList.length) {
              location = result.districtList[0].center
              this.setMarker(location, this.address, 8)
            }
          })
        })

        // 监听input 输入选择的地址 搜索附近点
        // eslint-disable-next-line no-undef
        // this.placeMarkerClickListener =AMap.event.addListener(this.placeSearchObj, 'markerClick', (e) => {
        //   console.log('开始啦啦啦啦啦', e)
        //   this.placeSearchObj && this.placeSearchObj.clear()
        //   this.$nextTick(() => {
        //     this.setMarker(e.data.location)
        //   })
        // })
      })
    },
    // 点击map 添加marker
    setMapClick () {
      // eslint-disable-next-line no-undef
      this.markClickListener && AMap.event.removeListener(this.markClickListener)
      // eslint-disable-next-line no-undef
      // this.InfoWindow = new AMap.InfoWindow({
      //   autoMove: true,
      //   anchor: 'top-center',
      //   content: ''
      // })
      // 监听地图是否点击了
      // eslint-disable-next-line no-undef
      this.markClickListener = AMap.event.addListener(this.mapObj, 'click', (e) => {
        // console.log('点击marker', e)
        // this.marker && this.mapObj.remove(this.marker)
        let position = e.lnglat
        // 获得点击的地址位置
        this.getPlace(position, (address) => {
          // console.log('marker地址位置', address)
          if (!address) {
            return
          }
          this.address = address
          this.setMarker(position, address)
        })
        // 搜索附近点
        // this.placeSearchObj.searchNearBy('', e.lnglat, 0, (status, res) => {
        //   console.log('开始searchNearBy', status, res)
        //   if (res && res.info === 'OK') {
        //     let obj = res.poiList && res.poiList.pois && res.poiList.pois.length ? res.poiList.pois[0] : null
        //     if (obj) {
        //       this.address = `${obj.pname} ${obj.cityname} ${obj.adname} ${obj.address} `
        //       position = obj.location
        //     }
        //   }
        //   this.setMarker(position)
        // })
      })
    },
    // 在地图上添加marker
    setMarker (position, address = '', zoom = 16) {
      // console.log('地图的wishi ', position)
      // 清楚之前的marker
      this.marker && this.mapObj.remove(this.marker)
      // eslint-disable-next-line no-undef
      this.marker = new AMap.Marker({
        // position: e.lnglat,
        position: position,
        topWhenClick: true, // 鼠标点击时marker是否置顶
        // content: '<img src="https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png" height="41" />',
        // anchor: 'bottom-center',
        // eslint-disable-next-line no-undef
        // offset: new AMap.Pixel(-13, -40),
        // icon: 'https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png',
        // bubble: true, // 是否将覆盖物的鼠标或touch等事件冒泡到地图上
        // draggable: true, // 设置点标记是否可拖拽移动
        // raiseOnDrag: true, // 设置拖拽点标记时是否开启点标记离开地图的效果
        // cursor: 'move', // 设置拖拽点标记时是否开启点标记离开地图的效果
        // animation: 'AMAP_ANIMATION_DROP',
        clickable: true,
        title: address,
        zIndex: 11000
      })
      // 监听 marker 移动
      // // eslint-disable-next-line no-undef
      // this.markerDragListener && AMap.event.removeListener(this.markerDragListener)
      // // eslint-disable-next-line no-undef
      // this.markerDragListener = AMap.event.addListener(this.marker, 'dragend', (e) => {
      //   console.log('移动的位置啦啦啦', e)
      //   this.getPlace(e.lnglat, (address) => {
      //     if (address) {
      //       this.address = address
      //       this.setMarker(e.lnglat, address)
      //     }
      //   })
      // })
      // // 监听 marker 点击事件
      // // eslint-disable-next-line no-undef
      // this.markerClickListener && AMap.event.removeListener(this.markerDragListener)
      // // eslint-disable-next-line no-undef
      // this.markerClickListener = AMap.event.addListener(this.marker, 'click', (e) => {
      //   // console.log('click的位置啦啦啦2222', e)
      // })
      // 在地图上添加marker
      this.mapObj.add(this.marker)
      // 设置地图显示的中心点
      // this.mapObj.setCenter(position)
      this.mapObj.setZoomAndCenter(zoom, position)
    },
    // 将经纬度转为地址
    getPlace (position, callback) {
      this.geocoder.getAddress(position, (status, result) => {
        // console.log('转地址啦啦啦', status, result)
        let address = null
        if (status === 'complete' && result.info === 'OK') {
          address = result.regeocode.formattedAddress
        }
        callback && callback(address)
      })
    },
    // 经纬度转中文地址
    getLngLat (address, callback) {
      this.geocoder.getLocation(address, (status, result) => {
        // console.log('中文地址', status, result)
        let position = null
        if (status === 'complete' && result.info === 'OK' && result.geocodes.length) {
          position = result.geocodes[0].location
        }
        callback && callback(position)
      })
    },
    // 回显之前选中的地址
    showBack () {
      if (!this.mapObj) return
      // 以前有地址的
      if (this.initAddress && this.lng && this.lat) {
        this.address = this.initAddress
        // let num = this.initLatLng.split(',')
        // console.log(num)
        // eslint-disable-next-line no-undef
        // this.setMarker([Number(num[0]), Number(num[1])], this.initAddress)
        this.setMarker([this.lng, this.lat], this.initAddress)
        return
      }
      // 有地址名称， 但是没有经纬度的
      if (this.initAddress && (!this.lng || !this.lat)) {
        this.getLngLat(this.initAddress, (position) => {
          if (!position) return
          this.address = this.initAddress
          this.setMarker(position, this.initAddress)
        })
        // return
      }
      // console.log('下面的情况不考虑')
    },
    // 获得选中的信息
    getChooseInfo () {
      if (!this.marker) return false
      if (!this.address) return false
      // let position = this.marker.getPosition()
      // console.log(position.lat)
      return {
        position: this.marker.getPosition(),
        address: this.address
      }
      // console.log('地址信息', this.marker.getPosition())
    }
  },
  beforeDestroy () {
    console.log('开始关闭beforeDestroy')
    // eslint-disable-next-line no-undef
    this.markClickListener && AMap.event.removeListener(this.markClickListener)
    // eslint-disable-next-line no-undef
    this.autocompleteListener && AMap.event.removeListener(this.autocompleteListener)
    // eslint-disable-next-line no-undef
    this.mapObj && this.mapObj.destroy()
  },
  watch: {
    initAddress () {
      // console.log('地址变化啦啦啦')
      this.showBack()
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .wrap{
    max-width: 800px;
    /*cursor: move;*/
  }
  .mapBox{
    width: 100%;
    height: 500px;
  }
</style>
