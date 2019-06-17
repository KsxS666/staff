<!-- 机构编辑、查看、新建页面 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}机构`" class="dialogWrap" :visible="value" width="650px" :before-close="beforeClose">
    <el-form  class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="80px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="上级机构" v-if="type === 4"> {{formData.parentName}} </el-form-item>
      <el-form-item label="名称" prop="name">
        <el-input size="small" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="手机" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="类别" prop="type" v-if="formData.type === 1">
        <el-radio v-model="formData.type" :label="1">公司</el-radio>
      </el-form-item>
      <el-form-item label="类别" prop="type" v-else>
        <el-radio v-model="formData.type" :label="2" v-if="infoObj.type !== 3">部门</el-radio>
        <!--// 父级是 部门 == > 添加第三级  不用显示区域 -->
        <el-radio v-model="formData.type" :label="3" v-if="infoObj.type !== 2">区域</el-radio>
      </el-form-item>
      <!-- <AreaForm v-if="formData.type === 3" :formData="formData" :value="value"/> -->
      <AreaForm ref="areaForm" :infoObj="infoObj" v-if="formData.type === 3" v-model="value" />
      <el-form-item label="邮箱">
        <el-input v-model="formData.email"></el-input>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input type="textarea" v-model="formData.address"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
import AreaForm from './areaForm'
export default {
  name: 'orgEditDialog',
  components: { AreaForm },
  props: {
    value: Boolean,
    type: { // 1 是 新建  2是修改  4是添加下级
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
      if (value === '') {
        callback()
        return true
      }
      if (!this.$utils.checkPhoneNum(value)) {
        callback(new Error('请输入正确的手机号格式'))
        return false
      }
      callback()
    }
    return {
      mainLoading: false,
      saveLoading: false,
      formData: {
        parentId: '', // 父级菜单ID
        parentName: '', // 父级菜单name
        name: '', // 名称
        phone: '', // 手机
        type: 1, // 1-公司 2-部门 3-区域
        email: '', // 邮箱
        address: '', // 地址
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        provinceId: [{ required: true, message: '请选择省份', trigger: 'change' }],
        type: [{ required: true, message: '请选择类别', trigger: 'change' }],
        phone: [{ validator: validatePhone, trigger: 'blur' }]
        // provinceId: [{ required: true, message: '请选择省', trigger: 'change' }]
      }
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
        // this.saveData()
        if (this.type === 3) {
          let areaObj = this.$refs.areaForm.getAllCheck().areaObj
          this.saveData(areaObj)
        }
        this.saveData()
      })
    },
    // 请求保存
    async saveData (data = {}) {
      if (this.type === 3) {
        this.formData.provinceId = data.provinceIds.join(',')
        this.formData.cityId = data.cityIds.join(',')
      }
      this.saveLoading = true
      let res = await this.$post('system/organization/saveOrUpdate', this.formData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.$message.success('保存成功')
      this.$emit('success', true)
      this.beforeClose()
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    // 监听是否显示弹窗--> 进行表单数据处理
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        parentId: '', // 父级菜单ID
        parentName: '', // 父级菜单name
        name: '', // 名称
        phone: '', // 手机
        type: 1, // 1-公司 2-部门 3-区域
        email: '', // 邮箱
        address: '', // 地址
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        isBinding: false
      }
      // // 1 是 新建  2是修改  4是添加下级
      if (this.type === 2) {
        // this.formData.parentId = this.infoObj.id
        // this.formData.parentName = this.infoObj.name
        this.formData.id = this.infoObj.id
        this.formData.name = this.infoObj.name
        this.formData.phone = this.infoObj.phone
        this.formData.type = this.infoObj.type
        this.formData.email = this.infoObj.email
        this.formData.address = this.infoObj.address
        if (this.infoObj.type === 3) { // 区域类型
          this.formData.parentId = this.infoObj.parentId
          this.formData.provinceId = this.infoObj.provinceId
          this.formData.cityId = this.infoObj.cityId
          this.formData.districtId = this.infoObj.districtId
          this.formData.streetId = this.infoObj.streetId
        }
      }
      if (this.type === 4) {
        this.formData.parentId = this.infoObj.id
        this.formData.parentName = this.infoObj.name
        this.formData.type = 2
        // if (this.infoObj.type === 2) { // 父级是 部门 == > 添加第三级
        //
        // }
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
