<!-- 表结构 -->
<template>
  <el-table class="v-table" border :data="dataList" @sort-change="sortChange">
    <el-table-column label="序号" align="center" width="60px">
      <template slot-scope="scope">
        {{(formData.page - 1) * formData.size + scope.$index + 1}}
      </template>
    </el-table-column>
    <el-table-column label="小区" prop="communityName"  align="center"> </el-table-column>
    <el-table-column label="区" prop="districtName"  align="center"> </el-table-column>
    <el-table-column label="市" prop="cityName"  align="center"> </el-table-column>
    <el-table-column label="省" prop="provinceName"  align="center"> </el-table-column>
    <el-table-column v-for="(title ,titleIndex) in titleList" :key="titleIndex" :label="`${title.name}`" align="center">
      <el-table-column  label="积分" :prop="`${title.filed2}`"  align="center"> </el-table-column>
      <el-table-column  :label="`${title.type ? '件数' : '重量'}`" :prop="`${title.filed1}`"  align="center"> </el-table-column>
    </el-table-column>
    <el-table-column label="总积分" prop="integralTotal"  width="90px" align="center" sortable="custom"> </el-table-column>
    <el-table-column label="总重量" prop="weightTotal"  width="90px" align="center" sortable="custom"> </el-table-column>
  </el-table>
</template>

<script>
export default {
  name: 'TableList',
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    dataList: {
      type: Array,
      default: () => []
    },
    titleList: {
      type: Array,
      default: () => []
    }
  },
  methods: {
    // 排序
    sortChange ({ column, prop, order }) {
      console.log(column, prop, order)
      // sortType: 0 // 0：总积分降序；1：总积分升序；2：总重量降序；3：总重量升序
      let sortType = ''
      if (prop === 'integralTotal' && order === 'ascending') {
        sortType = 1
      } else if (prop === 'integralTotal' && order === 'descending') {
        sortType = 0
      } else if (prop === 'weightTotal' && order === 'ascending') {
        sortType = 3
      } else if (prop === 'weightTotal' && order === 'descending') {
        sortType = 2
      }
      this.$emit('sortList', sortType)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
