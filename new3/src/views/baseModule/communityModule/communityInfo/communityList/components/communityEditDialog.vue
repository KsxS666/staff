<!-- 小区编辑 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}小区`"  :visible="value" width="650px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="120px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="小区名称" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <areaForm v-model="value" ref="areaForm" :level="4" :formData="formData"/>
      <el-form-item label="小区属性">
        <el-radio v-model="formData.areaType" :label="0">小区</el-radio>
        <el-radio v-model="formData.areaType" :label="1">学校</el-radio>
      </el-form-item>
      <el-form-item label="社区名称">
        <el-input v-model="formData.tribe"></el-input>
      </el-form-item>
      <el-form-item label="月领取袋子数">
        <el-input v-model="formData.rollNumber" :maxlength="8" @input="toSetNumber(formData, 'rollNumber')"></el-input>
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
  name: 'communityEditDialog',
  props: {
    value: Boolean,
    type: { // 1 是 新建  2是修改
      type: Number,
      default: 1
    },
    infoObj: { // 表单数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      formData: {
        name: '', // 小区名
        areaType: 0, // 小区属性  0 小区 1 学校
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        tribe: '', // 社区名称
        rollNumber: '' // 月领取袋子数
      },
      formRules: {
        name: [{ required: true, message: '请输入小区名称', trigger: 'blur' }],
        provinceId: [{ required: true, message: '请选择省', trigger: 'change' }],
        cityId: [{ required: true, message: '请选择市', trigger: 'change' }],
        districtId: [{ required: true, message: '请选择区', trigger: 'change' }],
        streetId: [{ required: true, message: '请选择街道', trigger: 'change' }]
      },
      saveLoading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  mounted () {
  },
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
      this.saveLoading = true
      let res = await this.$post('community/community/saveOrUpdate', this.formData)
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
        name: '', // 小区名
        areaType: 0, // 小区属性  0 小区 1 学校
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        tribe: '', // 社区名称
        rollNumber: '' // 月领取袋子数
      }
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          id: this.infoObj.id, // id
          name: this.infoObj.name,
          areaType: this.infoObj.areaType,
          provinceId: this.infoObj.provinceId,
          cityId: this.infoObj.cityId,
          districtId: this.infoObj.districtId,
          streetId: this.infoObj.streetId,
          tribe: this.infoObj.tribe,
          rollNumber: this.infoObj.rollNumber
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

<style scoped lang="scss" rel="stylesheet/scss">

</style>
