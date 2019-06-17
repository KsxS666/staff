<!-- 省市区街道筛选条件 -->
<template>
  <el-form-item ref="item" label="">
    <el-cascader v-model="currentArea" :options="areaList" placeholder="请选择地区" change-on-select filterable clearable @visible-change="visibleChange" @change="handleItemChange" :props="props"></el-cascader>
  </el-form-item>
</template>

<script>
export default {
  name: 'areaSearch',
  props: {
    level: { // 显示几级的省市区数据 默认 4级
      type: Number,
      default: 4
    },
    formData: { // 请求的参数  返回省市区的数据
      type: Object,
      default: () => {}
    },
    isCommunity: { // 省市区的列表 是否是 只有有小区地方的的省市区
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      currentArea: null,
      areaList: [],
      props: {
        value: 'id',
        label: 'name'
      }
    }
  },
  created () {
    this.getAreaList()
  },
  mounted () {
    // this.$refs.wrap.style.width = 20 * this.level + '%'
  },
  methods: {
    visibleChange (bool) {
      // console.log('visibleChange', bool)
      if (!bool) {
        this.hasChange()
      }
    },
    handleItemChange (val) {
      if (!val.length) {
        this.hasChange()
        return
      }
      let currentObj = this.getCurrentObj(val, this.areaList)
      if (currentObj.children && currentObj.children.length) return
      if (val.length >= this.level) return
      this.getAreaList(currentObj, val.length)
    },
    getCurrentObj (valArr, list) {
      let val = JSON.parse(JSON.stringify(valArr))
      let currentObj = null
      let obj = list.find(item => {
        return item.id === val[0]
      })
      if (obj) {
        currentObj = obj
      }
      if (val.length > 1) {
        val.splice(0, 1)
        currentObj = this.getCurrentObj(val, currentObj.children)
      }
      return currentObj
    },
    async getAreaList (currentObj, currentIndex = 0) {
      let parentId = currentObj ? currentObj.id : ''
      let url = this.isCommunity ? 'community/community/getAreaList' : 'system/area/getList'
      let res = await this.$post(url, { parentId: parentId, level: currentIndex + 1 })
      if (res.code !== 0) { return }
      res.data.map(item => {
        item.children = currentIndex && currentIndex >= this.level - 1 ? null : []
      })
      if (!currentObj) {
        this.areaList = res.data
      } else {
        currentObj.children = res.data && res.data.length ? res.data : null
      }
    },
    hasChange () {
      if (this.level >= 1) {
        this.formData.provinceId = this.currentArea && this.currentArea.length >= 1 ? this.currentArea[0] : ''
      }
      if (this.level >= 2) {
        this.formData.cityId = this.currentArea && this.currentArea.length >= 2 ? this.currentArea[1] : ''
      }
      if (this.level >= 3) {
        this.formData.districtId = this.currentArea && this.currentArea.length >= 3 ? this.currentArea[2] : ''
      }
      if (this.level >= 4) {
        this.formData.streetId = this.currentArea && this.currentArea.length >= 4 ? this.currentArea[3] : ''
      }
      this.$emit('change', true)
    },
    // 清空 重置
    toResetValue () {
      this.currentArea = []
      this.hasChange()
      // this.getAreaList()
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .wrap{
    display: flex;
    align-items: flex-start;
    .el-form-item{
      flex: 1;
    }
  }

</style>
