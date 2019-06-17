<!-- 答题 区域的 新增编辑弹窗 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}地区`" :visible="value" width="650px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="120px" style="margin-right: 20px" size="small" @submit.native.prevent>
      <el-form-item label="活动名称" prop="title">
        <el-input v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item label="活动类型" prop="activeType">
        <el-radio v-model="formData.activeType" :label="101">平台活动</el-radio>
        <el-radio v-model="formData.activeType" :label="102">区域活动</el-radio>
      </el-form-item>
      <!-- 选择区域活动时  显示 省 市 选择器 -->
      <areaForm v-model="value" v-show="formData.activeType === 102" :show="formData.activeType === 102" ref="areaForm" :level="2" showName :formData="formData"/>

      <el-form-item label="时间类型" prop="timeType">
        <el-radio v-model="formData.timeType" :label="201">长期</el-radio>
        <el-radio v-model="formData.timeType" :label="202">时间段</el-radio>
      </el-form-item>
      <el-form-item label="时间段选择" v-if="formData.timeType === 202" prop="timeArr">
        <el-date-picker v-model="formData.timeArr" type="daterange" clearable start-placeholder="开始日期" end-placeholder="结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd" :default-time="['00:00:00', '24:00:00']"></el-date-picker>
      </el-form-item>
      <el-form-item label="活动状态" prop="stateType">
        <el-radio v-model="formData.stateType" :label="0">正常</el-radio>
        <el-radio v-model="formData.stateType" :label="1">冻结</el-radio>
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
  name: 'EditDialog',
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
        title: '',
        activeType: 101, // 101--平台活动，102--区域活动
        timeType: 201, // 201--永久，202--临时
        timeArr: [],
        timeStart: '',
        timeEnd: '',
        stateType: 0, //  0-正常，1-冻结
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        local: 1
      },
      formRules: {
        title: [{ required: true, message: '请输入活动名称', trigger: 'blur' }],
        activeType: [{ required: true, message: '请选择活动类型', trigger: 'change' }],
        timeType: [{ required: true, message: '请选择时间类型', trigger: 'change' }],
        stateType: [{ required: true, message: '请选择活动状态', trigger: 'change' }],
        provinceId: [{ required: true, message: '请选择省', trigger: 'change' }],
        cityId: [{ required: true, message: '请选择市', trigger: 'change' }],
        timeArr: [{ required: true, message: '请选择时间段', trigger: 'change' }]
      },
      fileList: [],
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
      req.timeStart = req.timeArr && req.timeArr.length ? req.timeArr[0] : ''
      req.timeEnd = req.timeArr && req.timeArr.length ? req.timeArr[1] : ''
      delete req.timeArr
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
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        title: '',
        activeType: 101,
        timeType: 201,
        timeArr: [],
        timeStart: '',
        timeEnd: '',
        stateType: 0,
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        local: 1
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
