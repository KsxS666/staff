<template>
  <v-dialog
    :title="`${type == 2?'编辑':'新建'}`"
    class="dialogWrap"
    :visible.sync="value"
    width="50%"
    :before-close="beforeClose"
    @submit.native.prevent
  >
    <el-form
      :model="formData"
      :rules="formRules"
      ref="ruleForm"
      label-width="130px"
      style="margin-right: 20px"
      size="small"
      @submit.native.prevent
    >
      <el-form-item label="类型名称：" prop="name">
        <el-input placeholder="请输入新闻类型名称" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="图片上传：" prop="img">
        <el-upload class="upload-demo" drag :action="uploadUrl" :file-list="fileList" :on-success="handlePreviewsucc" :show-file-list="false">
          <div v-if="formData.img === ''">
            <i class="el-icon-upload"></i>
          </div>
          <img :src="formData.img" alt="" v-else>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="是否推荐：" prop="recommend">
        <el-radio v-model="formData.recommend" :label="true">是</el-radio>
        <el-radio v-model="formData.recommend" :label="false">否</el-radio>
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
      // imgUrl: '',
      formData: {
        name: '',
        img: '',
        sort: '',
        recommend: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        recommend: [{ required: true, message: '请选择', trigger: 'change' }],
        img: [{ required: true, message: '请选择图片', trigger: 'change' }]
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
          res = await this.$post('system/goodsType/addGoodsType', req)
          break
        default:
          res = await this.$post('system/goodsType/updateGoodsType', req)
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
    },
    handlePreviewsucc (res, file, fileList) {
      this.formData.img = res.data[0]
      // this.imgUrl = res.data[0]
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        name: '',
        img: '',
        sort: '',
        recommend: ''
      }
      this.fileList = []
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          name: this.infoObj.name,
          img: this.infoObj.img,
          recommend: this.infoObj.recommend,
          sort: this.infoObj.sort,
          id: this.infoObj.id
        }
        this.fileList = [{ url: this.infoObj.img }]
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
  .el-upload-dragger img{
    width: 100%;
    height: 100%
  }
</style>
<style>
  .el-upload-dragger{
    width: 180px;
    height: 180px;
    display: flex;
    justify-content: center;
    align-items:center
  }
  .el-icon-upload{
    margin:0!important
  }
</style>
