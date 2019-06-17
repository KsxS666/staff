<!-- 积分规则 - 列表 -->
<template>
  <div  class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <areaSearch ref="areaSearch" :level="3" :formData="formData"/>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.topButton">
      <el-button class="v-button" v-if="btnVisible.add" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加规则</el-button>
      <el-button class="v-button" v-if="btnVisible.setDefault" type="warning" icon="el-icon-edit" plain @click="toShowEditDialog(3)">设置默认值</el-button>
      <!-- <el-button class="v-button" v-if="btnVisible.setWaste" type="info" icon="el-icon-setting" plain @click="foodWasteInfo.visible = true">厨余积分</el-button> -->
      <el-button class="v-button" v-if="btnVisible.download" type="success" icon="el-icon-download" plain @click="toDownload">导出规则</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="省份" prop="provinceName"  align="center"> </el-table-column>
      <el-table-column label="城市" prop="cityName"  align="center"> </el-table-column>
      <el-table-column label="地区" prop="districtName" align="center"> </el-table-column>
      <el-table-column label="小区" prop="communityName"  align="center"> </el-table-column>
      <el-table-column label="操作" width="200px" align="center" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" v-if="btnVisible.edit" @click="toShowEditDialog(2, scope.$index)">查看规则</el-button>
          <el-button plain size="mini" type="danger" v-if="btnVisible.delete" @click="toDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 积分规则 新增 编辑 默认 -->
    <ruleEditDialog v-model="editInfo.visible" :type="editInfo.type" :info-obj="editInfo.infoObj" @success="getList"/>
    <!-- 设置厨余积分 -->
    <foodWasteIntegralDialog v-model="foodWasteInfo.visible"/>
  </div>
</template>

<script>
import ruleEditDialog from './components/ruleEditDialog'
import foodWasteIntegralDialog from './components/foodWasteIntegralDialog'
export default {
  name: 'integralRuleList',
  components: { ruleEditDialog, foodWasteIntegralDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        provinceId: '',
        cityId: '',
        districtId: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      editInfo: {
        visible: false,
        type: 1, // 1 是 新建  2是修改
        infoObj: null
      },
      foodWasteInfo: {
        visible: false
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
      btnList.topButton = !btnList.add && !btnList.download && !btnList.setDefault && !btnList.setWaste ? null : true
      btnList.tableButton = !btnList.edit && !btnList.delete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('integral/integralRule/getAreaPage', reqData)
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
        provinceId: '',
        cityId: '',
        districtId: '',
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
    // 显示 "新增，编辑" 的弹窗
    toShowEditDialog (type, index) { // 1 是 新建  2是修改
      this.editInfo.type = type
      let data = null
      if (type !== 1) {
        data = this.dataList[index]
      }
      this.editInfo.visible = true
      this.editInfo.infoObj = data
    },
    // 删除
    toDelete (data) {
      this.$confirm('确定删除该规则？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let req = {
              // id: data.id,
              communityId: data.communityId,
              cityId: data.cityId,
              districtId: data.districtId
            }
            let res = await this.$post('integral/integralRule/delete', req)
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
    },
    // 导出
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.adminId = this.userInfo.id
      delete req.page
      delete req.size
      delete req.total

      // let url = `${process.env.BASE_API}/integral/integralRule/export?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('integral/integralRule/export', req)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
