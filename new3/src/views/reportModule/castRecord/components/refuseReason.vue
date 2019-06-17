<template>
  <v-dialog title="拒绝原因" class="dialogWrap" :visible.sync="value" width="50%" :before-close="beforeClose" @submit.native.prevent>
    {{content}}
    <div slot="footer" style="text-align: center">
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'inspectDialog',
  props: {
    value: Boolean,
    content: { // 表单数据
      type: String,
      default: () => ''
    }
  },
  methods: {
    beforeClose () {
      this.$emit('input', false)
    }
  }
}
</script>

<style scoped>
</style>
