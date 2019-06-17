<!-- 投放列表 -->
<template>
  <div class="v-wrap">
    <el-tabs type="border-card" @tab-click="tabClick">
      <el-tab-pane label="全部">
        <tabTable :btnVisible="btnVisible" v-if="hasShow['list1']" />
      </el-tab-pane>
      <el-tab-pane label="未巡检" name="list2">
        <tabTable :btnVisible="btnVisible" :inspectionStatus="0"  v-if="hasShow['list2']" />
      </el-tab-pane>
      <el-tab-pane label="已巡检" name="list3">
        <tabTable :btnVisible="btnVisible" :inspectionStatus="1" v-if="hasShow['list3']" />
      </el-tab-pane>
      <el-tab-pane label="已拒绝" name="list4">
        <tabTable :btnVisible="btnVisible" :inspectionStatus="2" v-if="hasShow['list4']" />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabTable from './components/tabTable'
export default {
  name: 'castList',
  components: { tabTable },
  data () {
    return {
      hasShow: { 'list1': true }
    }
  },
  methods: {
    tabClick (e) {
      this.hasShow = Object.assign({}, this.hasShow, { [`${e.name}`]: true })
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.topButton = !btnList.download ? null : true
      btnList.tableButton = !btnList.inspect && !btnList.resonCheck ? null : true
      return btnList
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
