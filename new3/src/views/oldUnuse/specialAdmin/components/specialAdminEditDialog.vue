<!-- 专管员编辑、新建页面 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}专管员`"  :visible="value" width="650px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="100px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="账号" v-show="infoObj"> {{infoObj && infoObj.account}} </el-form-item>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="角色" prop="identity">
        <el-radio v-model="formData.identity" :label="1">组长</el-radio>
        <el-radio v-model="formData.identity" :label="0">组员</el-radio>
      </el-form-item>
      <el-form-item label="所属小区" prop="communityId">
        <el-select filterable clearable v-model="formData.communityId">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"> </el-option>
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
  name: 'specialAdminEditDialog',
  props: {
    value: Boolean,
    type: { // 1 是 新建  2是修改
      type: Number,
      default: 1
    },
    infoObj: { // 表单数据
      type: Object,
      default: () => {}
    },
    communityList: { // 小区列表
      type: Array,
      default: () => []
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
        communityId: '', // 小区id
        identity: 0,
        status: 0
      },
      formRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }, { min: 2, max: 10, message: '最少2位，最多10位', trigger: 'blur' }],
        phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: validatePhone, trigger: 'blur' }],
        communityId: [{ required: true, message: '请选择小区', trigger: 'change' }],
        identity: [{ required: true, message: '请选择角色', trigger: 'change' }]
      },
      saveLoading: false,
      houseList: [] // 楼号、单元、 门牌号 列表
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
      let res = await this.$post('user/specialOfficer/saveOrUpdate', this.formData)
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
    // 显示弹窗时， 重置数据
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        name: '', // 姓名
        phone: '', // 手机号
        communityId: '', // 小区id
        identity: 0,
        status: 0
      }
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          id: this.infoObj.id, // id
          name: this.infoObj.name, // 姓名
          phone: this.infoObj.phone, // 手机号
          communityId: this.infoObj.communityId,
          identity: this.infoObj.identity,
          status: this.infoObj.status
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
