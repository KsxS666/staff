<!-- 社区 投放列表 -->
<template>
  <div  class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="" class="date-box">
        <el-date-picker v-model="formData.timeArr" type="daterange" range-separator="至" start-placeholder="开始日期" value-format="yyyy-MM-dd" end-placeholder="结束日期"> </el-date-picker>
      </el-form-item>
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.communityName" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.name"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.download">
      <el-button class="v-button" type="success" icon="el-icon-download" plain @click="downloadInfo.visible = true">按日期导出</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label='日期' prop="dateStr" align="center"> </el-table-column>
      <el-table-column label='社区名称' prop="communityName" align="center"> </el-table-column>
      <el-table-column label='总户数' prop="houseNum" align="center"> </el-table-column>
      <!--<el-table-column align="center" label='实际户数' prop="checkinHouseNum"> </el-table-column>-->
      <el-table-column label='实际户数' prop="bucketNum" align="center"> </el-table-column>
      <el-table-column label='投放户数' prop="lanchHouseNum" align="center"> </el-table-column>
      <el-table-column label='合格户数' prop="passHouseNum" align="center"> </el-table-column>
      <el-table-column label='准确率' prop="passVate" align="center">
        <template slot-scope="scope">
          {{(scope.row.passVate * 100).toFixed(1) }}%
        </template>
      </el-table-column>
      <!--<el-table-column label='参与率' prop="joinRate" align="center">
        <template slot-scope="scope">
          {{(scope.row.joinRate * 100).toFixed(1) }}%
        </template>
      </el-table-column>-->
      <el-table-column label='投放率' prop="lanchRate" align="center">
        <template slot-scope="scope">
          {{(scope.row.lanchRate * 100).toFixed(1) }}%
        </template>
      </el-table-column>
      <el-table-column label='回收桶数' prop="recycleBucketNum" align="center"> </el-table-column>
      <el-table-column label="操作" width="220px" align="center" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible.viewDetail" type="primary" @click="$router.push(`/foodWasteModule/communityLaunchDetail?communityId=${scope.row.communityId}&dateStr=${scope.row.dateStr}&lanchHouseNum=${scope.row.lanchHouseNum}&passHouseNum=${scope.row.passHouseNum}&passVate=${scope.row.passVate}&communityName=${scope.row.communityName}`)">查看详情</el-button>
          <el-button plain size="mini" v-if="btnVisible.changeNum" :disabled="$moment(new Date()).format('YYYY-MM-DD') !== scope.row.dateStr " @click="toShowBarrel(scope.row)">录入桶数</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!--录入桶数 的弹窗-->
    <barrelDialog v-model="editBarrelInfo.visible" :infoObj="editBarrelInfo.infoObj"/>
    <!-- 按日期导出弹窗 -->
    <downloadDialog v-model="downloadInfo.visible" :communityList="communityList"/>
  </div>
</template>

<script>
import barrelDialog from './components/barrelDialog'
import downloadDialog from './components/downloadDialog'
export default {
  name: 'communityLaunchList',
  components: { barrelDialog, downloadDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        communityName: '',
        timeArr: [], // 时间
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      communityList: [], // 小区 列表
      editBarrelInfo: { // 编辑、新增 的数据
        visible: false,
        infoObj: {}
      },
      downloadInfo: { // 按日期导出
        visible: false
      }
    }
  },
  created () {
    this.getList()
    this.getCommunityList()
    let date = '2018-12-24'
    console.log(this.$moment(new Date()).format('YYYY-MM-DD') === date)
    console.log(new Date(date))
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.tableButton = !btnList.viewDetail && !btnList.changeNum ? null : true
      return btnList
    }
  },
  methods: {
    // 获取列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      reqData.startTime = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[0] : ''
      reqData.endTime = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[1] : ''
      delete reqData.timeArr
      this.mainLoading = true
      let res = await this.$post('user/communityLaunch/getReport', reqData, false, 5)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data ? res.data.resultList : []
      this.formData.total = res.data ? res.data.totalNum : 0
    },
    // 获取社区列表 当省市区街道发生变化时， 加载
    async getCommunityList () {
      let res = await this.$post('community/community/getCommunityList')
      if (res.code === 0) {
        this.communityList = res.data
      }
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        communityName: '',
        timeArr: [], // 时间
        page: 1,
        size: 20,
        total: 0
      }
      this.getList()
    },
    // 切换页面 - 页码
    handleCurrentChange (val) {
      this.formData.page = val
      this.getList()
    },
    // 切换页面 - 页size
    handleSizeChange (val) {
      this.formData.page = 1
      this.formData.size = val
      this.getList()
    },
    // 显示桶录入
    toShowBarrel (itemInfo) {
      this.editBarrelInfo.infoObj = itemInfo
      this.editBarrelInfo.visible = true
    },
    // 导出用户
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.adminId = this.userInfo.id
      delete req.page
      delete req.size
      delete req.total

      // let url = `${process.env.BASE_API}/user/communityOverview/exportReport?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('user/communityOverview/exportReport', req)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
