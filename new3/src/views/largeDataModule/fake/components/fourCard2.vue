<template>
  <div id="four-card" class="flex">
    <section class="flex bac-set">
      <span class="index-blue"><strong><countTo :startVal="0" :endVal="832512" :duration="3000" class="total"></countTo>千克</strong></span>
      <span class="bold icon-text"><img src="http://ajwl.oss-cn-shenzhen.aliyuncs.com/201903261504298406281.png" alt="">金属</span>
      <span class="index-blue describe">预计节约铝矿开采612吨</span>
    </section>
    <section class="flex bac-set">
      <span class="index-blue"><strong><countTo :startVal="0" :endVal="608024" :duration="3000" class="total"></countTo>千克</strong></span>
      <span class="bold icon-text"><img src="http://ajwl.oss-cn-shenzhen.aliyuncs.com/201904011702034548270.png" alt="">衣物</span>
      <span class="index-blue describe">预计节约标准3063吨</span>
    </section>
    <section class="flex bac-set">
      <span class="index-blue"><strong><countTo :startVal="0" :endVal="223669" :duration="3000" class="total"></countTo>千克</strong></span>
      <span class="bold icon-text"><img src="http://ajwl.oss-cn-shenzhen.aliyuncs.com/201902252330509222086.png" alt="">纸张</span>
      <span class="index-blue describe">预计减少树木砍伐396吨</span>
    </section>
    <section class="flex bac-set">
      <span class="index-blue"><strong><countTo :startVal="0" :endVal="404211" :duration="3000" class="total"></countTo>千克</strong></span>
      <span class="bold icon-text"><img src="http://ajwl.oss-cn-shenzhen.aliyuncs.com/201902252329213373956.png" alt="">塑料</span>
      <span class="index-blue describe">预计回炼柴油2869吨</span>
    </section>
  </div>
</template>
<script>
import countTo from 'vue-count-to'
export default {
  name: 'fourCard',
  components: { countTo },
  data () {
    return {}
  }
}
</script>

<style lang="scss" scoped>
  .index-blue{
    color: #06ebff
  }
  .flex{
    display: flex
  }
  .bold{
    font-weight: bold
  }
  .bac-set{
    background-position: center;
    background-size: 100% 100%
  }
  #four-card{
    height: 18%;
    justify-content: space-between;
    margin-bottom: 20px;
    section{
      width: calc((100% - 40px) / 4);
      flex-flow: column nowrap;
      justify-content: center;
      align-items: center;
      font-size: 16px;
      z-index: 2;
      .total{
        font-size: 44px;
        margin-right: 10px
      };
      span{
        font-size: 20px;
      };
      .describe{
        font-size: 18px;
      }
      .icon-text{
        display: flex;
        align-items: center;
        img{
          margin-right: 10px;
          width: 36px;
          height: 36px;
        }
      }
    }
  }
  #four-card section:nth-child(1){
    background-image: url(../../assets/card1.png);
  }
  #four-card section:nth-child(2){
    background-image: url(../../assets/card.png);
  }
  #four-card section:nth-child(3){
    background-image: url(../../assets/card.png);
  }
  #four-card section:nth-child(4){
    background-image: url(../../assets/card4.png);
  }
</style>
