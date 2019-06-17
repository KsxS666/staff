<template>
  <div class="box">
    <div id="mapBox" v-loading='mainLoading'>
      <div class="info" v-show="!isShowFull">
        <div class="input-item">
          <div class="input-item-prepend">
            <span class="input-item-text" style="width:8rem;">请输入关键字</span>
          </div>
          <input id='tipinput' type="text" v-model="tipInput">
        </div>
        <!--<el-button style="margin-left: 10px" size="mini" @click="isShowFull = !isShowFull">{{ isShowFull ? '退出' : '全屏' }}</el-button>-->
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'mapEquipment',
  props: {
    castTypeList: {
      type: Object,
      default: () => {}
    },
    areaName: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      isShowFull: false,
      mainLoading: false,
      mapObj: null,
      geocoder: null,
      auto: null,
      autocompleteListener: null,
      markers: [],
      address: '',
      tipInput: '',
      position: []
    }
  },
  created () {
    // this.getCastTypeList()
  },
  mounted () {
    this.mapInit()
  },
  methods: {
    mapInit () {
      this.mainLoading = true
      // eslint-disable-next-line no-undef
      this.mapObj = new AMap.Map('mapBox', {
        resizeEnable: true,
        zoom: 16
      })
      // eslint-disable-next-line no-undef
      AMap.plugin([
        'AMap.ToolBar',
        'AMap.Scale',
        'AMap.Geocoder',
        'Amap.AutoComplete'
      ], () => {
        // 在图面添加工具条控件，工具条控件集成了缩放、平移、定位等功能按钮在内的组合控件
        // eslint-disable-next-line no-undef
        this.mapObj.addControl(new AMap.ToolBar())

        // 在图面添加比例尺控件，展示地图在当前层级和纬度下的比例尺
        // eslint-disable-next-line no-undef
        this.mapObj.addControl(new AMap.Scale())

        // eslint-disable-next-line no-undef
      })
      this.mapObj.on('complete', () => {
        // 同时引入工具条插件，比例尺插件
        // this.placeSearch()
        // this.setMapClick()
        this.mainLoading = false
        // eslint-disable-next-line no-undef
        this.auto = new AMap.Autocomplete({
          city: '全国',
          input: 'tipinput'
        })
        // eslint-disable-next-line no-undef
        this.DistrictSearch = new AMap.DistrictSearch({
          subdistrict: 0, // 获取边界不需要返回下级行政区
          extensions: 'all' // 返回行政区边界坐标组等具体信息
        })
        // eslint-disable-next-line no-undef
        this.autocompleteListener = AMap.event.addListener(this.auto, 'select', (e) => {
          console.log('修改了222', e)
          // this.mapObj.setZoomAndCenter(10, [e.poi.location.lng, e.poi.location.lat])
          // this.mapObj.setZoomAndCenter(10, e.poi.location)
          let location = e.poi.location
          if (location) {
            this.mapObj.setZoomAndCenter(10, location)
            return
          }
          // 搜索选择的 没有location信息的时候， 去查询获得市区中心点位置
          // eslint-disable-next-line no-undef
          this.DistrictSearch.search(e.poi.adcode, (status, result) => {
            if (result.info === 'OK' && result.districtList.length) {
              location = result.districtList[0].center
              this.mapObj.setZoomAndCenter(10, location)
              // this.setMarker(location, this.address, 8)
            }
          })
        })
      })
      // eslint-disable-next-line no-undef
      this.geocoder = new AMap.Geocoder({
        // city: cityCode, // 城市，默认：“全国”
        radius: 100 // 范围，默认：500
      })
    },
    setMarker (equipmentArr = []) {
      if (!this.mapObj) return
      this.mapObj.remove(this.markers)
      if (!equipmentArr.length) {
        this.$message.error('该地区暂无设备！')
        this.geocoder.getLocation(this.areaName, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            // result中对应详细地理坐标信息
            this.mapObj.setZoomAndCenter(6, [result.geocodes[0].location.lng, result.geocodes[0].location.lat])
          }
        })
      }
      equipmentArr.map(ele => {
        // eslint-disable-next-line no-undef
        let markers = new AMap.Marker({
          map: this.mapObj,
          position: [ele.longitude, ele.dimensionality],
          title: `地址：${ele.communityAddress}，设备编码：${ele.equipmentCode}`,
          // eslint-disable-next-line no-undef
          offset: new AMap.Pixel(-13, -30)
        })
        this.markers.push(markers)
      })
      this.mapObj.setFitView()
    }
  },
  beforeDestroy () {
    // eslint-disable-next-line no-undef
    this.autocompleteListener && AMap.event.removeListener(this.autocompleteListener)
    this.mapObj && this.mapObj.destroy()
  },
  watch: {
    castTypeList: {
      deep: true,
      handler (val) {
        this.setMarker(val.equipmentList)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .box{
    flex: 1;
    .fullBtn{
      position: absolute;
      right: 0;
      z-index: 1;
    }
    #mapBox{
      width: 100%;
      height: 100%;
    }
    &.showFull{
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1100;
      height: 100vh;
      width: 100vw;
    }
    .info{
      z-index: 1;
      padding: .60rem .90rem;
      margin-bottom: 1rem;
      border-radius: .25rem;
      position: absolute;
      top: 40px;
      background-color: white;
      width: auto;
      border-width: 0;
      right: 20px;
      box-shadow: 0 2px 6px 0 rgba(114, 124, 245, .5);
      display: flex;
      .input-item{
        display: flex;
        border: 1px solid #e5e5e5;
        height: 2rem;
        align-items: center;
        .input-item-prepend {
          height: 100%;
          background: #f1f2f3;
          line-height: 2rem;
          padding: 0 8px;
        }
        // .input-item-text{
        // }
        input{
          height: 100%;
          outline: 0;
          border: 0;
          margin-left: 5px;
        }
      }
    }
  }
</style>
