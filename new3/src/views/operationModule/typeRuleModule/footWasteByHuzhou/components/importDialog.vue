<template>
  <v-dialog title="数据导入"  :visible="value" width="550px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="80px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="小区" prop="communityId">
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间" prop="month">
        <el-date-picker v-model="formData.month" type="month" value-format="yyyy-MM"  placeholder="请选择时间"> </el-date-picker>
      </el-form-item>
      <!--<el-form-item label="投放类型" prop="month">
        <el-select filterable clearable v-model="formData.communityId">
          <el-option label="易腐垃圾" :value="0"></el-option>
          <el-option label="有毒有害" :value="1"></el-option>
          <el-option label="卫厕和其他" :value="2"></el-option>
        </el-select>
      </el-form-item>-->
      <el-form-item label="上传文件" prop="file" class="is-required">
        <el-upload ref="upload" action="" :file-list="fileList" :on-change="handleFileChange" :on-remove="handleFileRemove" :auto-upload="false" >
          <el-button class="v-button" type="primary" plain>选择文件</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <p class="v-red" style="text-align: center; margin: 60px 0 0">提示：数据一旦选择导入自动生效，不可退回</p>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="toSave">{{ saveLoading ? '导入中...' : '确 定' }}</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'importDialog',
  props: {
    value: Boolean,
    communityList: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      formData: {
        communityId: '',
        month: ''
      },
      fileList: [],
      formRules: {
        communityId: [{ required: true, message: '请选择小区', trigger: 'change' }],
        month: [{ required: true, message: '请选择时间', trigger: 'change' }]
      },
      saveLoading: false
    }
  },
  methods: {
    handleFileChange (file) {
      this.fileList = []
      this.fileList.push(file)
    },
    handleFileRemove () {
      this.fileList = []
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
        if (!this.fileList || !this.fileList.length) {
          return this.$message.error('请选择文件')
        }
        // 下面是保存
        this.saveData()
        // this.$refs.upload.submit()
      })
    },
    // 请求保存
    async saveData () {
      let reqData = Object.assign({}, this.formData, {
        file: this.fileList[0].raw
      })
      console.log('reqData', reqData)
      this.saveLoading = true
      let res = await this.$post('user/houseFoodWaste/importExcel', reqData, true, 0)
      this.saveLoading = false
      if (res.code !== 0) {
        // res.msg && this.$message.error(res.msg)
        this.$alert(`<p style="word-break: break-all">${res.msg || '空'}</p>`, '导入结果', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          callback: action => { }
        })
        return false
      }
      this.beforeClose()
      this.$message.success('导入成功')
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
        communityId: '',
        month: ''
      }
      this.fileList = []
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
        this.$refs.upload && this.$refs.upload.clearFiles()
      })
    }
  }
}
</script>

<style  lang="scss" rel="stylesheet/scss">
.importResultAlert{
  width: 600px;
}
</style>
