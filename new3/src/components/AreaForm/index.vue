<!-- 省市区街道 表单的提交 -->
<template>
    <div class="wrap" ref="wrap" v-if="show">
      <el-form-item v-if="level >=1" ref="item" label="省" prop="provinceId">
        <el-select filterable clearable v-model="formDataObj.provinceObj" value-key="id" @change="getAreaList(2)">
          <el-option v-for="(item, i) in provinceList" :key="i" :label="item.name" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="level >=2" ref="item" label="市" prop="cityId">
        <el-select filterable clearable v-model="formDataObj.cityObj" value-key="id" @change="getAreaList(3)">
          <el-option v-for="(item, i) in cityList" :key="i" :label="item.name" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="level >=3" ref="item" label="区" prop="districtId">
        <el-select filterable clearable v-model="formDataObj.districtObj" value-key="id" @change="getAreaList(4)">
          <el-option v-for="(item, i) in districtList" :key="i" :label="item.name" :value="item"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="level >=4" ref="item" label="街道" prop="streetId">
        <el-select filterable clearable v-model="formDataObj.streetObj" value-key="id" @change="getAreaList(5)">
          <el-option v-for="(item, i) in streetList" :key="i" :label="item.name" :value="item"> </el-option>
        </el-select>
      </el-form-item>
    </div>
</template>

