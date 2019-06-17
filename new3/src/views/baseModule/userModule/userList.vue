<!-- 社区管理 - 用户列表 -->
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
        <el-input type="text" clearable :maxlength="40" placeholder="请输入地址" v-model="formData.address" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label=""> </el-form-item>
      <el-form-item label=""> </el-form-item>
      <el-form-item label="">
        <el-input type="text" clearable :maxlength="40" placeholder="请输入手机号" v-model="formData.phone" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="text" clearable :maxlength="40" placeholder="请输入姓名" v-model="formData.name" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.topButton">
      <el-button class="v-button" v-if="btnVisible.add" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加用户</el-button>
      <el-button class="v-button" v-if="btnVisible.userFileDownload" type="warning" icon="el-icon-download" plain @click="toDownloadFile">下载导入模板</el-button>
      <el-button class="v-button" v-if="btnVisible.userImport" type="info" icon="el-icon-upload2" plain @click="toShowInsertDialog()">批量导入文件</el-button>
      <el-button class="v-button" v-if="btnVisible.userDownload" type="success" icon="el-icon-download" plain @click="toDownload">导出用户</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="name"  align="center"></el-table-column>
      <el-table-column label="手机" prop="phone"  align="center"></el-table-column>
      <el-table-column label="所属公司" prop="orgName"  align="center"> </el-table-column>
      <el-table-column label="省市区街道" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.house">{{scope.row.house.provinceName}}{{scope.row.house.cityName}}{{scope.row.house.districtName}}{{scope.row.house.streetName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属小区" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.house">{{scope.row.house.communityName}}</span>
        </template>
      </el-table-column>
      <el-table-column label="详细地址" prop="address"  align="center"> </el-table-column>
      <el-table-column label="注册时间" prop="registerTime"  align="center"> </el-table-column>
      <el-table-column label="累积积分" prop="cumulativeIntegral"  align="center" width="80"> </el-table-column>
      <el-table-column label="可用积分" prop="integral"  align="center" width="80"> </el-table-column>
      <el-table-column label="投递总量(g)" prop="weight"  align="center" width="100"> </el-table-column>
      <el-table-column label="投递次数(智能设备)" prop="intelligenceCount"  align="center" width="80"> </el-table-column>
      <el-table-column label="投递次数(非智能设备)" prop="nonIntelligenceCount"  align="center" width="80"> </el-table-column>
      <el-table-column label="操作" width="500px" align="center" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <el-button plain size="mini" type="primary" v-if="btnVisible.edit" @click="toShowEditDialog(2, scope.$index)">编辑</el-button>
          <el-button plain size="mini" type="success" v-if="btnVisible.integralChange" @click="toShowIntegralDialog(scope.row.id)">积分修正</el-button>
          <el-button plain size="mini" type="info" v-if="btnVisible.integralDetail" @click="$router.push(`/reportModule/integralRecord/integralList?memberId=${scope.row.id}&memberName=${scope.row.name}`)">积分明细</el-button>
          <el-button plain size="mini" type="" v-if="btnVisible.resetPassword" @click="toResetPwd(scope.row.id)">重置密码</el-button>
          <el-button plain size="mini" type="success" v-if="btnVisible.stopOrOpen && scope.row.status === 1" @click="toStop(scope.row, 0)">启用</el-button>
          <el-button plain size="mini" type="warning" v-else-if="btnVisible.stopOrOpen" @click="toStop(scope.row, 1)">禁用</el-button>
          <el-button plain size="mini" type="danger" v-if="btnVisible.delete" @click="toDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 新增 编辑 用户弹窗 -->
    <userEditDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj" :type="editInfo.type" :communityList="allCommunityList" @success="getList"/>
    <!-- 积分修正弹窗 -->
    <integralChangeDialog v-model="integralInfo.visible" :id="integralInfo.id" @success="getList"/>
    <!-- 重置密码弹窗 -->
    <resetPwdDialog v-model="resetPwd.visible" :id="resetPwd.id"/>
    <!-- 用户导入弹窗 -->
    <insertDialog v-model="insertVisible" />
  </div>
</template>

<script>
import userEditDialog from './components/userEditDialog'
import integralChangeDialog from './components/integralChangeDialog'
import resetPwdDialog from './components/resetPwdDialog'
import insertDialog from './components/insertDialog'
export default {
  name: 'userList',
  components: { userEditDialog, integralChangeDialog, resetPwdDialog, insertDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        address: '',
        phone: '',
        name: '',
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
      integralInfo: { // 积分修正的数据
        visible: false,
        id: null
      },
      insertVisible: false,
      resetPwd: { // 重置密码的数据
        visible: false,
        id: null
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
      btnList.topButton = !btnList.add && !btnList.userFileDownload && !btnList.userImport && !btnList.userDownload ? null : true
      btnList.tableButton = !btnList.edit && !btnList.delete && !btnList.integralChange && !btnList.integralDetail && !btnList.resetPassword && !btnList.stopOrOpen ? null : true
      return btnList
    }
  },
  methods: {
    // 获取用户列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('user/user/getPage', reqData)
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
        phone: '',
        name: '',
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
    // 显示导入用户弹窗
    toShowInsertDialog () {
      this.insertVisible = true
    },
    // 删除用户
    toDelete (id) {
      this.$confirm('确定删除该用户？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('user/user/delete', { id })
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
    // 禁用 / 启用 用户
    toStop (row, status) {
      let text = status ? '禁用' : '启用'
      this.$confirm(`确定${text}该用户？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '提交中...'
            let res = await this.$post('user/user/saveOrUpdate', { id: row.id, status })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              row.status = status
              // this.$message.success('成功')
              // this.getList()
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
    // 积分修正
    toShowIntegralDialog (id) {
      this.integralInfo.id = id
      this.integralInfo.visible = true
    },
    // 重置密码
    toResetPwd (id) {
      this.resetPwd.id = id
      this.resetPwd.visible = true
    },
    // 批量导入的返回
    importSuccess (res) {
      if (res.code === 0) {
        this.$message.success('导入成功')
      } else {
        res.msg && this.$message.error(res.msg)
      }
    },
    // 导出用户
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.adminId = this.userInfo.id
      delete req.page
      delete req.size
      delete req.total

      // let url = `${process.env.BASE_API}/user/user/export?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('user/user/export', req)
    },
    // 下载导入模板
    toDownloadFile () {
      window.open('http://ajwl-file.oss-cn-shenzhen.aliyuncs.com/%E7%94%A8%E6%88%B7%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xls')
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
