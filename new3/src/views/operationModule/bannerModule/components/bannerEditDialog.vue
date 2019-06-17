<template>
  <v-dialog :title="`${type == 2?'编辑':'新建'}`" class="dialogWrap" :visible.sync="value" width="50%" :before-close="beforeClose" @submit.native.prevent>
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px" size="small" @submit.native.prevent>
      <el-form-item label="名称：" prop="name">
        <el-input placeholder="请输入banner名称" v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="图片上传：" prop="img">
        <el-upload class="upload-demo" :action="uploadUrl" :file-list="fileList" :on-success="handlePreviewsucc" :limit="1" list-type="picture" :accept="'image/*'">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
      </el-form-item>
      <el-form-item label="位置：" prop="locationCode">
        <el-select ilterable clearable v-model="formData.locationCode" placeholder="请选择" style="width:100%">
          <el-option label="首页" :value="0"></el-option>
          <el-option label="积分商城" :value="1"></el-option>
          <el-option label="新闻资讯" :value="2"></el-option>
          <el-option label="预约服务" :value="3"></el-option>
          <el-option label="小程序首页" :value="4"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="url：" prop="url">
        <el-input type="text" v-model="formData.url" auto-complete="off" placeholder="请输入url"></el-input>
      </el-form-item>
      <el-form-item label="是否发布：" prop="hasRelease">
        <el-radio v-model="formData.hasRelease" :label="true">是</el-radio>
        <el-radio v-model="formData.hasRelease" :label="false">否</el-radio>
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
  name: 'bannerEditDialog',
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
        name: '',
        img: '',
        locationCode: '',
        url: '',
        hasRelease: '',
        sort: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        img: [{ required: true, message: '请选择', trigger: 'change' }],
        url: [{ required: true, message: '请输入', trigger: 'blur' }],
        locationCode: [{ required: true, message: '请选择', trigger: 'change' }],
        hasRelease: [{ required: true, message: '请选择', trigger: 'change' }]
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
          res = await this.$post('system/banner/save', req)
          break

        default:
          res = await this.$post('system/banner/update', req)
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
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        name: '',
        img: '',
        locationCode: '',
        url: '',
        hasRelease: '',
        sort: ''
      }
      this.fileList = []
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          id: this.infoObj.id,
          name: this.infoObj.name,
          img: this.infoObj.img,
          locationCode: this.infoObj.locationCode,
          url: this.infoObj.url,
          hasRelease: this.infoObj.hasRelease,
          sort: this.infoObj.sort,
          communityId: this.infoObj.house ? this.infoObj.house.communityId : ''
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
</style>
