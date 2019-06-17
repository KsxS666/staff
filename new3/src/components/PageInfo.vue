<!-- 分页 -->
<template>
  <div class="v-page" v-if="formData && formData.total">
    <el-pagination :current-page="formData.page"
                   :page-size="formData.size"
                   :total="formData.total"
                   :layout="layout"
                   :page-sizes="pageSizes"
                   @current-change="handleCurrentChange"
                   @size-change="handleSizeChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: 'PageInfo',
  props: {
    formData: {
      type: Object,
      default: () => {}
    },
    pageSizes: {
      type: Array,
      default: () => [20, 50, 100, 150]
    },
    layout: {
      type: String,
      default: 'total, sizes, prev, pager, next, jumper'
    }
  },
  methods: {
    handleCurrentChange (val) {
      this.$emit('current-change', val)
    },
    handleSizeChange (val) {
      this.$emit('size-change', val)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  // 分页
  .v-page{
    text-align: right;
    margin: 20px 30px 0;
  }
</style>
