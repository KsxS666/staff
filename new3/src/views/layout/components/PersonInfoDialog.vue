<!-- 个人信息弹窗 -->
<template>
  <v-dialog title="个人信息" :visible="value" width="650px" :before-close="beforeClose">
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="80px"  size="small" style="margin-right: 20px" @submit.native.prevent>
      <el-form-item label="账号">
        {{formData.username}}
      </el-form-item>
      <el-form-item label="昵称">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="workNo">
        <el-input v-model="formData.workNo"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input  v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="邮箱">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button v-if="userInfo.username !== 'admin'" type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'PersonInfoDialog',
  props: {
    value: {
      type: Boolean,
      default: true
    }
  },
  data () {
    let validatePhone = (rule, value, callback) => {
      if (!this.$utils.checkPhoneNum(value)) {
        callback(new Error('请输入正确的手机号格式'))
        return false
      }
      callback()
    }
    return {
      formData: {
        username: '',
        name: '', // 姓名
        phone: '', // 手机号
        email: '', // 邮箱
        workNo: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        workNo: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机', trigger: 'blur' }, { validator: validatePhone, trigger: 'blur' }]
      },
      saveLoading: false
    }
  },
  created () {},
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    // 获得用户信息
    async getPersonalInfo () {
      // let res = await this.$post('system/admin/loginByToken', {token: this.$store.getters.userInfo.xToken})
      // if (res.code !== 0) {
      //   res.msg && this.$message.error(res.msg)
      //   return false
      // }
      this.formData.username = this.userInfo.username
      this.formData.name = this.userInfo.name
      this.formData.phone = this.userInfo.phone
      this.formData.workNoworkNo = this.userInfo.workNo
      this.formData.id = this.userInfo.id
      this.formData.email = this.userInfo.email
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
      let res = await this.$post('system/admin/saveOrUpdate', this.formData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.$message.success('保存成功')
      this.$store.dispatch('ChangeInfo', this.formData)
      this.beforeClose()
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.getPersonalInfo()
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>

<style scoped>

</style>
