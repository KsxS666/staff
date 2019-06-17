<template>
  <v-dialog title="查看记录" class="dialogWrap" :visible.sync="value" width="50%" :before-close="beforeClose" @submit.native.prevent>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList" height="500px">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="行为" prop="name" align="center">
        <template slot-scope="scope">
          <!-- 0:投放 1积分2浇水 -->
          <span v-if="scope.row.type === 0">投放{{scope.row.weight}}g{{scope.row.putName}}</span>
          <span v-else-if="scope.row.type === 1">预约</span>
          <span v-else>浇水</span>
        </template>
      </el-table-column>
      <el-table-column label="减碳值（g）" prop="energy" align="center"></el-table-column>
      <el-table-column label="时间" prop="createTime" align="center"></el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <div slot="footer" style="text-align: center">
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'cardTaskEditDialog',
  props: {
    value: Boolean,
    userId: {
      type: String,
      default: () => ''
    }
  },
  data () {
    return {
      formData: {
        userId: '',
        page: 1,
        size: 20,
        total: 0
      },
      mainLoading: false,
      dataList: []
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    uploadUrl () {
      return this.$utils.uploadUrl
    }
  },
  methods: {
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('user/energyRecord/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    // 保存
    toSave () {
      this.$refs.ruleForm.validate((valid, validObj) => {
        if (!valid) {
          for (let item in validObj) {
            this.$message.error(validObj[item][0].message)
            return false
          }
          return false
        }
        // 下面是保存
        this.saveData()
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
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    userId (val) {
      this.formData = {
        userId: val,
        page: 1,
        size: 20,
        total: 0
      }
      this.getList()
    }
  }
}
</script>

<style scoped>
</style>
