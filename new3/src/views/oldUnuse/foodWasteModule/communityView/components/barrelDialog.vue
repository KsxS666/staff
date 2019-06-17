<!-- 录入桶数的弹窗 -->
<template>
  <v-dialog title="修改实际户数" :visible="value" :before-close="beforeClose" width="400px">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="20px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="" prop="bucketNum">
        <el-input v-model="formData.bucketNum" :maxlength="8" @input="toSetNumber(formData, 'bucketNum')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'barrelDialog',
  props: {
    value: Boolean,
    infoObj: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      formData: {
        bucketNum: ''
      },
      formRules: {
        bucketNum: [{ required: true, message: '请输入户数', trigger: 'blur' }]
      },
      saveLoading: false
    }
  },
  methods: {
    // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
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
    // 请求保存
    async saveData () {
      this.saveLoading = true
      let res = await this.$post('user/communityOverview/editBucket', this.formData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('重置成功')
      this.infoObj.bucketTotalNum = this.formData.bucketNum
      // this.$emit('success', true)
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      // 重置数剧
      this.formData.bucketNum = this.infoObj.bucketTotalNum
      this.formData.communityId = this.infoObj.communityId
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
