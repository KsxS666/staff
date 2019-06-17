<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}`" :visible="value" width="650px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="120px" style="margin-right: 20px" size="small" @submit.native.prevent>
      <areaForm v-model="value" ref="areaForm" :level="2" :showName="true" :formData="formData"/>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'bannerEditDialog',
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
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        local: 2
      },
      formRules: {
        provinceId: [{ required: true, message: '请选择省', trigger: 'change' }],
        cityId: [{ required: true, message: '请选择市', trigger: 'change' }]
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
      let req = Object.assign({}, this.formData, { orgId: this.userInfo.orgId })
      let res = await this.$post('system/matterAreaController/addMatterArea', req)
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
    },
    handlePreviewsucc (res, file, fileList) {
      this.formData.img = res.data[0]
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        local: 2
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
