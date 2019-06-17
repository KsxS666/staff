<template>
  <div>
    <div style="margin: 30px 0 20px 80px; font-size: 16px" class="v-red">功能说明：减碳值达到某个值树便长大一级，获得一枚勋章，同时勋章等级+1</div>
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="80px" style="margin-right: 20px" size="small" @submit.native.prevent>
      <el-form-item prop="energy">
        达到：<el-input v-model="formData.energy" style="width: 120px" @input="toSetNumber(formData, 'energy')"></el-input> kg树长大一级
      </el-form-item>
      <el-form-item>
        <el-button size="small" :loading="saveLoading" @click="toSave">确 定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'rankSet',
  data () {
    return {
      saveLoading: false,
      formData: {
        energy: ''
      },
      formRules: {
        energy: [{ required: true, message: '请输入能量值', trigger: 'blur' }]
      }
    }
  },
  created () {
    this.getEnergy()
  },
  methods: {
    async getEnergy () {
      let res = await this.$post('system/keyValue/getLevelEnergy')
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.formData.energy = res.data
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
      let res = await this.$post('system/keyValue/saveOrUpdateLevelEnergy', reqData)
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
      this.getEnergy()
    }
  }
}
</script>

<style lang="scss" scoped>
  div{
    margin-bottom: 10px;
  }
  input{
    margin: 10px
  }
</style>
