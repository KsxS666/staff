<!-- 管理员编辑、新建页面 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}小区管理员`"  :visible="value" width="650px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="80px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="账号" prop="username">
        <el-input  v-if="type === 1" v-model="formData.username"></el-input>
        <span v-else>{{formData.username}}</span>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="type === 1">
        <el-input v-model="formData.password" :maxlength="20" type="password" placeholder="至少8位数"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="昵称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="identity">
        <el-radio v-model="formData.identity" :label="0">督导员</el-radio>
        <el-radio v-model="formData.identity" :label="1">管理员</el-radio>
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
  name: 'AdminEditDialog',
  props: {
    value: Boolean,
    type: { // 1 是 新建  2是修改  3是查看
      type: Number,
      default: 1
    },
    infoObj: { // 表单数据
      type: Object,
      default: () => {}
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
        name: '', // 姓名
        phone: '', // 手机号
        username: '', // 用户名
        password: '', // 密码
        identity: 0 // 角色
      },
      formRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 8, message: '密码最少为8位数', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: validatePhone, trigger: 'blur' }],
        identity: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      saveLoading: false,
      orgList: [] // 公司列表
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
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
      let res = await this.$post('community/communityAdmin/saveOrUpdate', this.formData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }

      this.beforeClose()
      this.$message.success('保存成功')
      this.$emit('success', true)
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        name: '', // 姓名
        phone: '', // 手机号
        username: '', // 用户名
        password: '', // 密码
        identity: 0
      }
      if (this.type !== 1) {
        this.formData = {
          id: this.infoObj.id, // id
          name: this.infoObj.name,
          phone: this.infoObj.phone,
          username: this.infoObj.username,
          identity: this.infoObj.identity
        }
      }
      this.formData = JSON.parse(JSON.stringify(this.formData))
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>

<style lang="scss" scoped rel="stylesheet/scss">

</style>
