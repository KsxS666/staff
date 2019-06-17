<template>
  <div id="gmap"></div>
</template>

<script>
export default {
  data () {
    return {
      map: null,
      geocoder: null,
      infoWindow: null,
      dataList: []
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    // eslint-disable-next-line no-undef
    this.gmapInit() // 地图初始化（同步）
    this.pluginInit() // 地理逆编码插件初始化（同步）
    this.regeocoder(0, this.value) // 参数0：通过首页地图点击进来的位置信息，参数1：本页面鼠标滑过的当前位置信息
    this.infoWindowInit() // 信息窗体初始化
  },
  methods: {
    async getList () { // 获取设备位置信息列表
      let res = await this.$post('equipment/equipmentPosition/listByType', { type: 1 })
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data || []
    },
    gmapInit () {
      // eslint-disable-next-line no-undef
      if (!AMap) {
        this.$message.error('地图资源加载失败，请检查网络设置！')
        return
      }
      // eslint-disable-next-line no-undef
      this.map = new AMap.Map('gmap', { // 地图初始化
        center: this.value,
        zoom: 10, // 缩放级别
        resizeEnable: true,
        // mapStyle: 'amap://styles/9205723470fe74f38591b6e7855d03cf',
        cursor: 'default'
      })
      this.map.setMapStyle('amap://styles/9205723470fe74f38591b6e7855d03cf')
    },
    pluginInit () {
      // eslint-disable-next-line no-undef
      this.geocoder = new AMap.Geocoder({
        radius: 1000,
        extensions: 'all'
      })
    },
    setMarker () {
      this.dataList.map((a, b, c) => {
        // eslint-disable-next-line no-undef
        var marker = new AMap.Marker({
          position: (`${a.longitude},${a.dimensionality}`).toString().split(','),
          map: this.map
        })
        marker.on('mouseover', this.markerHover)
        marker.on('mouseout', this.markerLeave)
      })
    },
    regeocoder (type, data) { // 逆地理编码：坐标->具体位置
      let me = this
      this.geocoder.getAddress(data, function (status, result) {
        if (status === 'complete' && result.regeocode) {
          if (type === 0) {
            me.$message({
              message: result.regeocode.formattedAddress
            })
          } else {
            me.infoWindow.setContent(result.regeocode.formattedAddress)
          }
        } else {
          alert(JSON.stringify(result))
        }
      })
    },
    infoWindowInit () {
      // eslint-disable-next-line no-undef
      this.infoWindow = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -30), isCustom: false, autoMove: true, closeWhenClickMap: true, showShadow: true })
    },
    markerHover (e) {
      this.regeocoder(1, e.target.getPosition())
      this.infoWindow.open(this.map, e.target.getPosition())
    },
    markerLeave () {
      this.infoWindow.close()
    }
  },
  computed: {
    value () {
      return JSON.parse(this.$route.query.value)
    }
  },
  watch: {
    dataList: {
      deep: true,
      handler (val) {
        this.setMarker(val)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  #gmap{
    width: 100vw;
    height: 100vh;
  }
</style>
