<!-- 设置厨余积分 -->
<template>
  <v-dialog title="设定厨余积分" :visible="value" :before-close="beforeClose" width="400px">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="20px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="" prop="typeValue">
        <el-input v-model="formData.typeValue" :maxlength="8" @input="toSetNumber(formData, 'typeValue')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" >
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'foodWasteIntegralDialog',
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
        // integralFlag: 2,
        typeValue: ''
        // typeId: 'foodWaste',
        // typeName: '厨余垃圾',
        // unitValue: '1'
      },
      formRules: {
        typeValue: [{ required: true, message: '请输入积分', trigger: 'blur' }]
      },
      saveLoading: false
    }
  },
  methods: {
    async getIntegral () {
      let res = await this.$post('integral/integralRule/getList', { integralFlag: 2 })
      if (res.code === 0) {
        if (!res.data || !res.data.length) { // 之前没有创建过的
          this.formData.integralValue = ''
        } else {
          this.formData.id = res.data[0].id
          this.formData.typeValue = res.data[0].typeValue
          this.formData.oldIntegralValue = res.data[0].integralValue
        }
      }
    },
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
      let res = await this.$post('integral/integralRule/setFoodWasteRule', this.formData)
      this.saveLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('设置成功')
      this.formData.oldIntegralValue = this.formData.integralValue
      // this.$emit('success', true)
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      // 获得积分
      if (this.formData.id) {
        this.formData.integralValue = this.formData.oldIntegralValue
      } else {
        this.getIntegral()
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
