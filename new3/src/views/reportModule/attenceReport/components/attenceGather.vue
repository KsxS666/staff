<!-- 考勤报表-->
<template>
  <div class="">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <areaSearch ref="areaSearch" isCommunity :level="3" :formData="formData" @change="getCommunityList"/>
      <el-form-item label prop="communityId">
        <el-select filterable clearable placeholder="请选择小区" v-model="formData.communityId" style="width:100%">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.communityAdminName" placeholder="请选择社区管理员">
          <el-option v-for="(item, i) in adminList" :key="i" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label=""> </el-form-item>
      <el-form-item style="width:420px">
        <el-date-picker type="daterange" v-model="dateRange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy/MM/dd" value-format="yyyy-MM-dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" style="justify-content: space-between">
      <div><el-button class="v-button"  v-if="btnVisible.download" type="primary" icon="el-icon-download" plain @click="toDownload">导出报表</el-button></div>
      <div>
        <el-button type="primary" @click="curMonSearch">查看本月</el-button>
        <el-button type="primary" @click="preMonSearch">查看上月</el-button>
      </div>

    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="昵称" align="center" prop="name"></el-table-column>
      <el-table-column label="手机" align="center" prop="phone"></el-table-column>
      <el-table-column label="未打卡统计" align="center" prop="empty"></el-table-column>
      <el-table-column label="迟到统计" align="center" prop="late"></el-table-column>
      <el-table-column label="早退统计" align="center" prop="early"></el-table-column>
      <el-table-column label="时间异常统计" align="center" prop="timeError"></el-table-column>
      <el-table-column label="地点异常统计" align="center" prop="addressError"></el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'attenceGather',
  props: {
    type: {
      type: String,
      default: () => ''
    },
    btnVisible: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      mainLoading: false,
      dateRange: [],
      formData: { // 请求参数
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        communityAdminName: '',
        startTime: '',
        endTime: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      adminList: [],
      communityList: [], // 社区列表
      editInfo: { // 编辑、新增 的数据
        visible: false,
        type: 1, // 1 是 新建  2是修改
        infoObj: {}
      }
    }
  },
  created () {
    this.getList()
    this.getCommunityList()
  },
  mounted () {
    this.getAdminList()
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    // 获取考勤汇总列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      reqData.startTime = this.dateRange[0]
      reqData.endTime = this.dateRange[1]
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('community/communityAdminAttendance/getSummaryPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    // 获取小区列表
    async getCommunityList () { // isShow 是否是回显的
      this.communityList = []
      let req = {
        provinceId: this.formData.provinceId,
        cityId: this.formData.cityId,
        districtId: this.formData.districtId
      }
      let res = await this.$post('community/community/getCommunityList', req)
      if (res.code === 0) {
        this.communityList = res.data
      }
    },
    // 获得社区管理员列表
    async getAdminList () {
      let res = await this.$post('community/communityAdmin/getList')
      if (res.code === 0) {
        this.adminList = res.data.filter(item => {
          return item.username !== 'admin'
        })
      }
    },
    // 获取社区名字
    getCommunityAdminName (val) {
      // console.log(val)
    },
    // 显示 "新增，查看，编辑" 的弹窗
    toShowEditDialog (type, index) { // 1 是 新建  2是修改  3是查看
      this.editInfo.type = type
      let data = null
      if (type !== 1) {
        data = this.dataList[index]
      }
      this.editInfo.visible = true
      this.editInfo.infoObj = data
    },
    curMonSearch () {
      var date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
      const days = this.getCurMonthDayCounts()
      this.dateRange = [`${year}-${month}-01`, `${year}-${month}-${days}`]
      this.getList()
    },
    preMonSearch () {
      var date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
      const days = this.getCurMonthDayCounts(false)
      this.dateRange = [`${year}-${month}-01`, `${year}-${month}-${days}`]
      this.getList()
    },
    // 获取月份天数
    getCurMonthDayCounts (isCur = true) {
      var date = new Date()
      var year = date.getFullYear()
      var month = isCur ? date.getMonth() + 1 : date.getMonth()
      var d = new Date(year, month, 0)
      return d.getDate()
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        communityAdminName: '',
        startTime: '',
        endTime: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.$refs.areaSearch.toResetValue()
      this.dateRange = []
      this.getList()
    },
    // 导出小区
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.adminId = this.userInfo.id
      req.startTime = this.dateRange[0] ? this.dateRange[0] : ''
      req.endTime = this.dateRange[1] ? this.dateRange[1] : ''
      delete req.page
      delete req.size
      delete req.total

      // let url = `${process.env.BASE_API}/community/communityAdminAttendance/exportSummary?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // console.log(url)
      // window.open(url)
      this.$utils.exportFile('community/communityAdminAttendance/exportSummary', req)
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
    }
  }
}
</script>
