<!-- 表结构 -->
<template>
  <el-table class="v-table" border :data="dataList">
    <el-table-column label="序号" align="center" width="60px">
      <template slot-scope="scope">
        {{scope.$index + 1}}
      </template>
    </el-table-column>
    <el-table-column label="种类" prop="name"  align="center"> </el-table-column>
    <el-table-column label="重量（g）" prop="weight"  align="center"> </el-table-column>
    <el-table-column label="次数" prop="castTimes"  align="center"> </el-table-column>
    <el-table-column label="积分" prop="integral"  align="center"> </el-table-column>
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
    }
  },
  methods: {}
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
