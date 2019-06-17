<!-- 打卡异常规则设置弹窗 -->
<template>
  <v-dialog title="设置打卡异常规则"  :visible="value" width="35%" :before-close="beforeClose">
    <div class="v-text-center">
      <span class="v-bold title">迟到</span>
      <span>晚于上班时间</span><el-input size="mini" style="width:50px;margin:10px"></el-input><span>分钟以内上班计入迟到，超过则计入异常</span>
    </div>
    <div class="v-text-center">
      <span class="v-bold title">早退</span>
      <span>早于下班时间</span><el-input size="mini" style="width:50px;margin:10px"></el-input><span>分钟以内下班计入早退，超过则计入异常</span>
    </div>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'attenceSetRuleDialog',
  props: {
    value: Boolean,
    type: { // 1 是 新建  2是设置默认
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
        times: 2, // 每日次数，
        round: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: ''
      },
      location: '',
      adminList: [],
      formRules: {
        provinceId: [{ required: true, message: '请选择省', trigger: 'change' }],
        cityId: [{ required: true, message: '请选择市', trigger: 'change' }]
      },
      saveLoading: false,
      equipmentSelectInfo: {
        visible: false
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  mounted () {
    this.getAdminList()
  },
  methods: {
    // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
    toSetAddress (val) {
      this.location = val
    },
    // 获得管理员列表
    async getAdminList () {
      let res = await this.$post('system/admin/getList')
      if (res.code === 0) {
        this.adminList = res.data.filter(item => {
          return item.username !== 'admin'
        })
      }
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
    // 考勤地点选择弹窗
    toShowEquipmentSelectDialog () {
      this.equipmentSelectInfo.visible = true
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
        times: 4, // 每日次数
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: ''
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
  .title{
    margin: 10px;
    font-size: 22px;
  }
</style>
