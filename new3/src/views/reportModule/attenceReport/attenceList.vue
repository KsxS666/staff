<!-- 考勤报表-->
<template>
  <div class="v-wrap attenceReport">
    <el-tabs type="border-card" @tab-click='tabClick'>
      <el-tab-pane label="全部" class="tabPanel">
        <tabTable type='' :btnVisible="btnVisible"/>
      </el-tab-pane>
      <el-tab-pane label="正常" name="list2" class="tabPanel">
        <!-- <span>{{hasShow['list2']}}</span> -->
        <tabTable type=0 v-if="hasShow['list2']" :btnVisible="btnVisible"/>
      </el-tab-pane>
      <el-tab-pane label="未打卡" name="list3" class="tabPanel">
        <tabTable type=1 v-if="hasShow['list3']" :btnVisible="btnVisible"/>
      </el-tab-pane>
      <el-tab-pane label="早退" name="list4" class="tabPanel">
        <tabTable type=2 v-if="hasShow['list4']" :btnVisible="btnVisible"/>
      </el-tab-pane>
      <el-tab-pane label="迟到" name="list5" class="tabPanel">
        <tabTable type=3 v-if="hasShow['list5']" :btnVisible="btnVisible"/>
      </el-tab-pane>
      <el-tab-pane label="时间异常" name="list6" class="tabPanel">
        <tabTable type=4 v-if="hasShow['list6']" :btnVisible="btnVisible"/>
      </el-tab-pane>
      <el-tab-pane label="地点异常" name="list7" class="tabPanel">
        <tabTable type=5 v-if="hasShow['list7']" :btnVisible="btnVisible"/>
      </el-tab-pane>
      <el-tab-pane label="考勤汇总" class="tabPanel">
        <attenceGather :btnVisible="btnVisible"/>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import tabTable from './components/tabTable'
import attenceGather from './components/attenceGather'
export default {
  name: 'attenceList',
  components: { tabTable, attenceGather },
  data () {
    return {
      mainLoading: false,
      dateRange: [],
      carouselLength: 1,
      formData: { // 请求参数
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        communityAdminName: '',
        type: '',
        startTime: '',
        endTime: '',
        page: 1,
        size: 5,
        total: 0
      },
      hasShow: {},
      attenceType: '',
      dataList: [], // 主列表
      sliceArray: [],
      adminList: [],
      communityList: [], // 社区列表
      remarkInfo: {
        visible: false,
        infoObj: {}
      }
    }
  },
  created () {
    // this.getList()
  },
  computed: {
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.topButton = !btnList.download ? null : true
      return btnList
    },
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    tabClick (e) {
      // this.hasShow[`${e.name}`] = true
      this.hasShow = Object.assign({}, this.hasShow, {
        [`${e.name}`]: true
      })
    }
  }
}
</script>
<style lang="scss" rel="stylesheet/scss">
  .attenceReport {
    .tabPanel{
      min-height: calc(100vh - 260px);
    }

  }
</style>
