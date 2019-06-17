<!-- 小区 - 查看住户 编辑 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}住户`"  :visible="value" width="650px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="120px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="所属小区">
        {{$route.query.name}}
      </el-form-item>
      <el-form-item :label="`${areaType ? '年段' : '楼号'}`" prop="building">
        <el-input v-model="formData.building"></el-input>
      </el-form-item>
      <el-form-item :label="`${areaType ? '班级' : '单元'}`" prop="unit">
        <el-input v-model="formData.unit"></el-input>
      </el-form-item>
      <el-form-item label="门牌号" v-if="areaType === 0" prop="doorNumber">
        <el-input v-model="formData.doorNumber"></el-input>
      </el-form-item>
      <el-form-item label="住户是否入住" prop="joinFlag">
        <el-radio v-model="formData.joinFlag" :label="true">是</el-radio>
        <el-radio v-model="formData.joinFlag" :label="false">否</el-radio>
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
  name: 'communityHouseEditDialog',
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
      areaType: Number(this.$route.query.areaType || 0),
      formData: {
        communityId: this.$route.query.id, // 社区id
        building: '', // 楼号/年级
        unit: '', // 单元/班级
        doorNumber: '', // 门牌号
        joinFlag: true // 0:未入住, 1:已入住
      },
      formRules: {},
      saveLoading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  mounted () {
    this.formRules = {
      building: [{ required: true, message: `请输入${this.areaType ? '年段' : '楼号'}`, trigger: 'blur' }],
      unit: [{ required: true, message: `请选择${this.areaType ? '班级' : '单元'}`, trigger: 'change' }],
      doorNumber: [{ required: true, message: '请选择门牌号', trigger: 'change' }],
      joinFlag: [{ required: true, message: '请选择是否入住', trigger: 'change' }]
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
      let res = await this.$post('user/house/saveOrUpdate', this.formData)
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
      this.formData.id = ''
      this.formData.building = ''
      this.formData.unit = ''
      this.formData.doorNumber = ''
      this.formData.joinFlag = true
      // 编辑
      if (this.type !== 1) {
        this.formData.id = this.infoObj.id
        this.formData.building = this.infoObj.building
        this.formData.unit = this.infoObj.unit
        this.formData.doorNumber = this.infoObj.doorNumber
        this.formData.joinFlag = this.infoObj.joinFlag
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
