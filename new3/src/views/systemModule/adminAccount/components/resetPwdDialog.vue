<!-- 管理员重置密码 -->
<template>
  <v-dialog title="重置密码" class="dialogWrap" :visible="value" width="500px" :before-close="beforeClose" @submit.native.prevent>
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px"  size="small" style="margin-right: 20px" @submit.native.prevent>
      <el-form-item label="新密码" prop="newPwd">
        <el-input size="small" v-model="formData.newPwd"  type="password" placeholder="至少6位数"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="confirmPwd">
        <el-input size="small" v-model="formData.confirmPwd"  type="password" placeholder="至少6位数"></el-input>
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
  name: 'ResetPwdDialog',
  props: {
    value: {
      type: Boolean,
      default: true
    },
    id: { // 要重置的用户的ID
      type: String,
      default: null
    }
  },
  data () {
    let validatePass = (rule, value, callback) => {
      if (this.formData.confirmPwd !== '') {
        this.$refs.ruleForm.validateField('confirmPwd')
      }
      callback()
    }
    let validatePass2 = (rule, value, callback) => {
      if (value !== this.formData.newPwd) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        id: '',
        newPwd: '',
        confirmPwd: ''
      },
      formRules: {
        newPwd: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 8, message: '密码最少为8位数', trigger: 'blur' }, { validator: validatePass, trigger: 'blur' }],
        confirmPwd: [{ required: true, message: '请确认新密码', trigger: 'blur' }, { validator: validatePass2, trigger: 'blur' }]
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
      let res = await this.$post('system/admin/updatePass', this.formData)
      this.saveLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      if (this.id === this.userInfo.id) { // 重置的用户刚好是当前登录的用户
        this.$message.warning('当前登录的账号密码被重置，请重新登录')
        setTimeout(() => {
          this.$store.dispatch('ClearLogout')
          location.reload()
        }, 1500)
        return false
      }
      this.$message.success('重置成功')
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData.id = this.id
      this.formData.newPwd = ''
      this.formData.confirmPwd = ''
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>

<style scoped>

</style>
