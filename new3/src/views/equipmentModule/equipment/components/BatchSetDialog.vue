<!-- 批量设置有效范围弹窗 -->
<template>
  <v-dialog title="设置考勤有效范围" class="dialogWrap" :visible.sync="value" width="700px" :before-close="beforeClose" @submit.native.prevent>
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="有效范围(米)：" prop="attendanceDistance">
        <el-input v-model="formData.attendanceDistance" @input="toSetNumber(formData, 'round')"></el-input>
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
  name: 'attenceSetDialog',
  props: {
    value: Boolean,
    infoObj: { // 表单数据
      type: Object,
      default: () => { }
    },
    equipmentIds: { // 全部勾选的设备数组
      type: Array,
      default: () => []
    },
    equipmentProperty: {
      type: Number,
      default: () => 0
    }
  },
  data () {
    return {
      saveLoading: false,
      formData: {
        attendanceDistance: ''
      },
      formRules: {
        attendanceDistance: [{ required: true, message: '请输入有效范围', trigger: 'blur' }]
      }
    }
  },
  created () {},
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
      let reqData = Object.assign({}, this.formData)
      console.log(this.equipmentIds)
      reqData.equipmentIds = this.equipmentIds.join(',')
      reqData.equipmentProperty = this.equipmentProperty
      this.saveLoading = true
      let res = await this.$post('equipment/equipment/setAttendanceDistance', reqData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('保存成功')
      this.$emit('success', this.equipmentProperty)
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) return false
    }
  }
}
</script>
