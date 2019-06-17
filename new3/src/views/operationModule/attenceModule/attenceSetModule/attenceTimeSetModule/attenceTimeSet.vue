<!-- 考勤时间设置 -->
<template>
  <div  class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <areaSearch ref="areaSearch" :level="3" :formData="formData" @change="getCommunityList" />
      <el-form-item prop="communityId">
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.topButton">
      <el-button class="v-button" v-if="btnVisible.setTimeAdd" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">新增考勤时间</el-button>
      <el-button class="v-button" v-if="btnVisible.setTimeSetAll" type="info" icon="el-icon-edit" plain @click="isSelect=!isSelect">批量设置考勤时间</el-button>
      <!-- <el-button class="v-button" type="warning" icon="el-icon-edit" plain @click="toShowEditDialog(3)">设置默认时间</el-button> -->
      <el-button v-if="communityIds.length" class="v-button" type="primary" icon="el-icon-check" @click="toShowEditDialog(4)">设置</el-button>
    </div>
    <el-table ref="table" class="v-table" border v-loading="mainLoading" :row-key="getRowKeys" :data="dataList" @selection-change="handleSelectionChange">
      <el-table-column type="selection" v-if="isSelect" reserve-selection></el-table-column>
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="省" prop=""  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.provinceName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="市" prop=""  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.cityName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="区" prop=""  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.districtName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="小区" prop=""  align="center">
        <template slot-scope="scope">
          <span>{{scope.row.communityName}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="考勤时间" prop="cityName"  align="center">
        <template slot-scope="scope">
          <span>上午{{scope.row.amWorkOnTime}} ~ {{scope.row.amWorkOffTime}}</span>
          <span>下午{{scope.row.pmWorkOnTime}} ~ {{scope.row.pmWorkOffTime}}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="操作" width="200px" align="center" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" v-if="btnVisible.setTimeView" @click="toShowEditDialog(2, scope.$index)">查看考勤时间</el-button>
          <el-button plain size="mini" type="danger" v-if="btnVisible.setTimeDelete"  @click="toDelete(scope.row.communityId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <attenceTimeSetEditDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj" :communityIds="communityIds" :type="editInfo.type" @success="getList"/>
  </div>
</template>

<script>
import attenceTimeSetEditDialog from './components/attenceTimeSetEditDialog'
export default {
  name: 'attenceTimeSet',
  components: { attenceTimeSetEditDialog },
  data () {
    return {
      mainLoading: false,
      getRowKeys (row) {
        return row.communityId
      },
      formData: { // 请求参数
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        page: 1,
        size: 20,
        total: 0
      },
      isSelect: false,
      communityList: [],
      communityIds: [],
      dataList: [], // 主列表
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
    // 获得该次级页面的按钮的权限 - 在父级页面中
    this.$store.dispatch('GetBtnIsShow', '/operation/attenceReport/attenceSet')
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.topButton = !btnList.setTimeAdd && !btnList.setTimeSetAll ? null : true
      btnList.tableButton = !btnList.setTimeDelete && !btnList.setTimeView ? null : true
      return btnList
    }
  },
  methods: {
    // 获取考勤规则
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('community/attendanceRule/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
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
        page: 1,
        size: 20,
        total: 0
      }
      this.getList()
    },
    handleSelectionChange (val) {
      console.log(val)
      this.communityIds = val.map(ele => {
        return ele.communityId
      })
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
    // 删除考勤时间
    toDelete (communityId) {
      this.$confirm('确定删除该考勤时间？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('community/attendanceRule/delete', { communityId })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.getList()
            } else {
              this.$message.error(res.msg)
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
  },
  watch: {
    isSelect (newVal) {
      if (newVal === false) {
        this.$refs.table.clearSelection()
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
