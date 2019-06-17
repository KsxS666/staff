<!-- 地区 编辑、新建页面 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}菜单`" class="dialogWrap" :visible="value" width="650px" :before-close="beforeClose">
    <el-form  class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="80px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="上级地区" v-if="type === 4"> {{formData.parentName}} </el-form-item>
      <el-form-item label="地区名称" prop="name">
        <el-input v-model="formData.name"></el-input>
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
  name: 'areaEditDialog',
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
        parentId: '', // 父级菜单ID
        parentName: '', // 父级菜单name
        name: '' // 菜单名
      },
      formRules: {
        name: [{ required: true, message: '请输入地区名称', trigger: 'blur' }]
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
      let res = await this.$post('system/area/saveOrUpdate', this.formData)
      this.saveLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
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
        name: '' // 菜单名
      }
      // // 1 是 新建  2是编辑  4是添加下级
      if (this.type === 2) {
        this.formData.id = this.infoObj.id
        this.formData.name = this.infoObj.name
      }
      if (this.type === 4) {
        this.formData.parentId = this.infoObj.id
        this.formData.parentName = this.infoObj.name
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
  /*.dialogWrap{
    .icon{
      font-size: 30px;
      border: 1px solid $border-base;
      border-radius: 4px;
      padding: 10px;
      margin-right: 20px;
    }
    .el-input, .el-textarea{
      width: calc(100% - 130px);
    }
    .tip{
      display: inline-block;
      margin: 0;
    }
    .dialog-footer{
      text-align: center;
    }
  }*/

</style>
