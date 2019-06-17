<!-- 社区投放日详情 -->
<template>
  <div  class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入户号" v-model="formData.doorNumber" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.checkStatus" placeholder="请选择抽检状态">
          <el-option  label="合格" :value="1"></el-option>
          <el-option  label="不合格" :value="0"></el-option>
          <el-option  label="未投放" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-top-info">
      <div class="v-other-btn-list">
        <el-button class="v-button" v-if="btnVisible && btnVisible.detailDownload" type="success" icon="el-icon-download" plain @click="toDownload">导出列表</el-button>
      </div>
      <p>投放户数：{{formData.lanchHouseNum || 0}}，合格投放次数：{{formData.passHouseNum || 0}}，准确率：{{formData.passVate * 100 || 0}}%</p>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label='日期' prop="dateStr" align="center"> </el-table-column>
      <el-table-column label='社区名称' align="center">
        <template>
          {{formData.communityName}}
        </template>
      </el-table-column>
      <el-table-column label='楼号' prop="buildingName" align="center"> </el-table-column>
      <el-table-column label='单元号' prop="unitName" align="center"> </el-table-column>
      <el-table-column label='户号' prop="doorNumber" align="center"> </el-table-column>
      <el-table-column label='抽检时间' prop="checkTime" align="center"> </el-table-column>
      <el-table-column label='抽检状态' align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.checkStatus === 1">合格</span>
          <span v-if="scope.row.checkStatus === 0" class="v-red v-cursor" @click="toShowImg(scope.row)">不合格</span>
          <span v-if="scope.row.checkStatus === 2">未投放</span>
        </template>
      </el-table-column>
      <el-table-column label='抽检人' prop="userName" align="center">
        <template slot-scope="scope">
          {{scope.row.specialAccount}}{{scope.row.userName}}
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 显示不合格的理由的弹窗 -->
    <imgShowDialog v-model="imgInfo.visible" :url="imgInfo.imgUrl"/>
  </div>
</template>

<script>
import imgShowDialog from './components/imgShowDialog'
export default {
  name: 'communityLaunchDetail',
  components: { imgShowDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        communityId: this.$route.query.communityId,
        dateStr: this.$route.query.dateStr,
        lanchHouseNum: this.$route.query.lanchHouseNum,
        passHouseNum: this.$route.query.passHouseNum,
        passVate: this.$route.query.passVate,
        communityName: this.$route.query.communityName,
        doorNumber: '', // 户号
        checkStatus: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      imgInfo: {
        visible: false,
        imgUrl: ''
      }
    }
  },
  created () {
    this.getList()
    // 获得该次级页面的按钮的权限 - 在父级页面中
    this.$store.dispatch('GetBtnIsShow', '/foodWasteModule/communityLaunchList')
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
    // 获取列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      this.mainLoading = true
      let res = await this.$post('user/communityLaunch/getReportDetail', reqData, false, 5)
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
      this.formData.doorNumber = ''
      this.formData.checkStatus = ''
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
    // 显示不合格的 理由
    toShowImg (item) {
      this.imgInfo.visible = true
      this.imgInfo.imgUrl = item.img
    },
    // 导出用户
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.adminId = this.userInfo.id
      delete req.page
      delete req.size
      delete req.total

      // let url = `${process.env.BASE_API}/user/communityLaunch/exportReportDetail?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('user/communityLaunch/exportReportDetail', req)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
