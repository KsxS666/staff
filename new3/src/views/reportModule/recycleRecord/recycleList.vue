<!-- 回收列表 -->
<template>
  <div  class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <areaSearch ref="areaSearch" isCommunity :level="3" :formData="formData" @change="getCommunityList"/>
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.dataSourceCode" placeholder="请选择来源">
          <el-option label="智能设备投放" :value="0"> </el-option>
          <el-option label="预约上门" :value="1"> </el-option>
          <el-option label="积分赠送" :value="2"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" class="date-box">
        <el-date-picker v-model="timeArr" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-top-info">
      <div class="v-other-btn-list" >
        <el-button class="v-button" v-if="btnVisible && btnVisible.download" type="success" icon="el-icon-download" plain @click="toDownload">导出列表</el-button>
      </div>
      <p>总重量：{{dateInfo.totalWeight || 0}}g &nbsp;&nbsp;&nbsp;&nbsp;总个数：{{dateInfo.totalNum || 0}}个 &nbsp;&nbsp;&nbsp;&nbsp;总积分：{{dateInfo.totalIntegral || 0}}分</p>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" prop="memberName"  align="center"> </el-table-column>
      <el-table-column label="回收物类型" prop="regenerantName"  align="center"> </el-table-column>
      <el-table-column label="回收物重量/数量" align="center">
        <template slot-scope="scope">
          <!-- <span v-if="scope.row.dataSourceCode === 1">-</span> -->
          <!-- <span v-else>{{scope.row.weight ? scope.row.weight : 0}}{{scope.row.typeRule===0?'g':'个'}}</span> -->
          <span>{{scope.row.weight ? scope.row.weight : 0}}{{scope.row.typeRule===0?'g':'个'}}</span>
        </template>
      </el-table-column>
      <el-table-column label="回收物来源" prop="dataSource"  align="center"> </el-table-column>
      <el-table-column label="积分" prop="cumulativeIntegral"  align="center" >
        <template slot-scope="scope">
          {{scope.row.price}} 分
        </template>
      </el-table-column>
      <el-table-column label="回收时间" prop="createTime"  align="center" > </el-table-column>
      <el-table-column label="所属小区" prop="communityName"  align="center" > </el-table-column>
      <el-table-column label="城市"  align="center" >
        <template slot-scope="scope">
          {{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.districtName}}
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'recycleList',
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        communityId: '',
        dataSourceCode: '',
        page: 1,
        size: 20,
        total: 0
      },
      timeArr: [],
      dateInfo: {}, // 头部的数据
      dataList: [], // 主列表
      communityList: [] // 小区 列表
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
      reqData.timeStart = this.timeArr && this.timeArr.length ? this.$moment(this.timeArr[0]).format('YYYY-MM-DD') : ''
      reqData.timeEnd = this.timeArr && this.timeArr.length ? this.$moment(this.timeArr[1]).format('YYYY-MM-DD') : ''
      this.mainLoading = true
      let res = await this.$post('integral/regenerant/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.page.resultList || []
      this.dateInfo = res.data
      this.formData.total = res.data.page.totalNum
    },
    // 获取社区列表 当省市区街道发生变化时， 加载
    async getCommunityList () {
      this.formData.communityId = ''
      let req = {
        provinceId: this.formData.provinceId,
        cityId: this.formData.cityId,
        districtId: this.formData.districtId,
        streetId: this.formData.streetId
      }
      let res = await this.$post('community/community/getCommunityList', req)
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
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        communityId: '',
        dataSourceCode: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.timeArr = []
      this.$refs.areaSearch.toResetValue()
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
    // 导出
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.timeStart = this.timeArr && this.timeArr.length ? this.timeArr[0] : ''
      req.timeEnd = this.timeArr && this.timeArr.length ? this.timeArr[1] : ''
      req.adminId = this.userInfo.id
      delete req.page
      delete req.size
      delete req.total

      // let url = `${process.env.BASE_API}/integral/regenerant/export?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('integral/regenerant/export', req)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
