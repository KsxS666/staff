<template>
  <v-dialog :title="`${type == 2?'编辑':'新建'}`" class="dialogWrap" :visible.sync="value" width="50%" :before-close="beforeClose" @submit.native.prevent>
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px" size="small" @submit.native.prevent>
        <el-form-item label="类型名称" prop="name">
          <el-input type="text" v-model="formData.name" auto-complete="off" placeholder="请输入类型名称" ></el-input>
        </el-form-item>
        <el-form-item label="所属类型" prop="type">
          <el-radio v-model="formData.type" :label="1">设备</el-radio>
          <el-radio v-model="formData.type" :label="2">桶</el-radio>
        </el-form-item>
      <template v-if="formData.type == 2">
        <el-form-item label="编码" prop="typeValue" >
          <el-input v-model="formData.typeValue" v-if="this.type === 1"></el-input>
          <el-input v-model="formData.typeValue" disabled v-else></el-input>
        </el-form-item>
        <el-form-item label="位置" prop="indexValue">
          <el-radio v-model="formData.indexValue" :label="1">左</el-radio>
          <el-radio v-model="formData.indexValue" :label="2">右</el-radio>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input v-model="formData.sort" @input="toSetNumber(formData, 'sort')"></el-input>
        </el-form-item>
        <el-form-item label="颜色" prop="color">
          <el-color-picker v-model="formData.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="图表图标" prop="chartImg">
          <el-upload class="upload-demo" :action="uploadUrl" :on-success="handlePreviewsucc" :on-remove="handleRemove" :file-list="fileList" list-type="picture" :limit="1">
            <el-button size="mini" type="primary" plain v-show="!formData.chartImg">点击上传</el-button>
            <div slot="tip" class="el-upload__tip" :style="`${formData.chartImg ? 'margin-top: -31px' : ''}`">只能上传jpg/png文件，且不超过500kb.</div>
          </el-upload>
        </el-form-item>
        <el-form-item label="列表图标" prop="listImg">
          <el-upload class="upload-demo" :action="uploadUrl" :on-success="handlePreviewsucc2" :on-remove="handleRemove2" :file-list="fileList2" list-type="picture" :limit="1">
            <el-button size="mini" type="primary" plain v-show="!formData.listImg">点击上传</el-button>
            <div slot="tip" class="el-upload__tip" :style="`${formData.listImg ? 'margin-top: -31px' : ''}`">只能上传jpg/png文件，且不超过500kb.</div>
          </el-upload>
        </el-form-item>
      </template>
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
  name: 'equipmentTypeEditDialog',
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
        name: '',
        type: '',
        typeValue: '',
        indexValue: '',
        sort: '',
        color: '#409EFF',
        chartImg: ''
      },
      formRules: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }],
        typeValue: [{ required: true, message: '请输入', trigger: 'blur' }],
        indexValue: [{ required: true, message: '请选择', trigger: 'change' }],
        color: [{ required: true, message: '请选择', trigger: 'change' }],
        chartImg: [{ required: true, message: '请选择', trigger: 'change' }],
        listImg: [{ required: true, message: '请选择', trigger: 'change' }],
        sort: [{ required: true, message: '请选择', trigger: 'blur' }]
      },
      fileList: [],
      fileList2: [],
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
  // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
    handlePreviewsucc (res, file, fileList) {
      this.formData.chartImg = res.data[0]
    },
    handlePreviewsucc2 (res, file, fileList) {
      this.formData.listImg = res.data[0]
    },
    handleRemove () {
      this.formData.chartImg = ''
    },
    handleRemove2 () {
      this.formData.listImg = ''
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
      let req = Object.assign({}, this.formData, { orgId: this.userInfo.orgId })
      let res = await this.$post('equipment/equipmentType/saveOrUpdate', req)
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
        name: '',
        type: '',
        typeValue: '',
        indexValue: '',
        sort: '',
        color: '',
        chartImg: '',
        listImg: ''
      }
      this.fileList = []
      this.fileList2 = []
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          id: this.infoObj.id,
          name: this.infoObj.name,
          sort: this.infoObj.sort,
          type: this.infoObj.type,
          typeValue: this.infoObj.typeValue,
          indexValue: this.infoObj.indexValue,
          color: this.infoObj.color,
          chartImg: this.infoObj.chartImg ? this.infoObj.chartImg : '',
          listImg: this.infoObj.listImg ? this.infoObj.listImg : ''
        }
        this.fileList = this.infoObj.chartImg ? [{ url: this.infoObj.chartImg }] : []
        this.fileList2 = this.infoObj.listImg ? [{ url: this.infoObj.listImg }] : []
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
