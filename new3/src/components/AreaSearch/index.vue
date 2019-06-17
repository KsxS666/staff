<!-- 省市区街道筛选条件 -->
<template>
    <div class="wrap" ref="wrap">
      <el-form-item v-if="level >=1" ref="item" label="">
        <el-select filterable clearable v-model="formData.provinceId" placeholder="请选择省" @change="getAreaList(2)">
          <el-option v-for="(item, i) in provinceList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="level >=2" ref="item" label="">
        <el-select filterable clearable v-model="formData.cityId" placeholder="请选择市" @change="getAreaList(3)">
          <el-option v-for="(item, i) in cityList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="level >=3" ref="item" label="">
        <el-select filterable clearable v-model="formData.districtId" placeholder="请选择区" @change="getAreaList(4)">
          <el-option v-for="(item, i) in districtList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="level >=4" ref="item" label="">
        <el-select filterable clearable v-model="formData.streetId" placeholder="请选择街道" @change="getAreaList(5)">
          <el-option v-for="(item, i) in streetList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
    </div>
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
      provinceList: [], // 省 列表
      cityList: [], // 市 列表
      districtList: [], // 区 列表
      streetList: [] // 街道 列表
    }
  },
  created () {
    this.getAreaList(1)
  },
  mounted () {
    this.$refs.wrap.style.width = 20 * this.level + '%'
  },
  methods: {
    // 获取省市区街道的列表 有变化的时候
    async getAreaList (level) {
      // console.log('有变化了', level)
      let parentId = ''
      let listName = 'provinceList'
      // 判断是要获得哪一级的数据
      switch (level) {
        case 1:
          this.formData.cityId = ''
          this.formData.districtId = ''
          this.formData.streetId = ''
          this.cityList = []
          this.districtList = []
          this.streetList = []
          break
        case 2:
          listName = 'cityList'
          parentId = this.formData.provinceId
          this.formData.cityId = ''
          this.formData.districtId = ''
          this.formData.streetId = ''
          this.cityList = []
          this.districtList = []
          this.streetList = []
          break
        case 3:
          listName = 'districtList'
          parentId = this.formData.cityId
          this.formData.districtId = ''
          this.formData.streetId = ''
          this.districtList = []
          this.streetList = []
          break
        case 4:
          listName = 'streetList'
          parentId = this.formData.districtId
          this.formData.streetId = ''
          this.streetList = []
          break
      }
      this.hasChange()
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
      }
    },
    // 省市区的值有发生变化时
    hasChange () {
      this.$emit('change', true)
    },
    // 清空 重置
    toResetValue () {
      this.getAreaList(1)
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
