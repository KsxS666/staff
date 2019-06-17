<!-- 检测列表-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label>
        <el-input v-model="formData.equipmentCode" placeholder="请输入设备编码"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-select v-model="formData.checkStatus" clearable placeholder="请选择检查状态">
          <el-option label="检查成功" :value="1"></el-option>
          <el-option label="检查失败" :value="2"></el-option>
        </el-select>
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
      <el-table-column label="设备类型" prop="typeName" align="center"></el-table-column>
      <el-table-column label="检测时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="检查状态" prop="checkStatus" align="center">
        <template slot-scope="scope">
          {{scope.row.checkStatus === 1 ? '成功' : '失败'}}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible && btnVisible.checkResult" type="primary" @click="toShowEditDialog(scope.$index)" >查看检测结果</el-button>
        </template>
      </el-table-column>
    </el-table>
    <checkResultDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj" />
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
import checkResultDialog from './components/checkResultDialog'
export default {
  name: 'equipmentCheckList',
  components: { checkResultDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        equipmentCode: '',
        checkStatus: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      editInfo: {
        visible: false,
        infoObj: null
      }
    }
  },
  created () {
    this.getList()
  },
  computed: {
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.tableButton = !btnList.checkResult ? null : true
      return btnList
    }
  },
  methods: {
    // 获取检测列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('equipment/checkBarrelRecord/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    toShowEditDialog (index) {
      let data = null
      data = this.dataList[index].checkResult
      this.editInfo.visible = true
      this.editInfo.infoObj = this.evil(data)
    },
    evil (fn) {
      var Fn = Function // 一个变量指向Function，防止有些前端编译工具报错
      return new Fn('return ' + fn)()
    },

    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        sourceCode: '',
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
