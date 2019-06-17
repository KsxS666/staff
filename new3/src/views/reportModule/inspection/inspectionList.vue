<!-- 垃圾袋列表-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <areaSearch ref="areaSearch"  isCommunity :level="4" :formData="formData" @change="getCommunityList"/>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入小区名称" v-model="formData.communityName" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入设备名称" v-model="formData.equipmentName" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <!-- <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入桶名称" v-model="formData.barrelName" @keyup.enter.native="toSearch"></el-input>
      </el-form-item> -->
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入巡检人" v-model="formData.adminName" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="设备编码" prop="equipmentCode" align="center"></el-table-column>
      <el-table-column label="设备名称" prop="equipmentName" align="center"></el-table-column>
      <!-- <el-table-column label="桶名称" prop="barrelName" align="center"></el-table-column> -->
      <el-table-column label="省市区" prop="createTime" align="center">
        <template slot-scope="scope">
          {{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.districtName}}
        </template>
      </el-table-column>
      <el-table-column label="所属小区" prop="communityName" align="center"></el-table-column>
      <!-- <el-table-column label="街道" prop="streetName" align="center"></el-table-column> -->
      <el-table-column label="巡检人" prop="adminName" align="center"></el-table-column>
      <el-table-column label="联系电话" prop="adminPhone" align="center"></el-table-column>
      <el-table-column label="巡检状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.inspectionStatus === 1" class="v-green">已巡检</span>
          <span v-if="scope.row.inspectionStatus === 0" class="v-gray">未巡检</span>
          <span v-if="scope.row.inspectionStatus === 2" class="v-red">已拒绝</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150px" align="center" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible.castCheck" type="primary" @click="toShowEditDialog(scope.row.equipmentCode)">查看投放列表</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <castDialog  v-model="editInfo.visible" :equipmentCode="editInfo.equipmentCode" />
  </div>
</template>

<script>
import castDialog from './components/castDialog'
export default {
  name: 'inspectionList',
  components: { castDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        equipmentName: '',
        provinceId: '',
        cityId: '',
        barrelName: '',
        districtId: '',
        streetId: '',
        communityName: '',
        adminName: '',
        page: 1,
        size: 20,
        total: 0
      },
      communityList: [],
      allCommunityList: [],
      dataList: [], // 主列表
      editInfo: {
        visible: false,
        equipmentCode: ''
      }
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
      if (!btnList) return null
      btnList.tableButton = !btnList.castCheck && !btnList.resonCheck ? null : true
      return btnList
    }
  },
  methods: {
    // 获取满桶列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('equipment/equipmentCast/getInspection', reqData)
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
        if (!this.allCommunityList.length) {
          this.allCommunityList = res.data
        }
      }
    },
    toShowEditDialog (equipmentCode) {
      this.editInfo.visible = true
      this.editInfo.equipmentCode = equipmentCode
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        cardNumber: '',
        type: '',
        binding: '',
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
    }
  }
}
</script>
