<!-- 管理员重置密码 -->
<template>
  <v-dialog title="重置密码" class="dialogWrap" :visible="value" width="500px" :before-close="beforeClose" @submit.native.prevent>
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px"  size="small" @submit.native.prevent>
      <el-form-item label="新密码" prop="newPass">
        <el-input size="small" v-model="formData.newPass"  type="password" placeholder="至少8位数"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="newPassConfirm">
        <el-input size="small" v-model="formData.newPassConfirm"  type="password" placeholder="至少8位数"></el-input>
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
      if (this.formData.newPassConfirm !== '') {
        this.$refs.ruleForm.validateField('newPassConfirm')
      }
      callback()
    }
    let validatePass2 = (rule, value, callback) => {
      if (value !== this.formData.newPass) {
        callback(new Error('两次输入的密码不一致'))
      } else {
        callback()
      }
    }
    return {
      formData: {
        communityAdminId: '',
        newPass: '',
        newPassConfirm: ''
      },
      formRules: {
        newPass: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 8, message: '密码最少为8位数', trigger: 'blur' }, { validator: validatePass, trigger: 'blur' }],
        newPassConfirm: [{ required: true, message: '请确认新密码', trigger: 'blur' }, { validator: validatePass2, trigger: 'blur' }]
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
      let res = await this.$post('community/communityAdmin/resetPass', this.formData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('重置成功')
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData.communityAdminId = this.id
      this.formData.newPass = ''
      this.formData.newPassConfirm = ''
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>

<style scoped>

</style>
