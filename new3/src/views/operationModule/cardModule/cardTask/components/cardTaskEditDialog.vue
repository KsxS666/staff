<template>
  <v-dialog :title="`${type == 2?'编辑':'新建'}`" class="dialogWrap" :visible.sync="value" width="50%" :before-close="beforeClose" @submit.native.prevent>
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px" size="small" @submit.native.prevent>
      <el-form-item label="类别：" prop="taskType">
        <el-radio v-model="formData.taskType" :label="2">二维码</el-radio>
        <el-radio v-model="formData.taskType" :label="3">芯片卡</el-radio>
      </el-form-item>
      <el-form-item label="类型：" v-if="formData.taskType == 2" prop="type">
        <el-radio v-model="formData.type" :label="1">垃圾袋</el-radio>
        <el-radio v-model="formData.type" :label="2">垃圾卷</el-radio>
      </el-form-item>
      <el-form-item label="数量：" prop="number">
        <el-input v-model="formData.number" placeholder="请输入数量" @input="toSetNumber(formData, 'number')"></el-input>
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
  name: 'cardTaskEditDialog',
  props: {
    value: Boolean,
    type: {
      // 1 是 新建  2是修改
      type: Number,
      default: 1
    },
    infoObj: { // 表单数据
      type: Object,
      default: () => { }
    }
  },
  data () {
    return {
      formData: {
        taskType: '',
        type: '',
        number: ''
      },
      formRules: {
        taskType: [{ required: true, message: '请输入任务名称', trigger: 'change' }],
        type: [{ required: true, message: '请输入类型', trigger: 'change' }],
        number: [{ required: true, message: '请输入数量', trigger: 'blur' }]
      },
      saveLoading: false
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
    // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
    // 请求保存
    async saveData () {
      this.saveLoading = true
      let req = Object.assign({}, this.formData)
      req.orgId = this.userInfo.orgId
      let res = await this.$post('system/cardTask/save', req)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('保存成功！')
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
        taskType: '',
        type: '',
        number: ''
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
