<template>
  <el-form-item label="区域">
    <el-tree ref="areaTree" :data="dataList" node-key="id" :props="props" show-checkbox @check-change="handleCheckChange" style="border: 1px solid #DCDFE6; border-radius: 4px; padding: 6px"></el-tree>
  </el-form-item>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean
    },
    infoObj: {
      type: Object,
      default: () => {}
    }
  },
  name: 'areaForm',
  data () {
    return {
      props: {
        label: 'name',
        children: 'children',
        isLeaf: 'leaf'
      },
      dataList: [],
      provinceIds: new Set(),
      cityIds: new Set()
    }
  },
  created () {
    this.getAreaList()
  },
  mounted () {
    this.getOldCheck()
  },
  methods: {
    async getAreaList () {
      let res = await this.$post('community/community/getCommunityAreaList')
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data || []
    },
    async getOldCheck () {
      let keys = this.infoObj.cityId.split(',')
      this.provinceIds.add(this.infoObj.provinceId.split(','))
      this.cityIds.add(this.infoObj.cityId.split(','))
      this.$refs.areaTree.setCheckedKeys(keys || [])
    },
    handleCheckChange (data, bool1, bool2) {
      let node = this.$refs.areaTree.getCheckedNodes(false, true)
      this.provinceIds.clear()
      this.cityIds.clear()
      node.map(ele => {
        if (ele['children']) {
          this.provinceIds.add(ele.id)
        } else {
          this.cityIds.add(ele.id)
        }
      })
    },
    // 获得全部选中的状态
    getAllCheck () {
      let provinceIds = Array.from(this.provinceIds)
      let cityIds = Array.from(this.cityIds)
      let areaObj = { provinceIds, cityIds }
      return {
        areaObj
      }
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.getOldCheck()
    }
  }
}
</script>

<style lang="scss" scoped>
  .box {
    border: 1px solid $border-base;
    border-radius: 4px;
    padding: 10px;
    height: 100%;
    min-height: 118px;
    overflow: auto;
    overflow: auto;
    font-size: 14px;
    margin: 0 40px 20px 40px;
  }
</style>