<script>
export default {
  name: 'AreaForm',
  props: {
    value: Boolean, // 是否显示 -- > 监听表单的变化
    level: { // 显示几级的省市区数据 默认 4级
      type: Number,
      default: 4
    },
    formData: { // 请求的参数  返回省市区的数据
      type: Object,
      default: () => {}
    },
    showName: { // 请求数据是否 要有name
      type: Boolean,
      default: false
    },
    getSelectObj: { // 获得 全部的obj 字段
      type: Function,
      default: null
    },
    show: { // 显示 影藏
      type: Boolean,
      default: true
    },
    isCommunity: { // 省市区的列表 是否是 只有有小区地方的的省市区
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      formDataObj: {
        provinceObj: {},
        cityObj: {},
        districtObj: {},
        streetObj: {}
      },
      provinceList: [], // 省 列表
      cityList: [], // 市 列表
      districtList: [], // 区 列表
      streetList: [] // 街道 列表
    }
  },
  mounted () {
    this.toShowOldChoose()
  },
  computed: {
    areaList () {
      return this.$store.getters.areaList
    }
  },
  methods: {
    // 获取省市区街道的列表 有变化的时候
    async getAreaList (level, isShow) { // isShow  是否是 回显的
      let parentId = ''
      let listName = 'provinceList'
      // 判断是要获得哪一级的数据
      switch (level) {
        case 1:
          if (!isShow) {
            this.formDataObj.cityObj = {}
            this.formDataObj.districtObj = {}
            this.formDataObj.streetObj = {}
          }
          this.cityList = []
          this.districtList = []
          this.streetList = []
          break
        case 2:
          listName = 'cityList'
          parentId = this.formDataObj.provinceObj.id
          if (!isShow) {
            this.formDataObj.cityObj = {}
            this.formDataObj.districtObj = {}
            this.formDataObj.streetObj = {}
          }
          this.cityList = []
          this.districtList = []
          this.streetList = []
          break
        case 3:
          listName = 'districtList'
          parentId = this.formDataObj.cityObj.id
          if (!isShow) {
            this.formDataObj.districtObj = {}
            this.formDataObj.streetObj = {}
          }
          this.districtList = []
          this.streetList = []
          break
        case 4:
          listName = 'streetList'
          parentId = this.formDataObj.districtObj.id
          if (!isShow) {
            this.formDataObj.streetObj = {}
          }
          this.streetList = []
          break
      }
      this.hasChange(isShow, level)
      // 当 要修改的 层级 已经大于 最多显示层级时 就不加载了
      if (level > this.level) return
      // 如果已经加载过 省的数据 就不用再加载
      if (listName === 'provinceList' && this.provinceList.length) return
      // 选项是清空的
      if (level > 1 && (!parentId || parentId === '')) return

      // 省市区的列表 是否是 只有有小区地方的的省市区
      let url = this.isCommunity ? 'community/community/getAreaList' : 'system/area/getList'

      let res = await this.$post(url, { parentId: parentId, level: level })
      if (res.code === 0) {
        this[listName] = res.data
        /* this[listName] = res.data.map(item => {
          return {
            id: item.id,
            name: item.name,
            level: item.level
          }
        }) */
      }
    },
    // 从store里面取数据 方法-- 暂时弃用
    toGetAreaList (level) {
      if (!this.areaList.length) {
        return {
          status: false,
          province: null
        }
      }
      if (level === 1) { // 要加载 省
        this.provinceList = this.areaList
        return {
          status: true
        }
      }
      let provinceIndex = this.areaList.findIndex(item => {
        return item.id === this.formDataObj.provinceObj.id
      })
      let provinceObj = provinceIndex !== -1 ? this.areaList[provinceIndex] : null
      if (!provinceObj || !provinceObj.children) {
        return {
          status: false,
          province: provinceIndex + 1
        }
      }
      if (level === 2) { // 要加载 市
        this.cityList = provinceObj.children
        return {
          status: true
        }
      }
      let cityObj = provinceObj.children.find(item => {
        return item.id === this.formDataObj.cityObj.id
      })
      if (!cityObj || !cityObj.children) {
        return false
      }
      if (level === 3) { // 要加载 区
        this.districtList = cityObj.children
        return {
          status: true
        }
      }
      let districtObj = cityObj.children.find(item => {
        return item.id === this.formDataObj.districtObj.id
      })
      if (!districtObj || !districtObj.children) {
        return false
      }
      this.streetList = districtObj.children
      return {
        status: true
      }
    },
    // 回显之前的
    toShowOldChoose () {
      this.formDataObj.provinceObj = {}
      this.formDataObj.cityObj = {}
      this.formDataObj.districtObj = {}
      this.formDataObj.streetObj = {}

      if (this.formData.provinceId) {
        this.formDataObj.provinceObj.id = this.formData.provinceId
        this.formDataObj.provinceObj.name = this.formData.provinceName
      }
      if (this.formData.cityId) {
        this.formDataObj.cityObj.id = this.formData.cityId
        this.formDataObj.cityObj.name = this.formData.cityName
      }
      if (this.formData.districtId) {
        this.formDataObj.districtObj.id = this.formData.districtId
        this.formDataObj.districtObj.name = this.formData.districtName
      }
      if (this.formData.streetId) {
        this.formDataObj.streetObj.id = this.formData.streetId
        this.formDataObj.streetObj.name = this.formData.streetName
      }
      // 有省级的 去获取市的
      this.getAreaList(1, true)
      if (!this.formDataObj.provinceObj.id || this.level <= 1) {
        return false
      }
      // 有省级的 去获取市的
      this.getAreaList(2, true)
      if (!this.formDataObj.cityObj.id || this.level <= 2) {
        return false
      }
      // 有市级的 去获取区的
      this.getAreaList(3, true)
      if (!this.formData.districtId || this.level <= 3) {
        return false
      }
      // 有区级的 去获取街道的
      this.getAreaList(4, true)
    },
    // 省市区的值有发生变化时
    hasChange (isShow, level) {
      if (level < 2) {

      }
      this.formData.provinceId = this.formDataObj.provinceObj && this.formDataObj.provinceObj.id ? this.formDataObj.provinceObj.id : ''
      this.formData.cityId = this.formDataObj.cityObj && this.formDataObj.cityObj.id ? this.formDataObj.cityObj.id : ''
      this.formData.districtId = this.formDataObj.districtObj && this.formDataObj.districtObj.id ? this.formDataObj.districtObj.id : ''
      this.formData.streetId = this.formDataObj.streetObj && this.formDataObj.streetObj.id ? this.formDataObj.streetObj.id : ''
      if (this.showName) {
        this.formData.provinceName = this.formDataObj.provinceObj ? this.formDataObj.provinceObj.name : ''
        this.formData.cityName = this.formDataObj.cityObj ? this.formDataObj.cityObj.name : ''
        this.formData.districtName = this.formDataObj.districtObj ? this.formDataObj.districtObj.name : ''
        this.formData.streetName = this.formDataObj.streetObj ? this.formDataObj.streetObj.name : ''
      }
      this.getSelectObj && this.getSelectObj(this.formDataObj)
      this.$emit('change', isShow)
    },
    // 清空 重置
    toResetValue () {
      this.getAreaList(1)
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) return false
      this.toShowOldChoose()
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
