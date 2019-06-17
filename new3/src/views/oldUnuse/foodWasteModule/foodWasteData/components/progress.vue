<!-- 圆形进度条 -->
<template>
  <div class="circleProgressWrapper">
    <!-- 颜色的圈 -->
    <div class="circleColor"></div>
    <!-- 滚动的区域 -->
    <div class="wrapper right">
      <!-- display: none 是为了去掉中间的 拼接处的一条细线 -->
      <div class="circleProgress rightcircle" :style="{transform:`rotate(${rightAngle}deg)`, display: `${rightAngle >= 225 ? 'none' :'block'}`}"></div>
    </div>
    <div class="wrapper left">
      <div class="circleProgress leftcircle" :style="{'transform':`rotate(${leftAngle}deg)`, display: `${leftAngle >= 225 ? 'none' :'block'}`}"></div>
    </div>
    <!-- 中间显示的文本 -->
    <div class="text" v-show="showText">{{showText}}</div>
  </div>
</template>

<script>
export default {
  name: 'v-progress',
  props: {
    percentage: { // 百分率  0 - 100
      type: Number,
      default: 0
    },
    showTime: { // 动画时间  默认2000 ms
      type: Number,
      default: 2000
    },
    showText: { // 显示的文本
      type: String,
      default: null
    }
  },
  data () {
    return {
      timer: null,
      rightAngle: 45,
      leftAngle: 45
    }
  },
  created () {
    this.setStatus()
  },
  mounted () {
    if (!this.showTime) { // 无动画时间
      clearInterval(this.timer)
      this.finishStatus()
    }
  },
  methods: {
    // 动画效果---旋转进度
    setStatus () {
      clearInterval(this.timer)
      let num = this.percentage >= 100 ? 100 : (this.percentage <= 0 ? 0 : Math.floor(this.percentage))
      let angle = num / 100 * 360 // 要旋转的角度
      let spaceTime = 100 // 时间间隔 100 毫秒
      let totalNum = this.showTime / 100 // 总次数
      let spaceAngle = angle / totalNum // 每次间隔的角度度数
      this.timer = setInterval(() => {
        if (totalNum <= 0) {
          clearInterval(this.timer)
          this.finishStatus()
        }
        totalNum = totalNum - 1
        if (this.rightAngle >= (45 + 180)) { // 大于 180度的旋转
          this.rightAngle = 225
          if (this.leftAngle >= (45 + 180)) {
            this.leftAngle = 225
            clearInterval(this.timer)
          } else {
            this.leftAngle = this.leftAngle + spaceAngle
          }
        } else { // 小于180度的旋转
          this.rightAngle = this.rightAngle + spaceAngle
          if (this.rightAngle > (45 + 180)) {
            this.rightAngle = 225
          }
        }
      }, spaceTime)
    },
    // 最后的效果
    finishStatus () {
      let num = this.percentage >= 100 ? 100 : (this.percentage <= 0 ? 0 : Math.floor(this.percentage))
      let angle = num / 100 * 360 // 要旋转的角度
      if (angle > 180) {
        this.rightAngle = 225
        this.leftAngle = 45 + angle - 180
      } else {
        this.rightAngle = 45 + angle
        this.leftAngle = 45
      }
    }
  },
  watch: {
    percentage () {
      if (!this.showTime) { // 无动画时间
        clearInterval(this.timer)
        this.finishStatus()
        return
      }
      this.setStatus()
    }
  },
  beforeDestroy () {
    clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  $boder-bg: #cdd7df; /* 底色 */
  $width: 230px; // 整个圈的宽度
  $circleWidth: 20px; // 环的宽度
  .circleProgressWrapper{
    width: $width;
    height: $width;
    position: relative;
    /*border:1px solid #ddd;*/
  }
  .text{
    position: absolute;
    top: calc(50% - 30px);
    left: 0;
    width: 100%;
    text-align: center;
    font-size: 50px;
    font-weight: normal;
    line-height: 60px;
    color: #333333;
    z-index: 10;
  }

  /*颜色的圈*/
  .circleColor{
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background-color: #4b82e7;
    background: linear-gradient(#4b82e7, #23a4e1, #7360ed );
    border-radius: 50%;
    padding: 10px;
    z-index: 1;
    transform: rotate(-45deg);
    &::after{
      position: absolute;
      top: $circleWidth;
      bottom: $circleWidth;
      left: $circleWidth;
      right: $circleWidth;
      background: #fff;
      content: '';
      z-index: 2;
      border-radius: 200px;
    }
  }
  /* 滚动的区域 */
  .wrapper{
    /*display: none;*/
    width: 50%;
    height: 100%;
    position: absolute;
    top:0;
    overflow: hidden;
    z-index: 3;
    &.right{
      right:0;
    }
    &.left{
      left:0;
    }
    .circleProgress{
      width: 200%;
      height: 100%;
      border: $circleWidth solid transparent;
      border-radius: 50%;
      position: absolute;
      top:0;
      transform: rotate(45deg);
      &.rightcircle{
        border-top-color: $boder-bg;
        border-right-color: $boder-bg;
        right:0;
        /*animation: circleProgressLoad_right 5s linear infinite;*/
      }
      &.leftcircle{
        border-bottom-color: $boder-bg;
        border-left-color: $boder-bg;
        left:0;
        /*animation: circleProgressLoad_left 5s linear infinite;*/
      }
    }
  }
</style>
