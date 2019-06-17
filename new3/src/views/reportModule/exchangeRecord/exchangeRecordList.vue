<!-- 兑换记录 列表 -->
<template>
  <div class="v-wrap">
    <el-tabs type="border-card" style="margin-top: 20px" @tab-click="tabClick">
      <el-tab-pane label="积分商城">
        <tabTable :exchangeChannels="1" v-if="hasShow['list1']"/>
      </el-tab-pane>
      <el-tab-pane label="兑换机" name="list2">
        <tabTable :exchangeChannels="2" v-if="hasShow['list2']"/>
      </el-tab-pane>
      <el-tab-pane label="线下兑换" name="list3">
        <tabTable outLine v-if="hasShow['list3']"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabTable from './components/tabTable'
export default {
  name: 'exchangeRecordList',
  components: { tabTable },
  data () {
    return {
      hasShow: { 'list1': true }
    }
  },
  methods: {
    tabClick (e) {
      console.log('e', e)
      console.log('this.hasShow', this.hasShow)
      // this.hasShow[`${e.name}`] = true
      this.hasShow = Object.assign({}, this.hasShow, {
        [`${e.name}`]: true
      })
      // this.$set(this.hasShow, `${e.name}`, true)
      // console.log('this.hasShow', this.hasShow, this.hasShow['正常'])
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
