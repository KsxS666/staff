<template>
  <v-dialog title="修改密码"  :visible="value" :before-close="beforeClose" width="560px">
    <el-form ref="ruleForm" :rules="formRules"  size="small" :model="formData" label-width="120px" style="margin-right: 20px" @submit.native.prevent>

      <el-form-item  label="旧密码" prop="oldPass">
        <el-input size="small" v-model="formData.oldPass" :maxlength="20" type="password" placeholder="请输入" auto-complete="off"> </el-input>
      </el-form-item>
      <el-form-item  label="新密码" prop="newPass">
        <el-input size="small" v-model="formData.newPass" :maxlength="20" type="password" placeholder="请输入" auto-complete="off"> </el-input>
      </el-form-item>
      <el-form-item  label="确认新密码" prop="confirmPassword">
        <el-input size="small" v-model="formData.confirmPassword" :maxlength="20" type="password" placeholder="请输入" auto-complete="off"> </el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary"  @click="onSubmit" :loading="saveLoading">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'ChangePwd',
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  data () {
    let validatePass = (rule, value, callback) => {
      if (this.formData.confirmPassword !== '') {
        this.$refs.ruleForm.validateField('confirmPassword')
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
      saveLoading: false,
      formData: {
        oldPass: '',
        newPass: '',
        confirmPassword: ''
      },
      formRules: {
        oldPass: [{ required: true, message: '请输入旧密码', trigger: 'blur' }],
        newPass: [{ required: true, message: '请输入新密码', trigger: 'blur' }, { min: 8, message: '密码最少为8位数', trigger: 'blur' }, { validator: validatePass, trigger: 'blur' }],
        confirmPassword: [{ required: true, message: '请确认新密码', trigger: 'blur' }, { validator: validatePass2, trigger: 'blur' }]
      }
    }
  },
  methods: {
    // 修改密码
    onSubmit () {
      this.$refs.ruleForm.validate(async valid => {
        if (valid) {
          this.saveLoading = true
          let res = await this.$post('system/admin/updatePass', this.formData)
          this.saveLoading = false
          if (res.code === 0) {
            this.$message.success('修改成功')
            setTimeout(async () => {
              this.$store.dispatch('ClearLogout')
              location.reload()
            }, 1500)
          } else {
            res.msg && this.$message.error(res.msg)
          }
        } else {
          return false
        }
      })
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData.oldPass = ''
      this.formData.newPass = ''
      this.formData.confirmPassword = ''
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>

<style scoped>

</style>
