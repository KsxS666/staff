<template>
  <v-dialog :title="`${type == 2?'编辑':'新建'}`" class="dialogWrap" :visible.sync="value" width="50%" :before-close="beforeClose" @submit.native.prevent>
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px" size="small" @submit.native.prevent>
      <el-form-item label="新闻标题：" prop="title">
        <el-input placeholder="新闻标题" v-model="formData.title"></el-input>
      </el-form-item>
      <el-form-item label="新闻简介：" prop="introduction">
        <el-input type="textarea" v-model="formData.introduction" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item label="图片上传：" prop="img">
        <el-upload class="upload-demo" drag :action="uploadUrl" :file-list="fileList" :on-success="handlePreviewsucc" :show-file-list="false">
          <div v-if="imgUrl === ''">
            <i class="el-icon-upload"></i>
          </div>
          <img :src="imgUrl" alt="" v-else>
          <div class="el-upload__tip" slot="tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="所属类型：" prop="newsTypeId">
        <el-select filterable clearable v-model="formData.newsTypeId" placeholder="请选择" style="width:100%">
          <el-option v-for="item in newsTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="位置：" prop="hasType">
        <el-radio v-model="formData.hasType" :label="0">客户端</el-radio>
        <el-radio v-model="formData.hasType" :label="1">h5</el-radio>
        <el-radio v-model="formData.hasType" :label="2">小程序</el-radio>
      </el-form-item>
      <el-form-item label="是否发布：" prop="hasRelease">
        <el-radio v-model="formData.hasRelease" :label="true">是</el-radio>
        <el-radio v-model="formData.hasRelease" :label="false">否</el-radio>
      </el-form-item>
      <el-form-item label="编辑：" prop="content" class="editor">
        <div class="createPost-main-container">
          <div class="editor-container" v-if="value">
            <Tinymce ref="editor" :height="400" v-model="formData.content" :is-edit="false"></Tinymce>
          </div>
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" style="text-align: center">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
import Tinymce from '@/components/Tinymce'
export default {
  name: 'newsEditDialog',
  components: { Tinymce },
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
      imgUrl: '',
      formData: {
        title: '',
        newsTypeId: '',
        img: '',
        introduction: '',
        content: '',
        hasType: '',
        initialViews: '',
        sort: '',
        hasRelease: ''
      },
      newsTypeList: [],
      formRules: {
        title: [{ required: true, message: '请输入', trigger: 'blur' }],
        img: [{ required: true, message: '请选择', trigger: 'change' }],
        newsTypeId: [{ required: true, message: '请选择', trigger: 'change' }],
        hasType: [{ required: true, message: '请选择', trigger: 'change' }],
        content: [{ required: true, message: '请填写', trigger: 'change' }],
        introduction: [{ required: true, message: '请输入', trigger: 'blur' }],
        hasRelease: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      fileList: [],
      saveLoading: false
    }
  },
  created () {
    this.getTypeList()
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
    // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
    async getTypeList () {
      let res = await this.$post('system/newsType/getPage')
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.newsTypeList = res.data.resultList || []
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
      let req = Object.assign({}, this.formData)
      let type = this.type
      let res
      switch (type) {
        case 1:
          res = await this.$post('system/newsDetail/admin/addNews', req)
          break

        default:
          res = await this.$post('system/newsDetail/updateNews', req)
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
      this.imgUrl = res.data[0]
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        title: '',
        newsTypeId: '',
        introduction: '',
        img: '',
        hasRelease: '',
        hasType: '',
        initialViews: '',
        sort: '',
        content: ''
      }
      this.fileList = []
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          id: this.infoObj.id,
          title: this.infoObj.title,
          newsTypeId: this.infoObj.newsTypeId,
          introduction: this.infoObj.introduction,
          hasRelease: this.infoObj.hasRelease,
          hasType: this.infoObj.hasType,
          initialViews: this.infoObj.initialViews,
          sort: this.infoObj.sort,
          content: this.infoObj.content,
          img: this.infoObj.img

        }
        this.fileList = [{ url: this.infoObj.img }]
        this.imgUrl = this.infoObj.img
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
