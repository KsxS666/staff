<!--实时投放表格-->
<template>
  <div id="actual" class="flex">
    <section class="table-content bac-set">
    <div class="table-title index-blue">实时投放</div>
      <vueSeamless :data="dataList" class="seamless-warp" :class-option="classOption" v-if="dataList">
        <ul class="item">
          <li v-for="(item, index) in dataList" :key="index" class="flex">
            <span class="index-blue user-name" v-text="item.userName"></span>
            <span class="phone" v-text="item.phone.substring(0,3)+'****'+item.phone.substring(7,11)"></span>
            <span class="recent">
              最近投放<div class="index-blue"><i v-text="item.weight"></i>g</div>
            </span>
          </li>
        </ul>
      </vueSeamless>
      <div v-else class="noData"><p>暂无数据</p></div>
    </section>
  </div>
</template>

<script>
import vueSeamless from 'vue-seamless-scroll'
export default {
  name: 'actual',
  components: { vueSeamless },
  data () {
    return {
      dataList: [],
      ti: null
    }
  },
  created () {
    this.getList()
    this.ti = setInterval(this.getList, 60000)
  },
  computed: {
    classOption () {
      return {
        step: 0.4
      }
    }
  },
  methods: {
    async getList () { // 获取实时投放
      let res = await this.$post('equipment/indexCount/castUserList')
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data
    }
  },
  beforeDestroy () {
    window.clearInterval('t1')
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
  #actual{
    position: relative;
    flex-flow: column nowrap;
    margin-bottom: 20px;
    height: 30%;
    z-index: 2;
    font-size: 16px;
    min-width: 363px;
    .table-title{
      height: 30%;
      display: flex;
      align-items: flex-end;
      padding-left: 12px;
      margin-bottom: 12px;
    }
    .table-content{
      height: 100%;
      background-image: url(../../../assets/new7.png);
      .seamless-warp{
        display: block;
        height: calc(70% - 20px);
        overflow: hidden;
        padding-left: 20px;
        li{
          margin-bottom: 10px;
          span.user-name{
            flex: 0 0 126px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis
          }
          span.recent{
            font-size: 14px
          }
          span{
            flex: 1;
            div{
              display: inline;
              white-space: nowrap;
              i{
                font-style: normal;
              }
            }
          }
        }
      }
    }
    .noData{
      color: #666666;
      display: flex;
      justify-content: center;
      align-items: center;
      height: calc(100% - 30% - 12px)
    }
  }

</style>
