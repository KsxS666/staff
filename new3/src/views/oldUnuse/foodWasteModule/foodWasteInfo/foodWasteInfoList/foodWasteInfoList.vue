<!-- 厨余垃圾列表 -->
<template>
  <div  class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <areaSearch ref="areaSearch" :level="4" :formData="formData"/>
      <!--<el-form-item label=""> </el-form-item>-->
      <el-form-item label="">
        <el-date-picker v-model="formData.time" type="date" value-format="yyyy-MM-dd" placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.download">
      <el-button class="v-button" type="success" icon="el-icon-download" plain @click="toDownload">导出列表</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="小区名称" prop="communityName"  align="center"> </el-table-column>
      <el-table-column label="省份" prop="provinceName"  align="center"> </el-table-column>
      <el-table-column label="城市" prop="cityName"  align="center"> </el-table-column>
      <el-table-column label="地区" prop="districtName"  align="center"> </el-table-column>
      <el-table-column label="街道" prop="streetName"  align="center"> </el-table-column>
      <el-table-column label="投放总量" prop="weightTotal"  align="center"> </el-table-column>
      <el-table-column label="要求抽检" prop="spotCheckNum"  align="center"> </el-table-column>
      <el-table-column label="当前抽检" prop="currentCheckNum"  align="center"> </el-table-column>
      <el-table-column label="准确率" prop="passPercent"  align="center"> </el-table-column>
      <el-table-column label="操作" width="140px" align="center" v-if="btnVisible && btnVisible.viewDetail">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" @click="$router.push(`/foodWasteModule/foodWasteInfoDetail?communityId=${scope.row.communityId}`)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'foodWasteInfoList',
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        time: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [] // 主列表
    }
  },
  created () {
    this.getList()
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
      let res = await this.$post('community/admin/foodWasteTotal/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        time: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        page: 1,
        size: 20,
        total: 0
      }
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
      req.adminId = this.userInfo.id
      delete req.page
      delete req.size
      delete req.total

      // let url = `${process.env.BASE_API}/community/admin/foodWasteTotal/export?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('community/admin/foodWasteTotal/export', req)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
