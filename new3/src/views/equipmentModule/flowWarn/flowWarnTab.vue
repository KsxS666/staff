<!-- 流量预警 -->
<template>
  <div class="v-wrap">
    <el-tabs type="border-card" @tab-click="tabClick">
      <el-tab-pane label="流量预警" style="min-height: calc(100vh - 260px)">
        <flowWarnList v-if="hasShow['list1']"/>
      </el-tab-pane>
      <el-tab-pane label="预警设置" name="list2" style="min-height: calc(100vh - 260px)">
        <flowWarnSet v-if="hasShow['list2']" />
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script>
import flowWarnList from './components/flowWarnList'
import flowWarnSet from './components/flowWarnSet'
export default {
  name: 'flowWarn',
  components: { flowWarnList, flowWarnSet },
  data () {
    return {
      hasShow: { 'list1': true }
    }
  },
  methods: {
    tabClick (e) {
      this.hasShow = Object.assign({}, this.hasShow, {
        [`${e.name}`]: true
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
