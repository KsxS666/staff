<!-- 回收类型编辑、查看、新建页面 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}类型`" class="dialogWrap" :visible="value" width="650px" :before-close="beforeClose">
    <el-form  class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="100px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="上级类型" v-if="type === 4"> {{formData.parentName}} </el-form-item>
      <el-form-item label="名称" prop="typeName">
        <el-input v-model="formData.typeName"></el-input>
      </el-form-item>
      <el-form-item label="类型" prop="typeRule" v-if="infoObj.level === 2 && type === 2 || infoObj.level === 1 && type === 4">
        <el-radio v-model="formData.typeRule" :label="0">重量</el-radio>
        <el-radio v-model="formData.typeRule" :label="1">数量</el-radio>
        <p class="v-red">（添加完毕后请在积分规则中设置默认值）</p>
      </el-form-item>
      <el-form-item label="位置" prop="position">
        <el-radio v-model="formData.position" :label="0">全部</el-radio>
        <el-radio v-model="formData.position" :label="1">客户端</el-radio>
        <el-radio v-model="formData.position" :label="2">管理端</el-radio>
      </el-form-item>
      <el-form-item label="配置重量范围" v-show="(infoObj.level === 3  || (infoObj.level === 2 && type === 4)) && formData.typeRule === 0">
        <el-input class="wi" v-model="formData.startWeight"></el-input><span style="padding:0 10px;margin-left:2px">-</span>
        <el-input class="wi" v-model="formData.endWeight"></el-input>
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
  name: 'typeEditDialog',
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
    return {
      mainLoading: false,
      saveLoading: false,
      formData: {
        parentId: '', // 父级ID
        parentName: '', // 父级name
        typeName: '',
        typeRule: 0,
        startWeight: '',
        endWeight: ''
      },
      formRules: {
        typeName: [{ required: true, message: '请输入名称', trigger: 'blur' }],
        typeRule: [{ required: true, message: '请选择类型', trigger: 'change' }],
        position: [{ required: true, message: '请选择位置', trigger: 'change' }]
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
        this.saveData()
      })
    },
    // 请求保存
    async saveData () {
      this.saveLoading = true
      let res = await this.$post('integral/reclaimType/saveOrUpdate', this.formData)
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
        parentId: '',
        parentName: '',
        typeName: '',
        typeRule: '',
        startWeight: '',
        endWeight: '',
        position: 0
      }
      // // 1 是 新建  2是编辑  4是添加下级
      if (this.type === 2) {
        this.formData.id = this.infoObj.id
        this.formData.parentId = this.infoObj.parentId
        this.formData.typeName = this.infoObj.typeName
        this.formData.typeRule = this.infoObj.typeRule
        this.formData.startWeight = this.infoObj.startWeight
        this.formData.endWeight = this.infoObj.endWeight
        this.formData.position = this.infoObj.position
      }
      if (this.type === 4) {
        this.formData.parentId = this.infoObj.id
        this.formData.parentName = this.infoObj.typeName
        if (this.infoObj.level === 2) {
          this.formData.typeRule = this.infoObj.typeRule
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
  .wi{
    width: 40%!important
  }
</style>
