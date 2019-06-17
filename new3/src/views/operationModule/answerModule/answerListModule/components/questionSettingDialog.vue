<!-- 题目设定 -->
<template>
  <v-dialog title="题目设定" class="dialogWrap" :visible="value" width="400px" :before-close="beforeClose">
    <el-form :rules="formRules" ref="formDataRef" :model="formData" label-position="right" label-width="64px" style="margin-right: 20px" @submit.native.prevent>
      <el-form-item label="" prop="matterNumber">
        每次竞赛题目为
        <el-input size="small" v-model="formData.matterNumber" style="width: 100px"></el-input>
        题
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="beforeClose">取 消</el-button>
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'questionSettingDialog',
  props: {
    value: Boolean,
    matterAreaId: {
      type: String,
      default: ''
    },
    matterCounts: {
      type: Number,
      default: null
    }
  },
  data () {
    const checkNum = (rule, value, callback) => {
      if (Number(value) <= 0) {
        return callback(new Error('请填写大于 0 的数值'))
      }
      if (Number(value) > Number(this.matterCounts)) {
        return callback(new Error(`不可大于总题数${this.matterCounts}`))
      }
      callback()
    }
    return {
      formData: {
        matterNumber: '',
        local: 1
      },
      formRules: {
        matterNumber: [{ required: true, message: '请输入题数', trigger: 'blur' }, { validator: checkNum, trigger: 'blur' }]
      },
      saveLoading: false
    }
  },
  created () {
    this.getDetail()
  },
  methods: {
    // 获得题目设定数
    async getDetail () {
      let res = await this.$post('/system/matterAreaController/getSingleMatterArea', { areaId: this.matterAreaId })
      if (res.code === 0) {
        this.formData.id = this.matterAreaId
        this.formData.title = res.data.title
        this.formData.activeType = res.data.activeType
        this.formData.matterNumber = res.data.matterNumber
        this.formData.oldMatterNumber = res.data.matterNumber
        // this.formData.cityId = res.data.cityId
        // this.formData.provinceId = res.data.provinceId
        this.formData.timeType = res.data.timeType
        this.formData.stateType = res.data.stateType
      }
    },
    // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
    toSave () {
      this.$refs['formDataRef'].validate((valid, validObj) => {
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
    // 保存数据
    async saveData () {
      this.saveLoading = true
      let res = await this.$post('system/matterAreaController/addMatterArea', this.formData)
      this.saveLoading = false
      if (res.code === 0) {
        this.formData.oldMatterNumber = this.formData.matterNumber
        this.$message.success('保存成功')
        this.$emit('success', true)
        this.beforeClose()
      } else {
        res.msg && this.$message.error(res.msg)
      }
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      // 重置数剧
      this.formData.id = this.matterAreaId
      this.formData.matterNumber = this.formData.oldMatterNumber
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
