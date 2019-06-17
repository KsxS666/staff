<!-- 管理员编辑、新建页面 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}管理员`"  :visible="value" width="650px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="80px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="账号" prop="username">
        <el-input  v-if="type === 1" v-model="formData.username"></el-input>
        <span v-else>{{formData.username}}</span>
      </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password" v-if="type === 1">
        <el-input v-model="formData.password" :maxlength="20" type="password" placeholder="至少8位数"></el-input>
      </el-form-item>
      <el-form-item label="工号" prop="workNo">
        <el-input v-model="formData.workNo"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="公司" v-if="userInfo.username === 'admin'">
        <!--<el-input v-model="formData.orgId"></el-input>-->
        <el-select filterable clearable v-model="formData.orgId">
          <el-option v-for="(item, i) in orgList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
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
        workNo: '', // 工号
        name: '', // 姓名
        phone: '', // 手机号
        username: '', // 用户名
        password: '', // 密码
        orgId: ''
        // organizationIds: '' // 机构id集合
      },
      formRules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        workNo: [{ required: true, message: '请输入工号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }, { min: 8, message: '密码最少为8位数', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: validatePhone, trigger: 'blur' }]
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
    this.getOrgList()
  },
  methods: {
    // 获得公司列表
    async getOrgList () {
      let res = await this.$post('system/organization/getListByParentId')
      if (res.code === 0) {
        this.orgList = res.data
      }
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

      this.beforeClose()
      if (this.formData.id && this.formData.id === this.userInfo.id) { // 修改的用户刚好是当前登录的用户
        this.$store.dispatch('ChangeInfo', this.formData)
      }
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
        workNo: '', // 工号
        name: '', // 姓名
        phone: '', // 手机号
        username: '', // 用户名
        password: '', // 密码
        orgId: ''
        // organizationIds: '' // 机构id集合
      }
      if (this.type !== 1) {
        this.formData = {
          id: this.infoObj.id, // id
          workNo: this.infoObj.workNo, // 工号
          name: this.infoObj.name, // 姓名
          phone: this.infoObj.phone, // 手机号
          username: this.infoObj.username, // 用户名
          password: this.infoObj.password, // 密码
          orgId: this.infoObj.orgId
          // organizationIds: this.infoObj.organizationIds
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
