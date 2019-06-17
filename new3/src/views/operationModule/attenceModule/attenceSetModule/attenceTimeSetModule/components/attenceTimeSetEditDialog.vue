<!-- 考勤时间设置 -->
<template>
  <v-dialog :title="type === 1 ? '新增考勤时间' : '设置考勤时间'" :visible="value" width="50%" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="120px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <areaForm v-if="type === 1 || type === 2 && infoObj.provinceId" v-model="value" ref="areaForm" :level="3" :formData="formData"  @change="getCommunityList"/>
      <el-form-item v-if="type === 1 || type === 2 && infoObj.provinceId" label="小区" prop="communityId">
        <el-select filterable clearable v-model="formData.communityId">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="上午上班时间" prop="amWorkOnTime">
        <el-time-picker style="margin-bottom:10px;width:100%" v-model="formData.amWorkOnTime" value-format="HH:mm" format="HH:mm" size="medium" placeholder="任意时间点" @change="handleAmWorkOnTimeChange"></el-time-picker>
      </el-form-item>
      <el-form-item label="上午下班时间" prop="amWorkOffTime">
        <el-time-picker style="margin-bottom:10px;width:100%" v-model="formData.amWorkOffTime" value-format="HH:mm" format="HH:mm" size="medium" placeholder="任意时间点"></el-time-picker>
      </el-form-item>
      <el-form-item label="下午上班时间" prop="pmWorkOnTime">
        <el-time-picker style="margin-bottom:10px;width:100%" v-model="formData.pmWorkOnTime" value-format="HH:mm" format="HH:mm" size="medium" placeholder="任意时间点" @change="handlePmWorkOnTimeChange"></el-time-picker>
      </el-form-item>
      <el-form-item label="下午下班时间" prop="pmWorkOffTime">
        <el-time-picker style="margin-bottom:10px;width:100%" v-model="formData.pmWorkOffTime" value-format="HH:mm" format="HH:mm" size="medium" placeholder="任意时间点"></el-time-picker>
      </el-form-item>
      <el-form-item label="上午可打卡时间" prop="amWorkOnCanTime" v-if="formData.amWorkOnTime">
        <el-time-picker :picker-options="{selectableRange: '00:00:00 - '+`${formData.amWorkOnTime}:00`+''}" value-format="HH:mm" format="HH:mm" style="margin-bottom:10px;width:100%" v-model="formData.amWorkOnCanTime" size="medium" placeholder="任意时间点"></el-time-picker>
      </el-form-item>
      <el-form-item label="下午可打卡时间" prop="pmWorkOnCanTime" v-if="formData.pmWorkOnTime">
        <el-time-picker :picker-options="{selectableRange: '00:00:00 - '+`${formData.pmWorkOnTime}:00`+''}" value-format="HH:mm" format="HH:mm" style="margin-bottom:10px;width:100%" v-model="formData.pmWorkOnCanTime" size="medium" placeholder="任意时间点"></el-time-picker>
      </el-form-item>
      <el-form-item class="rule" prop="comeMinute">
        <span class="v-bold title">迟到</span>
        <span>晚于上班时间</span><el-input size="mini" style="width:50px;margin:10px" v-model="formData.comeMinute"></el-input><span>分钟以内上班计入迟到，超过则计入异常</span>
      </el-form-item>
      <el-form-item class="rule" prop="goMinute">
        <span class="v-bold title">早退</span>
        <span>早于下班时间</span><el-input size="mini" style="width:50px;margin:10px" v-model="formData.goMinute"></el-input><span>分钟以内下班计入早退，超过则计入异常</span>

      </el-form-item>

      <div slot="footer">
        <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
        <el-button @click="beforeClose">关 闭</el-button>
      </div>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'attenceTimeSetEditDialog',
  props: {
    value: Boolean,
    type: { // 1 是 新建  2是设置默认
      type: Number,
      default: 1
    },
    infoObj: {
      type: Object,
      default: () => {}
    },
    communityIds: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      formData: {
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        amWorkOnTime: '',
        amWorkOffTime: '',
        pmWorkOnTime: '',
        pmWorkOffTime: '',
        comeMinute: '',
        goMinute: '',
        amWorkOnCanTime: '',
        pmWorkOnCanTime: ''
      },
      dataList: [],
      communityList: [],
      formRules: {
        // communityId: [{ required: true, message: '请选择小区', trigger: 'change' }],
        amWorkOnTime: [{ required: true, message: '请选择上班时间', trigger: 'blur' }],
        amWorkOffTime: [{ required: true, message: '请选择下班时间', trigger: 'blur' }],
        pmWorkOnTime: [{ required: true, message: '请选择上班时间', trigger: 'blur' }],
        pmWorkOffTime: [{ required: true, message: '请选择下班时间', trigger: 'blur' }],
        comeMinute: [{ required: true, message: '请输入', trigger: 'blur' }],
        goMinute: [{ required: true, message: '请输入', trigger: 'blur' }],
        amWorkOnCanTime: [{ required: true, message: '请选择上班打卡时间', trigger: 'blur' }],
        pmWorkOnCanTime: [{ required: true, message: '请选择下班打卡时间', trigger: 'blur' }]

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
    // 获取考勤规则详情
    async getRule (communityId) {
      this.mainLoading = true
      let res = await this.$post('community/attendanceRule/getRule', { communityId })
      this.mainLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.formData = Object.assign({}, res.data)
      // this.formData.amWorkOffTime = res.data.amWorkOffTime
      // this.formData.amWorkOnCanTime = res.data.amWorkOnCanTime
      // this.formData.amWorkOnTime = res.data.amWorkOnTime
      // this.formData.comeMinute = res.data.comeMinute
      // this.formData.goMinute = res.data.goMinute
      // this.formData.pmWorkOffTime = res.data.pmWorkOffTime
      // this.formData.pmWorkOnCanTime = res.data.pmWorkOnCanTime
      // this.formData.pmWorkOnTime = res.data.pmWorkOnTime
      this.formData.communityIds = res.data.communityId
      delete this.formData.communityId
    },
    async getCommunityList (isShow) { // isShow 是否是回显的
      if (!isShow) this.formData.communityId = ''
      this.communityList = []
      if (!this.formData.provinceId || !this.formData.cityId || !this.formData.districtId) {
        return false
      }
      let req = {
        provinceId: this.formData.provinceId,
        cityId: this.formData.cityId,
        districtId: this.formData.districtId
      }
      let res = await this.$post('community/community/getCommunityList', req)
      if (res.code === 0) {
        this.communityList = res.data
      }
    },
    handleAmWorkOnTimeChange (val) {
      if (!val) {
        return
      }
      this.formData.amWorkOnCanTime = `${val.substr(0, 2) === '00' ? `00:00` : (val.substr(0, 2) - 1 < 10 ? `0${val.substr(0, 2) - 1}` : val.substr(0, 2) - 1)}:${val.substr(3, 3)}`
    },
    handlePmWorkOnTimeChange (val) {
      this.formData.pmWorkOnCanTime = `${val.substr(0, 2) === '00' ? `00:00` : (val.substr(0, 2) - 1 < 10 ? `0${val.substr(0, 2) - 1}` : val.substr(0, 2) - 1)}:${val.substr(3, 3)}`
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
      let reqData = Object.assign({}, this.formData)
      let url = this.type === 1 ? 'community/attendanceRule/save' : 'community/attendanceRule/edit'
      let res = await this.$post(url, reqData)
      this.saveLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
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
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        amWorkOnTime: '',
        amWorkOffTime: '',
        pmWorkOnTime: '',
        pmWorkOffTime: '',
        comeMinute: '',
        goMinute: '',
        amWorkOnCanTime: '',
        pmWorkOnCanTime: ''
      }
      // 单条编辑
      if (this.type === 2) {
        this.getRule(this.infoObj.communityId)
      }
      // 多选
      if (this.type === 4) {
        this.formData = {
          provinceId: '',
          cityId: '',
          districtId: '',
          communityIds: this.communityIds.join(','),
          amWorkOnTime: '',
          amWorkOffTime: '',
          pmWorkOnTime: '',
          pmWorkOffTime: '',
          comeMinute: '',
          goMinute: '',
          amWorkOnCanTime: '',
          pmWorkOnCanTime: ''
        }
        this.formData = JSON.parse(JSON.stringify(this.formData))
        this.$nextTick(() => {
          this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        })
      }
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .title{
    margin: 10px;
    font-size: 22px;
  }
</style>
<style>
  .rule .el-form-item__content{
    margin-left: 0!important
  }
</style>
