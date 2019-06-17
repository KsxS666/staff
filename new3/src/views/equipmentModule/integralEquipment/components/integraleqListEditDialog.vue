<!-- 二分类机编辑弹窗 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}设备`" :visible="value" width="50%" :before-close="beforeClose">
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="设备编码" prop="integratorCode">
        <el-input v-model="formData.integratorCode" type="text" :disabled="type === 2"></el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="name">
        <el-input v-model="formData.name"  type="text"></el-input>
      </el-form-item>
      <el-form-item label="所属小区" prop="communityId">
        <el-select filterable clearable v-model="formData.communityId" style="width:100%" @change="getCommunityName">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="communityAddress">
        <el-input v-model="formData.communityAddress" type="text"></el-input>
      </el-form-item>
      <el-form-item label="GPS设备编码" prop="gpsCode">
        <el-input v-model="formData.gpsCode" type="text"></el-input>
      </el-form-item>
      <el-form-item label="货道总数" prop="aisleCount">
        <el-input v-model="formData.aisleCount" type="text" :disabled="type === 2"></el-input>
      </el-form-item>
      <el-form-item label="单个货道商品数" prop="aisleProductCount">
        <el-input v-model="formData.aisleProductCount" type="text" :disabled="type === 2"></el-input>
      </el-form-item>
      <el-form-item label="开机时间" class="timePk">
        <el-select filterable v-model="formData.startHours" style="margin-right:10px;border-radius:0">
          <el-option v-for="item in openHourPick" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <span style="margin-right:10px">时</span>
        <el-select filterable v-model="formData.startMinute" style="margin-right:10px">
          <el-option v-for="item in minutePick" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <span>分</span>
      </el-form-item>
      <el-form-item label="关机时间" >
        <el-select filterable v-model="formData.endHours" style="margin-right:10px;border-radius:0">
          <el-option v-for="item in closeHourPick" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <span style="margin-right:10px">时</span>
        <el-select filterable v-model="formData.endMinute" style="margin-right:10px">
          <el-option v-for="item in minutePick" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <span>分</span>
      </el-form-item>
      <el-form-item label="SIM卡号">
        <el-input v-model="formData.iccid"></el-input>
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
  name: 'ResetPwdDialog',
  props: {
    value: {
      type: Boolean,
      default: true
    },
    type: { // 1 是 新建  2是修改
      type: Number,
      default: 1
    },
    infoObj: { // 表单数据
      type: Object,
      default: () => { }
    },
    communityList: { // 小区列表
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      formData: {
        integratorCode: '',
        name: '',
        communityId: '',
        communityName: '',
        communityAddress: '',
        aisleCount: '',
        aisleProductCount: '',
        gpsCode: '',
        startHours: '',
        startMinute: '',
        endHours: '',
        endMinute: '',
        iccid: ''
      },
      typeFormData: {
        type: 1
      },
      typeList: [],
      openHourPick: Array.from(Array(24), (v, k) => k),
      closeHourPick: Array.from(Array(24), (v, k) => k),
      minutePick: Array.from(Array(60), (v, k) => k),
      formRules: {
        integratorCode: [{ required: true, message: '请输入', trigger: 'blur' }],
        name: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        communityId: [{ required: true, message: '请选择小区', trigger: 'change' }],
        communityAddress: [{ required: true, message: '请输入地址', trigger: 'change' }],
        aisleCount: [{ required: true, message: '请输入货道总数', trigger: 'blur' }],
        aisleProductCount: [{ required: true, message: '请输入商品数', trigger: 'blur' }]
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
      let reqData = Object.assign({}, this.formData, { orgId: this.userInfo.orgId })
      delete reqData.total
      this.saveLoading = true
      let res = await this.$post('equipment/integrator/saveOrUpdate', reqData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('保存成功')
      this.$emit('success', true)
    },
    getCommunityName (val) {
      for (let item of this.communityList) {
        if (val === item.id) {
          this.formData.communityName = item.name
        }
      }
    },
    getTypeName (val) {
      for (let item of this.typeList) {
        if (val === item.id) {
          this.formData.typeName = item.name
        }
      }
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        integratorCode: '',
        name: '',
        communityId: '',
        communityName: '',
        communityAddress: '',
        aisleCount: '',
        aisleProductCount: '',
        gpsCode: '',
        startHours: '',
        startMinute: '',
        endHours: '',
        endMinute: ''
      }
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          id: this.infoObj.id,
          integratorCode: this.infoObj.integratorCode,
          name: this.infoObj.name,
          communityId: this.infoObj.communityId,
          communityName: this.infoObj.communityName,
          communityAddress: this.infoObj.communityAddress,
          aisleCount: this.infoObj.aisleCount,
          aisleProductCount: this.infoObj.aisleProductCount,
          gpsCode: this.infoObj.gpsCode,
          startHours: this.infoObj.startHours,
          startMinute: this.infoObj.startMinute,
          endHours: this.infoObj.endHours,
          endMinute: this.infoObj.endMinute,
          iccid: this.infoObj.iccid
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

<style scoped>

</style>
