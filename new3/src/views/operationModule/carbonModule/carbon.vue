<template>
  <div class="v-wrap">
    <el-tabs type="border-card" @tab-click="tabClick">
      <el-tab-pane label="减碳报表" style="min-height: calc(100vh - 220px)">
        <carbonList :btnVisible="btnVisible" v-if="hasShow['list1']" />
      </el-tab-pane>
      <el-tab-pane label="减碳规则设置" name="list2" style="min-height: calc(100vh - 220px)">
        <carbonRuleSet v-if="hasShow['list2']"/>
      </el-tab-pane>
      <el-tab-pane label="等级设置" name="list3"  style="min-height: calc(100vh - 220px)">
        <rankSet v-if="hasShow['list3']"/>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>

<script>
import carbonList from './pages/carbonList'
import carbonRuleSet from './pages/carbonRuleSet'
import rankSet from './pages/rankSet'
export default {
  name: 'carbon',
  components: { carbonList, carbonRuleSet, rankSet },
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
  },
  computed: {
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.tableButton = !btnList.checkRecord ? null : true
      return btnList
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
