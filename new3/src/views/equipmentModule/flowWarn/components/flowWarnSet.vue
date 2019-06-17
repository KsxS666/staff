<template>
  <div style="margin: 20px">
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="0px" size="small" @submit.native.prevent>
      <el-form-item prop="flowWarn">
        流量预警：<el-input v-model="formData.flowWarn" style="width: 120px" @input="toSetNumber(formData, 'flowWarn')" v-loading="mainLoading"></el-input>   kb
      </el-form-item>
      <el-form-item>
        <el-button size="small" :loading="saveLoading" @click="toSave">确 定</el-button>
      </el-form-item>
    </el-form>
    <div style="font-size: 16px" class="v-red">提示：剩余流量为多少时就会预警，并进行充值，以防止欠费！</div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      saveLoading: false,
      mainLoading: false,
      formData: {
        flowWarn: ''
      },
      formRules: {
        flowWarn: [{ required: true, message: '请输入流量预警值', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getFlowWarn()
  },
  methods: {
    async getFlowWarn () {
      this.mainLoading = true
      let res = await this.$post('equipment/simCard/getFlowWarn')
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.formData.flowWarn = res.data.flowWarn
    },
    // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
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
      let reqData = Object.assign({}, this.formData)
      let res = await this.$post('equipment/simCard/setFlowWarn', reqData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.$message.success('保存成功！')
      this.getFlowWarn()
    }
  }
}
</script>

<style>

</style>
