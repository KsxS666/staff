<template>
  <v-dialog :title="`${type == 2?'编辑':'新建'}`" class="dialogWrap" :visible.sync="value" width="50%" :before-close="beforeClose" @submit.native.prevent>
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px" size="small" @submit.native.prevent>
      <el-form-item label="类型名称：" prop="typeName">
        <el-input placeholder="请输入新闻类型名称" v-model="formData.typeName"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
// import Tinymce from '@/components/Tinymce'
export default {
  name: 'newsTypeEditDialog',
  // components: { Tinymce },
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
      // uploadUrl: `${process.env.BASE_API}/system/util/upload`,
      formData: {
        typeName: '',
        sort: ''
      },
      formRules: {
        typeName: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      fileList: [],
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
      let req = Object.assign({}, this.formData)
      let type = this.type
      let res
      switch (type) {
        case 1:
          res = await this.$post('system/newsType/add', req)
          break

        default:
          res = await this.$post('system/newsType/update', req)
          break
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
        typeName: '',
        sort: ''
      }
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          typeName: this.infoObj.name,
          sort: this.infoObj.sort,
          id: this.infoObj.id
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
