<!-- 非智能设备列表 -->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入设备编码" v-model="formData.equipmentCode" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入设备名称" v-model="formData.equipmentName" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <areaSearch ref="areaSearch" isCommunity :level="4" :formData="formData" @change="getCommunityList"/>
      <el-form-item>
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.add">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加二分类机</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="设备编码" prop="equipmentCode"  align="center"> </el-table-column>
      <el-table-column label="设备名称" prop="equipmentName"  align="center"> </el-table-column>
      <el-table-column label="省市区街道" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.provinceName}}-{{scope.row.cityName}}-{{scope.row.districtName}}-{{scope.row.streetName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属小区" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.communityName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="地址" prop="communityAddress"  align="center"> </el-table-column>
      <el-table-column label="操作" width="120px" align="center">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible && btnVisible.edit" type="primary" @click="toShowEditDialog(2, scope.$index)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 新增 编辑 非智能设备弹窗 -->
    <equipmentNonIntelListEditDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj" :type="editInfo.type"  :communityList="allCommunityList" @success="getList"/>
  </div>
</template>

<script>
import equipmentNonIntelListEditDialog from './components/equipmentNonIntelListEditDialog'
export default {
  name: 'equipmentList',
  components: { equipmentNonIntelListEditDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        equipmentName: '',
        equipmentCode: '',
        typeId: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        communityId: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      communityList: [], // 小区 列表
      allCommunityList: [], // 所有的小区的列表
      editInfo: { // 编辑、新增 的数据
        visible: false,
        type: 1, // 1 是 新建  2是修改
        infoObj: {}
      },
      bareListInfo: { // 桶列表
        visible: false,
        id: null
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
      btnList.topButton = !btnList.userAdd && !btnList.userDeleteMulti && !btnList.userDeleteAll && !btnList.userFileDownload && !btnList.userImport && !btnList.userDownload ? null : true
      btnList.tableButton = !btnList.userEdit && !btnList.userWasteRecode && !btnList.userDelete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取设备列表
    async getList () {
      console.log(this.userInfo)
      let reqData = Object.assign({}, this.formData)
      reqData.orgId = this.userInfo.orgId
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('equipment/equipmentNonIntel/getPage', reqData)
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
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        equipmentName: '',
        equipmentCode: '',
        typeId: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        communityId: '',
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
    // 显示二分类机"新增，查看，编辑" 的弹窗
    toShowEditDialog (type, index) { // 1 是 新建  2是修改  3是查看
      this.editInfo.type = type
      let data = null
      if (type !== 1) {
        data = this.dataList[index]
      }
      this.editInfo.visible = true
      this.editInfo.infoObj = data
    },
    // 显示当前设备桶的弹窗
    toShowBareListDialog (index) {
      let data = null
      data = this.dataList[index]
      this.bareListInfo.visible = true
      this.bareListInfo.infoObj = data
    },
    // 删除二分类机
    toDelete (id) {
      this.$confirm('确定删除该设备？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('equipment/equipment/delete', { id })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.getList()
            } else {
              res.msg && this.$message.error(res.msg)
            }
            done()
          } else {
            done()
          }
        }
      }).then(() => {
        return true
      }).catch(() => {
        return false
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
