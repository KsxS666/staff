<template>
  <div class="box">
    <h4 class="title">居民实时投放情况</h4>
    <p v-if="!dataList || !dataList.length" style="text-align: center; margin: 60px 0">暂无数据</p>
    <vueSeamless :data="dataList" :class-option="classOption" class="dataBox" v-else>
      <ul class="item">
        <li v-for="(item, index) in dataList" :key="index" class="flex">
          <span class="v-hidden" style="width: 25%">{{ item.username }}</span>
          <span class="v-hidden" style="width: 35%">{{ item.phone }}</span>
          <!--<p class="v-hidden left">
            <span></span>
            {{ item.phone }}{{ item.phone }}{{ item.phone }}
          </p>-->
          <span class="right v-hidden" style="width: 40%">{{ $utils.timeFromNow(new Date($moment(item.createTime).format()))}}投放{{ item.weight }}g</span>
        </li>
      </ul>
    </vueSeamless>
  </div>
</template>

<script>
import vueSeamless from 'vue-seamless-scroll'
export default {
  name: 'PeopleLaunch',
  components: {
    vueSeamless
  },
  data () {
    return {
      dataList: []
    }
  },
  computed: {
    classOption () {
      return {
        step: 0.15
      }
    }
  },
  created () {
    this.getList()
  },
  mounted () {
    this.timer = setInterval(() => {
      this.getList()
    }, 1000 * 60)
  },
  methods: {
    async getList () {
      let reqData = {
        num: 30
      }
      let res = await this.$post('integral/overview/getCastUserList', reqData)
      if (res.code === 0) {
        this.dataList = res.data || []
      }
    }
  },
  beforeDestroy () {
    this.timer && clearInterval(this.timer)
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .box {
    flex: 1;
  }
  .dataBox{
    padding: 0 30px 30px;
    width: 100%;
    height: calc(100% - 80px);
    min-height: 350px;
    overflow: hidden;
    ul{
      width: 100%;
    }
    li{
      line-height: 40px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: $text-second;
      font-size: $font-min-title;
      overflow: hidden;
      /*span{
        width: 30%;
      }*/
    }
  }
</style>
