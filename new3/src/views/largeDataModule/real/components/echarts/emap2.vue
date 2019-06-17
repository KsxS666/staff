<!--设备位置地图-->
<template>
  <section id="emap" @click.stop.prevent="toggleSideBar"></section>
</template>

<script>
import 'echarts/map/js/china.js'
export default {
  name: 'emap',
  data () {
    return {
      dataList: [],
      chart: null
    }
  },
  created () {
    this.getList()
  },
  computed: {
    isShowMenu () {
      return this.$store.getters.isShowMenu
    }
  },
  mounted () {
    this.initChart()
    if (window) {
      window.addEventListener('resize', this._resizeHandler) // 监听窗口的变化
    }
    // this.autoInput()
  },
  methods: {
    // 切换侧边菜单栏状态
    toggleSideBar () {
      this.$store.dispatch('ChangeMenuStatus', false)
    },
    async getList () { // 获取设备位置信息 type:1 二分类机 type:2 积分兑换机
      let res = await this.$post('equipment/equipmentPosition/listByType', { type: 1 })
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data || []
    },
    autoInput () {
      var keywords = '福建省厦门市航空自贸广场'
      // eslint-disable-next-line no-undef
      AMap.plugin('AMap.Autocomplete', function () {
        // 实例化Autocomplete
        var autoOptions = {
          city: '全国'
        }
        // eslint-disable-next-line no-undef
        var autoComplete = new AMap.Autocomplete(autoOptions)
        autoComplete.search(keywords, function (status, result) {
          // 搜索成功时，result即是对应的匹配数据
        })
      })
    },
    // echarts初始化
    initChart () {
      this.chart = this.$charts.init(document.getElementById('emap'))
      this.chart.off('click')
      this.chart.on('click', params => {
        if (params.componentSubType === 'effectScatter') {
          console.log(params)
          this.$router.push({
            path: 'large/gmap',
            query: {
              value: JSON.stringify(params.data.value)
            }
          })
        }
      })
      this.$nextTick(() => {
        this.setMapChartOptions()
      })
    },
    setMapChartOptions () { // 配置地图及位置信息
      let mapData = this.dataList
      for (let item of mapData) {
        let value = []
        if (!item.totalWeight) {
          item.totalWeight = 0
        }
        value.push(item.longitude, item.dimensionality)
        item.value = value
      }
      let option = {
        tooltip: {
          trigger: 'item',
          formatter: function (data) {
            return '设备名称：' + data.data.equipmentName + '<br/>' + '设备编号：' + data.data.equipmentCode + '<br/>' + '当前重量：' + data.data.totalWeight
          },
          showContent: true,
          textStyle: {
            color: '#06E5F9',
            fontSize: '14',
            fontWeight: 'bold'
          }
        },
        geo: {
          map: 'china',
          top: '18%',
          bottom: '4%',
          left: '27%',
          right: '27%',
          label: {
            emphasis: {
              show: false
            }
          },
          roam: true,
          scaleLimit: {
            min: 1
          },
          itemStyle: {
            normal: {
              areaColor: '#154F9A', // 地图默认的背景颜色
              borderColor: '#0C89CB', // 地图默认的边线颜色,
              borderType: 'solid',
              borderWidth: 1.5
            },
            emphasis: {
              areaColor: '#1A62B4' // 地图触发地区的背景颜色
            }
          },
          regions: [
            {
              name: '南海诸岛', // 忽略地图某部分
              itemStyle: { normal: { opacity: 0 }, label: { show: false } }
            }
          ]
        },

        series: [
          {
            name: '设备位置',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: mapData,
            symbolSize: '20',
            showEffectOn: 'render',
            rippleEffect: {
              brushType: 'stroke',
              period: 4
            },
            label: {
              normal: {
                // formatter: '{b}',
                position: 'right',
                show: false
              },
              emphasis: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: '#06ebff'
              }
            }
          }
        ]
      }
      this.chart.setOption(option)
    },
    _resizeHandler () {
      if (this.chart) {
        setTimeout(() => {
          this.chart.resize()
        }, 200)
      }
    }
  },
  watch: {
    dataList: {
      deep: true,
      handler (val) {
        this.setMapChartOptions(val)
      }
    }
  },
  beforeDestroy () {
    window.removeEventListener('resize', this._resizeHandler) // 监听窗口的变化
  }
}
</script>
<style lang="scss" scoped>
  #emap{
    position: absolute;
    left: 0;
    top: calc(10% + 20px);
    bottom: 0;
    right: 0;
    min-width: 800px;
    min-height: 573px;
  }
</style>
