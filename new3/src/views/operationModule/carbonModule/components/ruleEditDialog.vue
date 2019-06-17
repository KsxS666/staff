<template>
  <v-dialog :title="`${type == 2?'编辑':'新建'}减碳规则`" class="dialogWrap" :visible.sync="value" width="50%" :before-close="beforeClose" @submit.native.prevent>
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px" size="small" @submit.native.prevent>
      <el-form-item label="行为：" prop="type">
        <el-select v-model="formData.type" filterable clearable style="width: 100%">
          <el-option label="投放" :value="0"></el-option>
          <el-option label="上门回收" :value="1"></el-option>
          <el-option label="浇水" :value="2"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="类型" v-if="formData.type === 0" prop="putName">
        <el-select filterable clearable v-model="formData.putName" style="width: 100%">
          <el-option v-for="(item, index) in typeList" :key="index" :label="item.name" :value="item.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="重量（kg）" v-if="formData.type === 0" prop="weight">
        <el-input v-model="formData.weight"></el-input>
      </el-form-item>
      <el-form-item label="能量（g）" prop="energy">
        <el-input v-model="formData.energy" @input="toSetNumber(formData, 'energy')"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'ruleEditDialog',
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
  created () {
    this.getTypeList()
  },
  data () {
    return {
      formData: {
        type: '',
        putName: '',
        weight: '',
        energy: ''
      },
      formRules: {
        type: [{ required: true, message: '请选择行为', trigger: 'change' }],
        putName: [{ required: true, message: '请选择类型', trigger: 'change' }],
        weight: [{ required: true, message: '请输入重量', trigger: 'blur' }],
        energy: [{ required: true, message: '请输入能量值', trigger: 'blur' }]
      },
      typeList: [],
      saveLoading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    uploadUrl () {
      return this.$utils.uploadUrl
    }
  },
  methods: {
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
    async getTypeList () {
      let reqData = { orgId: this.userInfo.orgId, type: 2 }
      let res = await this.$post('equipment/equipmentType/findByType', reqData)
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.typeList = res.data || []
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
      let res = await this.$post('user/energyRule/saveOrUpdate', reqData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
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
        type: '',
        putName: '',
        weight: '',
        energy: ''
      }
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          id: this.infoObj.id,
          type: this.infoObj.type,
          putName: this.infoObj.putName,
          weight: this.infoObj.weight,
          energy: this.infoObj.energy
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
