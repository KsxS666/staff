<template>
  <div id="four-card" class="flex" v-if="dataList.length">
    <section class="flex bac-set"  v-for="item in dataList" :key="item.id">
      <span class="index-blue"><strong><countTo :startVal="0" :endVal="item.total/1000" :duration="3000" class="total"></countTo>千克</strong></span>
      <span class="bold icon-text"><img :src="item.chartImg" alt="">{{`${item.typeName}`}}</span>
      <span class="index-blue describe">{{item.describeName + (parseInt(item.recycleValue)/1000).toFixed(2)}}吨</span>
    </section>
  </div>
  <div id="four-card" class="flex" v-else>
    <section class="flex bac-set"  v-for="item in zeroData" :key="item.id">
      <span class="index-blue"><strong>{{item.total}}千克</strong></span>
      <span class="bold icon-text">{{`${item.typeName}`}}</span>
      <span class="index-blue describe">预计节省标准0吨</span>
    </section>
  </div>
</template>
<script>
import countTo from 'vue-count-to'
export default {
  name: 'fourCard',
  components: { countTo },
  data () {
    return {
      dataList: [],
      zeroData: [{ typeName: '金属', total: 0, typeValue: 2 }, { typeName: '衣物', total: 0, typeValue: 8 }, { typeName: '纸张', total: 0, typeValue: 1 }, { typeName: '塑料', total: 0, typeValue: 3 }]
    }
  },
  created () {
    this.getList()
  },
  methods: {
    async getList () { // 获取投放类型及对应投放量数据
      let res = await this.$post('equipment/indexCount/castTypeTotal')
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      if (res.data.length) {
        res.data.map(ele => {
          switch (ele.typeName) {
            case '纸张':
              ele.describeName = '预计减少树木砍伐'
              break
            case '金属':
              ele.describeName = '预计节约铝矿开采量'
              break
            case '塑料':
              ele.describeName = '预计回炼柴油'
              break
            default:
              ele.describeName = '预计节约标准'
          }
        })
      }
      this.dataList = res.data.slice(0, 4)
    }
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
