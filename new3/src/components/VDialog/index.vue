<!-- 二次封装dialog组件 添加放大缩小的按钮-->
<template>
  <el-dialog :title="title" class="vDialogWrap dialogWrap" :visible.sync="visible" :fullscreen="showFullScreen" :before-close="beforeClose"
             :modal="modal" :modal-append-to-body="modalAppendToBody" :append-to-body="appendToBody" :lock-scroll="lockScroll" :close-on-click-modal="closeOnClickModal"
             :close-on-press-escape="closeOnPressEscape" :show-close="showClose" :center="center" :custom-class="customClass" :top="top" :width="width"
  >
    <div slot="title" class="header">
      <span>{{title}}</span>
      <button v-if="enlarge" @click="toShowBig" :title="`${showFullScreen ? '缩小' : '全屏'}`">
        <i class="icon icon-enlarge" v-if="!showFullScreen"></i>
        <i class="icon icon-lessen" v-else></i>
      </button>
    </div>
    <slot></slot>
    <slot slot="footer" name="footer" style="text-align: center;"></slot>
  </el-dialog>
</template>

<script>
export default {
  name: 'VDialog',
  props: {
    visible: Boolean,
    // value: Boolean,
    // showAgain: true, // 是否是
    enlarge: { // 是否有全屏按钮 默认开启
      type: Boolean,
      default: true
    },
    title: {
      type: String,
      default: ''
    },

    modal: {
      type: Boolean,
      default: true
    },

    modalAppendToBody: {
      type: Boolean,
      default: true
    },

    appendToBody: {
      type: Boolean,
      default: false
    },

    lockScroll: {
      type: Boolean,
      default: true
    },

    closeOnClickModal: {
      type: Boolean,
      default: true
    },

    closeOnPressEscape: {
      type: Boolean,
      default: true
    },

    showClose: {
      type: Boolean,
      default: true
    },

    width: String,

    fullscreen: Boolean,

    customClass: {
      type: String,
      default: ''
    },

    top: {
      type: String,
      default: '15vh'
    },
    beforeClose: Function,
    center: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      showFullScreen: false
    }
  },
  methods: {
    toShowBig () {
      this.showFullScreen = !this.showFullScreen
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .header{
    position: relative;
    padding-right: 30px;
    span{
      line-height: 24px;
      font-size: 18px;
      color: $text-primary;
    }
    button{
      position: absolute;
      top: 0;
      right: 30px;
      padding: 0;
      background: 0 0;
      border: none;
      outline: 0;
      cursor: pointer;
      font-size: 16px;
      color: $text-third;
    }
    .icon{
      display: inline-block;
      width: 20px;
      height: 20px;
      background: no-repeat center;
      background-size: 16px;
      &.icon-enlarge{
        background-image: url("./icon-enlarge.png");
      }
      &.icon-lessen{
        background-image: url("./icon-lessen.png");
      }
    }
  }

</style>
<style lang="scss" rel="stylesheet/scss">
  .vDialogWrap{
    .el-dialog{
      transition: width .2s, height .2s;
      /*transition: .2s ease;*/
    }
    .el-dialog__header{
      background: $table-background;
      padding: 15px 20px;
      .el-dialog__headerbtn{
        top: 15px;
      }
    }
    .el-dialog__footer{
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
