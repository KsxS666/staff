<!-- 录入桶数的弹窗 -->
<template>
  <v-dialog title="录入今日桶数" :visible="value" :before-close="beforeClose" width="400px">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="20px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="" prop="count">
        <el-input v-model="formData.count" :maxlength="8" @input="toSetNumber(formData, 'count')"></el-input>
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
    const checkNum = (rule, value, callback) => {
      if (value === '0') {
        callback()
        return
      }
      const reg = /^\d*\.{0,1}\d{0,1}$/
      if (!reg.test(value)) {
        return callback(new Error('只能输入数字，整数位3位，小数位1位'))
      } else {
        value = Number(value)
        if (value > 999.9) {
          return callback(new Error('只能输入数字，整数位3位，小数位1位'))
        }
        callback()
      }
    }
    return {
      formData: {
        count: ''
      },
      formRules: {
        count: [{ required: true, message: '请输入桶数', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }]
      },
      saveLoading: false
    }
  },
  methods: {
    // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this, true)
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
      let res = await this.$post('user/communitBarrel/addCommunityBarrel', this.formData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('设置成功')
      this.infoObj.bucketTotalNum = this.formData.count
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
      this.formData.count = this.infoObj.bucketTotalNum
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
