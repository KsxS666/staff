<!-- 住户导入弹窗 -->
<template>
  <div>
    <v-dialog title="住户导入"  :visible="value" width="550px" :before-close="beforeClose">
      <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="80px" style="margin-right: 20px"  size="small" @submit.native.prevent>
        <areaForm v-model="value" ref="areaForm" :level="3" :formData="formData" @change="getCommunityList"/>
        <el-form-item label="所属小区" prop="communityId">
          <el-select filterable clearable v-model="formData.communityId">
            <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="上传文件" prop="file" class="is-required">
          <el-upload class="upload-demo" ref="upload" :action="importUrl" :show-file-list='true' :on-change="handleFileChange" :on-remove="handleFileRemove" :auto-upload="false" :limit="1" :data="{communityId: formData.communityId}" >
            <el-button class="v-button" type="primary" plain>选择文件</el-button>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
        <el-button @click="beforeClose">关 闭</el-button>
      </div>
    </v-dialog>
    <v-dialog title="导入结果"  :visible="uploadRes.visible" width="450px" top="calc(15vh + 100px)">
      <div v-html="uploadRes.resText"> </div>
      <div slot="footer">
        <el-button @click="uploadRes.visible = false">关 闭</el-button>
      </div>
    </v-dialog>
  </div>
</template>
<script>
export default {
  name: 'insertDialog',
  props: {
    value: Boolean,
    id: null
  },
  data () {
    return {
      importUrl: `${this.$requestBase}/user/house/importExcel`,
      fileList: [],
      communityList: [],
      allCommunityList: [],
      formData: {
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        communityId: '',
        file: null
      },
      formRules: {
        communityId: [{ required: true, message: '请选择小区', trigger: 'change' }]
      },
      saveLoading: false,
      uploadRes: {
        visible: false,
        resText: null
      }
    }
  },
  methods: {
    // 获取社区列表 当省市区街道发生变化时， 加载
    async getCommunityList () {
      this.formData.communityId = ''
      let req = {
        provinceId: this.formData.provinceId,
        cityId: this.formData.cityId,
        districtId: this.formData.districtId,
        streetId: this.formData.streetId
      }
      let res = await this.$post('community/community/getCommunityList', req)
      if (res.code === 0) {
        this.communityList = res.data
        if (!this.allCommunityList.length) {
          this.allCommunityList = res.data
        }
      }
    },
    handleFileChange (file, fileList) {
      console.log('change', file, fileList)
      this.formData.file = fileList.length ? fileList[0].raw : null
    },
    handleFileRemove (file, fileList) {
      console.log('handleFileRemove', file, fileList)
      this.formData.file = fileList.length ? fileList[0].raw : null
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
        if (!this.formData.file) {
          return this.$message.error('请选择文件')
        }
        // 下面是保存
        this.saveData()
        // this.$refs.upload.submit()
      })
    },
    // 请求保存
    async saveData () {
      this.saveLoading = true
      let res = await this.$post('user/house/importExcel', this.formData, true)
      this.saveLoading = false
      if (res.code === -1) {
        this.uploadRes.visible = true
        this.uploadRes.resText = res.msg
        return
      }
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
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
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        communityId: ''
      }
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
    }
  }
}
</script>
