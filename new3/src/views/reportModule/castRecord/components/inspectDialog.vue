<template>
  <v-dialog title="巡检" class="dialogWrap" :visible.sync="value" width="50%" :before-close="beforeClose" @submit.native.prevent>
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px" size="small" @submit.native.prevent>
      <el-form-item label="状态：" prop="stateCode">
        <el-select filterable v-model="formData.stateCode" placeholder="请选择" style="width: 100%">
          <el-option label="通过" :value="1"></el-option>
          <el-option label="不通过" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="formData.stateCode === 2" label="拒绝原因：">
        <el-input type="textarea" v-model="formData.refusedReason"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'inspectDialog',
  props: {
    value: Boolean,
    infoObj: { // 表单数据
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      formData: {
        stateCode: '',
        refusedReason: ''
      },
      formRules: {
        stateCode: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      saveLoading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
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
      let req = Object.assign({}, this.formData, { orgId: this.userInfo.orgId })
      let res = await this.$post('equipment/equipmentCast/inspection', req)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('巡检成功！')
      this.$emit('success', true)
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        id: this.infoObj.id,
        stateCode: this.infoObj.stateCode,
        refusedReason: this.infoObj.refusedReason
      }
      this.formData = JSON.parse(JSON.stringify(this.formData))
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>

<style scoped>
</style>
