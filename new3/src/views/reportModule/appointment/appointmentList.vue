<!-- 预约列表 -->
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
        <el-input type="text" :maxlength="40" placeholder="请输入联系人" v-model="formData.memberName" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入地址" v-model="formData.address" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入接单人员" v-model="formData.communityAdminName" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select type="text" :maxlength="40" placeholder="请选择状态" v-model="formData.stateCode" clearable>
          <el-option label="待确认" :value="0"></el-option>
          <el-option label="待回收" :value="1"></el-option>
          <el-option label="已拒绝" :value="2"></el-option>
          <el-option label="已取消" :value="3"></el-option>
          <el-option label="已完成" :value="4"></el-option>
          <el-option label="已过期" :value="5"></el-option>
        </el-select>
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
      <el-table-column label="联系人" prop="memberName"  align="center"> </el-table-column>
      <el-table-column label="联系电话" prop="phone"  align="center"> </el-table-column>
      <el-table-column label="标题" prop="title"  align="center"> </el-table-column>
      <!--<el-table-column label="类型" prop="typeCodeName"  align="center"> </el-table-column>-->
      <el-table-column label="小区" prop="unitName"  align="center"> </el-table-column>
      <el-table-column label="地址" prop="address"  align="center"> </el-table-column>
      <el-table-column label="接单人员" prop="adminName"  align="center"> </el-table-column>
      <el-table-column label="预约时间" prop="appointmentTime"  align="center" width="200"> </el-table-column>
      <el-table-column label="上门时间" prop="doorTime"  align="center" width="200"> </el-table-column>
      <el-table-column label="接单时间" prop="acceptTime"  align="center" width="156"> </el-table-column>
      <el-table-column label="完成时间" prop="completeTime"  align="center" width="156"> </el-table-column>
      <el-table-column label="状态" prop="stateName"  align="center" width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.stateCode === 0">待确认</span>
          <span v-else-if="scope.row.stateCode === 1">待回收</span>
          <span v-else-if="scope.row.stateCode === 2">已拒绝</span>
          <span v-else-if="scope.row.stateCode === 3">已取消</span>
          <span v-else-if="scope.row.stateCode === 4">已完成</span>
          <span v-else-if="scope.row.stateCode === 5">已过期</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120px" align="center" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <!-- <el-button class="btn" v-if="scope.row.stateCode === 2 && btnVisible.viewDetail" plain size="mini" type="primary" @click="toShowDetail(scope.row)">查看原因</el-button>
          <el-button class="btn" v-if="scope.row.stateCode === 3 && btnVisible.hasCancel" plain size="mini" type="info" disabled>已取消</el-button>
          <el-button class="btn" v-if="scope.row.stateCode === 4 && btnVisible.hasFinish" plain size="mini" type="success" @click="toShowDetail(scope.row)">已完成</el-button> -->
          <el-button class="btn" plain size="mini" type="primary" @click="toShowDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 查看原因 、 已完成 弹窗 -->
    <detailDialog v-model="detailInfo.visible" :info-obj="detailInfo.infoObj" />
  </div>
</template>

<script>
import detailDialog from './components/detailDialog'
export default {
  name: 'appointmentList',
  components: { detailDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        memberName: '',
        address: '',
        communityAdminName: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        stateCode: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      communityList: [], // 小区 列表
      detailInfo: { // 编辑、新增 的数据
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
      if (!btnList) return null
      btnList.tableButton = !btnList.viewDetail && !btnList.hasCancel && !btnList.hasFinish ? null : true
      return btnList
    }
  },
  methods: {
    // 获取用户列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('integral/admin/appointment/getAppointmentPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
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
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        memberName: '',
        address: '',
        communityAdminName: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        stateCode: '',
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
    // 显示 查看原因, 已完成 的弹窗
    toShowDetail (data) {
      this.detailInfo.visible = true
      this.detailInfo.infoObj = data
    },
    // 导出
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.adminId = this.userInfo.id
      delete req.page
      delete req.size
      delete req.total

      // let url = `${process.env.BASE_API}/integral/admin/appointment/export?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('integral/admin/appointment/export', req)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
.btn{
  width: 80px;
}
</style>
