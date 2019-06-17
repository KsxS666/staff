<!-- 查看货到信息-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入货道编号" v-model="formData.name" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入物品名称" v-model="formData.productName" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column align="center" label='序号' type="index" width="68">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='设备名称' prop="integratorName"> </el-table-column>
      <el-table-column align="center" label='货道编号' prop="name"> </el-table-column>
      <el-table-column align="center" label='物品名称' prop="productName"> </el-table-column>
      <el-table-column align="center" label='货道最大商品数' prop="aisleProductCount"> </el-table-column>
      <el-table-column align="center" label='货品商品数' prop="number"> </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'fullList',
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        integratorCode: this.$route.query.code,
        name: '',
        productName: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [] // 主列表
    }
  },
  created () {
    this.getList()
  },
  methods: {
    // 获取货道信息
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('equipment/integrator/getPageByAisle', reqData)
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
