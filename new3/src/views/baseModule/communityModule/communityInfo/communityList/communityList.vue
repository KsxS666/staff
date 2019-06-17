<!-- 社区列表 -->
<template>
  <div  class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <areaSearch ref="areaSearch" isCommunity :level="4" :formData="formData"/>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入小区名称" v-model="formData.communityName" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.topButton">
      <el-button class="v-button" v-if="btnVisible.add" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加小区</el-button>
      <el-button class="v-button" v-if="btnVisible.download" type="success" icon="el-icon-download" plain @click="toDownload">导出小区</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList"  @sort-change="sortChange">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="小区名称" prop="name"  align="center"> </el-table-column>
      <el-table-column label="所属公司" prop="orgName"  align="center"> </el-table-column>
      <el-table-column label="省市区" align="center">
        <template slot-scope="scope">
          {{scope.row.provinceName}} {{scope.row.cityName}} {{scope.row.districtName}}
        </template>
      </el-table-column>
      <el-table-column label="街道" align="center">
        <template slot-scope="scope">
          {{scope.row.streetName}}
        </template>
      </el-table-column>
      <el-table-column label="小区属性" align="center">
        <template slot-scope="scope">
          {{Number(scope.row.areaType) === 0?'小区':'学校'}}
        </template>
      </el-table-column>
      <el-table-column label="小区总户数" prop="totalHouse"  align="center"  sortable="custom"> </el-table-column>
      <el-table-column label="注册户数" prop="registerHouse"  align="center"  sortable="custom"> </el-table-column>
      <el-table-column label="注册人数" prop="registerUser"  align="center"  sortable="custom"> </el-table-column>
      <el-table-column label="操作" width="300px" align="center" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible.edit" type="primary" @click="toShowEditDialog(2, scope.$index)">编辑</el-button>
          <!-- <el-button plain size="mini" v-if="btnVisible.bindAdmin" type="success" @click="toShowBindDialog(scope.row)">绑定管理员</el-button> -->
          <el-button plain size="mini" v-if="btnVisible.viewUser" type="info" @click="$router.push(`/baseData/communityModule/communityHouse?id=${scope.row.id}&name=${scope.row.name}&areaType=${scope.row.areaType}`)">查看住户</el-button>
          <el-button plain size="mini" v-if="btnVisible.delete" type="danger" @click="toDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData"  :page-sizes="[10, 15, 20]" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <chartView :data-list="dataList" ref="chartRef"/>
    <!-- 新增 编辑 用户弹窗 -->
    <communityEditDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj" :type="editInfo.type" @success="getList"/>
    <!-- 绑定管理员弹窗 -->
    <bindAdminDialog v-model="bindAdminInfo.visible" :infoObj="bindAdminInfo.infoObj"/>
  </div>
</template>

<script>
import communityEditDialog from './components/communityEditDialog'
import bindAdminDialog from './components/bindAdminDialog'
import chartView from './components/chartView'
export default {
  name: 'communityList',
  components: { communityEditDialog, bindAdminDialog, chartView },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        communityName: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        page: 1,
        size: 15,
        total: 0,
        sortType: '' // 0：小区总户数升序 1：小区总户数降序 2：注册户数升序 3：注册户数降序 4：注册人数升序 5：注册人数降序
      },
      dataList: [], // 主列表
      editInfo: { // 编辑、新增 的数据
        visible: false,
        type: 1, // 1 是 新建  2是修改
        infoObj: {}
      },
      bindAdminInfo: { // 绑定管理员的数据
        visible: false,
        infoObj: {}
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
      btnList.topButton = !btnList.add && !btnList.download ? null : true
      btnList.tableButton = !btnList.edit && !btnList.bindAdmin && !btnList.viewUser && !btnList.delete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取用户列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('community/community/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
      this.$nextTick(() => {
        this.$refs.chartRef.initCart()
      })
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        communityName: '',
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
    // 排序
    sortChange ({ column, prop, order }) {
      console.log(column, prop, order)
      // sortType: '' // 0：小区总户数升序 1：小区总户数降序 2：注册户数升序 3：注册户数降序 4：注册人数升序 5：注册人数降序
      // // sortType: 0 // 0：总积分降序；1：总积分升序；2：总重量降序；3：总重量升序
      this.formData.sortType = ''
      if (prop === 'totalHouse' && order === 'ascending') {
        this.formData.sortType = 0
      } else if (prop === 'totalHouse' && order === 'descending') {
        this.formData.sortType = 1
      } else if (prop === 'registerHouse' && order === 'ascending') {
        this.formData.sortType = 2
      } else if (prop === 'registerHouse' && order === 'descending') {
        this.formData.sortType = 3
      } else if (prop === 'registerUser' && order === 'ascending') {
        this.formData.sortType = 4
      } else if (prop === 'registerUser' && order === 'descending') {
        this.formData.sortType = 5
      }
      this.getList()
      // this.$emit('sortList', sortType)
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
    // 删除用户
    toDelete (id) {
      this.$confirm('确定删除该小区？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('community/community/delete', { id })
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
    },
    // 绑定管理员
    toShowBindDialog (data) {
      this.bindAdminInfo.infoObj = data
      this.bindAdminInfo.visible = true
    },
    // 导出小区
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.adminId = this.userInfo.id
      delete req.page
      delete req.size
      delete req.total

      // let url = `${process.env.BASE_API}/community/community/export?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('community/community/export', req)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
