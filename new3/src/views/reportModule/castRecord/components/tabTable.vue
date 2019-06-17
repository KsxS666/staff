<template>
  <div>
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入设备编码" v-model="formData.equipmentCode" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入设备名称" v-model="formData.equipmentName" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <areaSearch ref="areaSearch" isCommunity :level="3" :formData="formData" />
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" v-if="!inspectionStatus && inspectionStatus !== 0">
        <el-select filterable clearable v-model="formData.inspectionStatus" placeholder="请选择状态">
          <el-option label="未巡检" :value="0"></el-option>
          <el-option label="已巡检" :value="1"></el-option>
          <el-option label="已拒绝" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy/MM/dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
      <div class="v-other-btn-list" v-if="btnVisible && btnVisible.download">
        <el-button class="v-button" type="success" icon="el-icon-download" plain @click="toDownload">导出列表</el-button>
      </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList" @sort-change="sortChange">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='用户名' prop="userName"></el-table-column>
      <el-table-column align="center" label='设备编码' prop="equipmentCode"></el-table-column>
      <el-table-column align="center" label='设备名称' prop="equipmentName"></el-table-column>
      <!-- <el-table-column label="设备类型" align="center" prop="equipmentTypeName"></el-table-column> -->
      <el-table-column label="卡号" align="center" prop="cardNo"></el-table-column>
      <el-table-column label="垃圾类型" align="center" prop="typeName"></el-table-column>
      <el-table-column label="巡检状态" align="center" v-if="!inspectionStatus && inspectionStatus !== 0">
        <template slot-scope="scope">
          <span v-if="scope.row.inspectionStatus === 1" class="v-green">已巡检</span>
          <span v-if="scope.row.inspectionStatus === 0" class="v-gray">未巡检</span>
          <span v-if="scope.row.inspectionStatus === 2" class="v-red">已拒绝</span>
        </template>
      </el-table-column>
      <el-table-column label="投递重量（g）" align="center" sortable="custom">
        <template slot-scope="scope">
          {{scope.row.weight}}
        </template>
      </el-table-column>
      <el-table-column label="手机号" align="center" prop="userPhone"></el-table-column>
      <el-table-column label="投递时间" align="center" prop="createTime"></el-table-column>
      <el-table-column label="巡检人" align="center" prop="adminName">
        <template slot-scope="scope" v-if="inspectionStatus === 2 || inspectionStatus === 1 || inspectionStatus === ''">
          {{scope.row.adminName }} - {{scope.row.adminPhone}}
        </template>
        <template v-else>-</template>
      </el-table-column>
      <!-- <el-table-column label="巡检人手机号" align="center" prop="adminPhone" v-if="inspectionStatus === 2 || inspectionStatus === 1 || inspectionStatus === null"></el-table-column> -->
      <el-table-column label="巡检时间" align="center" prop="inspectionTime" v-if="inspectionStatus !== 0"></el-table-column>
      <el-table-column label="地址" align="center" prop="address">
        <template slot-scope="scope">
          {{scope.row.communityName + scope.row.address}}
        </template>
      </el-table-column>
      <el-table-column label="积分" align="center" prop="integral"></el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible && btnVisible.inspect" type="primary" @click="toShowEditDialog(scope.$index)" v-show="scope.row.inspectionStatus === 0">巡检</el-button>
          <el-button v-show="scope.row.inspectionStatus === 2" v-if="btnVisible && btnVisible.resonCheck" type="info" size="mini" @click="toRefuseReasonDialog(scope.$index)" plain>查看原因</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 巡检弹窗 -->
    <inspectDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj"  @success="getList"/>
    <!-- 查看拒绝原因弹窗 -->
    <refuseReason v-model="refuseInfo.visible" :content="refuseInfo.content" @success="getList"/>
  </div>

</template>

<script>
import inspectDialog from './inspectDialog'
import refuseReason from './refuseReason'
export default {
  props: {
    btnVisible: {
      type: Array,
      default: () => []
    },
    inspectionStatus: {
      default: ''
    }
  },
  name: 'tabTable',
  components: { inspectDialog, refuseReason },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        userName: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        equipmentCode: '',
        equipmentName: '',
        equipmentTypeId: '',
        inspectionStatus: this.inspectionStatus,
        orderType: '',
        timeStart: '',
        timeEnd: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      communityList: [],
      dateRange: [],
      importUrl: `${this.$requestBase}/user/user/importExcel`,
      editInfo: { // 编辑、新增 的数据
        visible: false,
        infoObj: {}
      },
      refuseInfo: { // 编辑、新增 的数据
        visible: false,
        content: ''
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.getList()
    this.getCommunityList()
  },
  methods: {
    // 获取投放列表
    async getList () {
      let reqData = Object.assign({}, this.formData, { orgId: this.userInfo.orgId })
      reqData.timeStart = this.dateRange && this.dateRange.length ? this.dateRange[0] : ''
      reqData.timeEnd = this.dateRange && this.dateRange.length ? this.dateRange[1] : ''
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('equipment/equipmentCast/getPage', reqData)
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
    async getOneYear () {
      let date = new Date()
      let lastYear = parseInt(date.getFullYear()) - 1
      let curYear = parseInt(date.getFullYear())
      let mon = new Date().getMonth() + 1 < 10 ? `0${new Date().getMonth() + 1}` : new Date().getMonth() + 1
      let day = new Date().getDate() < 10 ? `0${new Date().getDate()}` : new Date().getDate()
      this.dateRange = [`${lastYear}-${mon}-${day}`, `${curYear}-${mon}-${day}`]
      this.getList()
    },
    sortChange ({ column, prop, order }) {
      console.log(column, prop, order)
      if (order === 'ascending') {
        this.formData.orderType = 0
        this.getList()
      } else if (order === 'descending') {
        this.formData.orderType = 1
        this.getList()
      } else {
        this.formData.orderType = ''
        this.getList()
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
        userName: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        equipmentCode: '',
        equipmentName: '',
        equipmentTypeId: '',
        inspectionStatus: this.inspectionStatus,
        orderType: '',
        timeStart: '',
        timeEnd: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.dateRange = []
      this.$refs.areaSearch.toResetValue()
      this.getList()
    },
    // 导出投放列表
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.adminId = this.userInfo.id
      req.timeStart = this.dateRange && this.dateRange.length ? this.dateRange[0] : ''
      req.timeEnd = this.dateRange && this.dateRange.length ? this.dateRange[1] : ''
      req.inspectionStatus = !this.inspectionStatus && this.inspectionStatus !== 0 ? this.formData.inspectionStatus : ''
      delete req.userId
      delete req.page
      delete req.size
      delete req.total
      // let url = `${process.env.BASE_API}/equipment/equipmentCast/getExport?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('equipment/equipmentCast/getExport', req)
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
    // 显示巡检的弹窗
    toShowEditDialog (index) {
      let data = null
      data = this.dataList[index]
      this.editInfo.visible = true
      this.editInfo.infoObj = data
    },
    // 显示拒绝理由的弹窗
    toRefuseReasonDialog (index) {
      let reason = null
      reason = this.dataList[index].refusedReason
      this.refuseInfo.visible = true
      this.refuseInfo.content = reason
    }
  }
}
</script>

<style>

</style>
