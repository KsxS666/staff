<!-- IC卡列表-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入用户名称" v-model="formData.name" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入卡号" v-model="formData.cardNumber" @keyup.enter.native="toSearch"
        ></el-input>
      </el-form-item>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="请输入手机号" v-model="formData.phone" @keyup.enter.native="toSearch"
        ></el-input>
      </el-form-item>
      <el-form-item label>
        <el-select filterable clearable v-model="formData.binding" placeholder="请选择绑定状态">
          <el-option :value="0" label="未绑定"></el-option>
          <el-option :value="1" label="已绑定"></el-option>
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
      <el-table-column label="用户卡号" prop="cardNumber" align="center"></el-table-column>
      <el-table-column label="制卡时间" prop="createTime" align="center"></el-table-column>
      <el-table-column label="绑定人" prop="name" align="center"></el-table-column>
      <el-table-column label="手机号" prop="phone" align="center"></el-table-column>
      <el-table-column label="绑定时间" prop="bindingTime" align="center"></el-table-column>
      <el-table-column label="绑定状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.binding === 0">未绑定</span>
          <span v-if="scope.row.binding === 1">已绑定</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180px" align="center">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible && btnVisible.cancelBind && scope.row.binding === 1" type="warning" @click="toCancelBind(scope.row.cardNumber)">解绑</el-button>
          <el-button plain size="mini" v-if="btnVisible && btnVisible.delete" type="danger" @click="toDelete(scope.row.cardNumber)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'icardList',
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        cardNumber: '',
        binding: '',
        userId: '',
        name: '',
        phone: '',
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
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      // btnList.topButton = !btnList.userAdd && !btnList.userDeleteMulti && !btnList.userDeleteAll && !btnList.userFileDownload && !btnList.userImport && !btnList.userDownload ? null : true
      btnList.tableButton = !btnList.cancelBind && !btnList.delete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取IC卡列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      reqData.orgId = this.userInfo.orgId
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('system/card/getPage', reqData)
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
        binding: '',
        userId: '',
        name: '',
        phone: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.getList()
    },
    toDelete (cardNumber) {
      this.$confirm('确定删除该卡号？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          console.log(instance)
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('system/card/editCard', { cardNumber })
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
    toCancelBind (cardNumber) {
      this.$confirm('确定解绑？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          console.log(instance)
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '解绑中...'
            let res = await this.$post('system/card/cancelBinging', { cardNumber })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              this.$message.success('解绑成功')
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
