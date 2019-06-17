<!-- 社区总览表 -->
<template>
  <div  class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
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
    <div class="v-top-info">
      <div class="v-other-btn-list">
        <el-button class="v-button" v-if="btnVisible && btnVisible.download" type="success" icon="el-icon-download" plain @click="toDownload">导出列表</el-button>
      </div>
      <p>一共有{{formData.total}}个小区</p>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label='社区名称' prop="communityName" align="center"> </el-table-column>
      <el-table-column label='省市区' prop="provincialCityRegionName" align="center"> </el-table-column>
      <el-table-column label='街道' prop="streetName" align="center"> </el-table-column>
      <el-table-column label='累积投放桶数（240L）' prop="bucketBigTotalNum" align="center"> </el-table-column>
      <el-table-column label='累积检查数' prop="checkTotalNum" align="center"> </el-table-column>
      <el-table-column label='总户数' prop="houseTotalNum" align="center"> </el-table-column>
      <!--<el-table-column align="center" label='实际户数' prop="houseJoinTotalNum"> </el-table-column>-->
      <el-table-column label='参与率' prop="joinRateStr" align="center">
        <template slot-scope="scope">
          {{(scope.row.joinRate*100).toFixed(1)}}%
        </template>
      </el-table-column>
      <el-table-column label='准确率' prop="passRateStr" align="center">
        <template slot-scope="scope">
          {{(scope.row.passRate*100).toFixed(1)}}%
        </template>
      </el-table-column>
      <el-table-column label='日投放率' prop="lanchRateStr" align="center">
        <template slot-scope="scope">
          {{(scope.row.lanchRate*100).toFixed(1)}}%
        </template>
      </el-table-column>
      <el-table-column label='实际户数' prop="bucketTotalNum" align="center"> </el-table-column>

      <el-table-column label="操作" width="140px" align="center" v-if="btnVisible && btnVisible.changeNum">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" @click="toShowBarrel(scope.row)">修改实际户数</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!--修改桶数 实际户数 的弹窗-->
    <barrelDialog v-model="editBarrelInfo.visible" :infoObj="editBarrelInfo.infoObj"/>
  </div>
</template>

<script>
import barrelDialog from './components/barrelDialog'
export default {
  name: 'communityViewList',
  components: { barrelDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        communityName: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      communityList: [], // 小区 列表
      editBarrelInfo: { // 编辑、新增 的数据
        visible: false,
        infoObj: {}
      }
    }
  },
  created () {
    this.getList()
    this.getCommunityList()
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      return btnList
    }
  },
  methods: {
    // 获取用户列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('user/communityOverview/getReport', reqData, false, 5)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
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
