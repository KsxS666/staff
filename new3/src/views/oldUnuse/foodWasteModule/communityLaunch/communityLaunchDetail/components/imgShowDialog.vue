<!-- 显示投放不合格的理由 图片的弹窗 -->
<template>
  <v-dialog title="不合格理由" class="" :visible="value" :before-close="beforeClose" width="500px">
    <div class="imgBox">
      <div v-if="url">
        <img class="img" v-for="(img, i) in imgList" :key="i" :src="img" alt="">
      </div>
      <p v-else>没有图片</p>
    </div>
    <div slot="footer">
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'imgShowDialog',
  props: {
    value: Boolean,
    url: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      imgList: []
    }
  },
  methods: {
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) return
      this.imgList = this.url ? this.url.split(',') : []
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .imgBox{
    display: block;
    margin: 0 auto;
    width: 400px;
    height: auto;
    min-height: 400px;
    img{
      width: 100%;
      max-height: 500px;
      height: auto;
    }
    p{
      text-align: center;
    }
  }

</style>
