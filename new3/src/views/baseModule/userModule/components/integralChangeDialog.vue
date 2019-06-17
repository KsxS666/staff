<!-- 积分修正弹窗 -->
<template>
  <v-dialog title="积分修正"  :visible="value" width="450px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="80px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="来源" prop="flowType">
        <el-radio v-model="formData.flowType" :label="16">商品兑换</el-radio>
        <el-radio v-model="formData.flowType" :label="17">现金兑换</el-radio>
        <el-radio v-model="formData.flowType" :label="2">系统修正</el-radio>
      </el-form-item>
      <el-form-item label="积分" prop="integral">
        <el-input-number v-model="formData.integral" :max="10000000" label="积分" style="width: 100%"></el-input-number>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :placeholder="placeHolder"></el-input>
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
  name: 'integralChangeDialog',
  props: {
    value: Boolean,
    id: null
  },
  data () {
    // var validateIntegral = (rule, value, callback) => {
    //   if (this.formData.flowType === 16 || this.formData.flowType === 17) {
    //     if (value > 0 || value === 0) {
    //       return callback(new Error('积分不符合规则！'))
    //     }
    //   }
    //   callback()
    // }
    return {
      formData: {
        integral: 0, // 积分
        remark: '', // 备注
        flowType: 16
      },
      formRules: {
        integral: [{ required: true, message: '请输入积分', trigger: 'blur' }],
        flowType: [{ required: true, message: '请选择来源', trigger: 'change' }],
        remark: [{ required: true, message: '请输入备注', trigger: 'blur' }]
      },
      saveLoading: false,
      placeHolder: ''
    }
  },
  methods: {
    // 保存
    toSave () {
      this.$refs.ruleForm.validate((valid, validObj) => {
        if (this.formData.flowType === 16 || this.formData.flowType === 17) {
          if (this.formData.integral === 0 || this.formData.integral > 0) {
            this.$message.error('积分不符合规则，商品兑换和现金兑换的积分应为负值！')
            return false
          }
        }
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
      let res = await this.$post('integral/integralFlow/add', this.formData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }

      this.beforeClose()
      this.$message.success('修正成功')
      this.$emit('success', true)
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    // 显示弹窗时， 重置数据
    value (newValue) {
      if (!newValue) return false
      this.formData.userId = this.id
      this.formData.integral = 0
      this.formData.remark = ''
      this.formData.flowType = 16
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    },
    formData: {
      deep: true,
      immediate: true,
      handler (newValue) {
        if (!newValue) return false
        this.placeHolder = newValue.flowType === 2 ? '' : (newValue.flowType === 16 ? '兑换xxx东西xxx数量。例如：兑换洗洁精1瓶，兑换购物卡2张' : '现金兑换xx元')
      }
    }

  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
