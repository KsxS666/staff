<!-- 垃圾袋列表-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入卡号" v-model="formData.cardNumber" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-select filterable clearable v-model="formData.type" placeholder="请选择类型">
          <el-option label="垃圾袋" value="1"></el-option>
          <el-option label="垃圾卷" value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label>
        <el-select filterable clearable v-model="formData.binding" placeholder="请选择绑定状态">
          <el-option label="未绑定" value="0"></el-option>
          <el-option label="已绑定" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.bagImport">
      <el-upload class="upload-demo" :action="importUrl" :show-file-list="false" :on-success="importSuccess" list-type="picture"
      >
        <el-button class="v-button" type="info" icon="el-icon-upload2" plain v-if="btnVisible && btnVisible.bagImport">导入文件</el-button>
      </el-upload>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="卡号" prop="cardNumber" align="center"></el-table-column>
      <el-table-column align="center" label="类型">
        <template slot-scope="scope">
          <span v-if="scope.row.type === 1">垃圾袋</span>
          <span v-else>垃圾卷</span>
        </template>
      </el-table-column>
      <el-table-column label="生成时间" prop="createTime" align="center"></el-table-column>
      <el-table-column align="center" label="是否绑定">
        <template slot-scope="scope">
          <span v-if="scope.row.binding === 1">已绑定</span>
          <span v-else>未绑定</span>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'bagList',
  data () {
    return {
      // importUrl: `${process.env.BASE_API}/system/qrCode/importExcel`,
      importUrl: `${this.$requestBase}/system/qrCode/importExcel`,
      mainLoading: false,
      formData: { // 请求参数
        cardNumber: '',
        type: '',
        binding: '',
        page: 1,
        size: 20,
        total: 0
      },
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
    // 获取垃圾袋列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      reqData.orgId = this.userInfo.orgId
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('system/qrCode/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    // 导入的返回
    importSuccess (res) {
      if (res.code === 0) {
        this.$message.success('导入成功')
        this.getList()
      } else {
        res.msg && this.$message.error(res.msg)
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
        cardNumber: '',
        type: '',
        binding: '',
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
    }
  }
}
</script>
