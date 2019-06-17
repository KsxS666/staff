<!-- 社区- 查看住户- 厨余记录 -->
<template>
  <div  class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="" class="date-box">
        <el-date-picker v-model="formData.timeArr" type="daterange" range-separator="至" start-placeholder="开始日期" value-format="yyyy-MM-dd" end-placeholder="结束日期"> </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-top-info">
      投放户数：{{data.totalCount || 0}}，合格投放次数：{{data.passCount || 0}}，准确率：{{data.percent || 0}}
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="日期" prop="createTime"  align="center"> </el-table-column>
      <el-table-column label="楼号" prop="unit"  align="center"> </el-table-column>
      <el-table-column label="单元号" prop="building"  align="center"> </el-table-column>
      <el-table-column label="门牌号" prop="doorNumber"  align="center"> </el-table-column>
      <el-table-column label="抽检时间" align="center">
        <template slot-scope="scope">
          {{scope.row.createTime && scope.row.createTime.substring(11, 16)}}
        </template>
      </el-table-column>
      <el-table-column label="抽检状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.passFlag === 1">合格</span>
          <span v-if="scope.row.passFlag === 0" class="v-red v-cursor" @click="toShowImg(scope.row)">不合格</span>
          <span v-if="scope.row.passFlag === 2">未投放</span>
        </template>
      </el-table-column>
      <el-table-column label="抽检人" align="center">
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
  name: 'footWasteLaunch',
  components: { imgShowDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        houseId: this.$route.query.id,
        startTime: '',
        endTime: '',
        timeArr: [],
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      data: {},
      imgInfo: {
        visible: false,
        imgUrl: ''
      }
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      reqData.startTime = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[0] : ''
      reqData.endTime = reqData.timeArr && reqData.timeArr.length ? reqData.timeArr[2] : ''
      delete reqData.timeArr
      this.mainLoading = true
      let res = await this.$post('user/foodWaste/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.data = res.data
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
        houseId: this.$route.query.id,
        startTime: '',
        endTime: '',
        timeArr: [],
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
    // 显示不合格的 理由
    toShowImg (item) {
      this.imgInfo.visible = true
      this.imgInfo.imgUrl = item.img
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
