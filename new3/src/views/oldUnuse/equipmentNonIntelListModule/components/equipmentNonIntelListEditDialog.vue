<!-- 非智能设备编辑弹窗 -->
<template>
  <v-dialog title="编辑" :visible="value" width="50%" :before-close="beforeClose">
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="设备编码" prop="equipmentCode">
        <el-input v-model="formData.equipmentCode"  type="text"></el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input v-model="formData.equipmentName"  type="text"></el-input>
      </el-form-item>
      <areaForm v-model="value" ref="areaForm" :level="4" :showName = 'true' :formData="formData"/>
      <el-form-item label="所属小区" prop="communityId">
        <el-select filterable clearable v-model="formData.communityId" style="width:100%" @change="getCommunityName">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="communityAddress">
        <el-input v-model="formData.communityAddress" type="text"></el-input>
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
  name: 'equipmentEditDialog',
  props: {
    value: {
      type: Boolean,
      default: true
    },
    type: { // 1 是 新建  2是修改
      type: Number,
      default: 1
    },
    infoObj: { // 表单数据
      type: Object,
      default: () => { }
    },
    communityList: { // 小区列表
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      formData: {
        equipmentName: '',
        equipmentCode: '',
        communityId: '',
        communityName: '',
        communityAddress: '',
        provinceId: '',
        provinceName: '',
        cityId: '',
        cityName: '',
        districtId: '',
        districtName: '',
        streetId: '',
        streetName: ''
      },
      typeFormData: {
        type: 1
      },
      typeList: [],
      openHourPick: Array.from(Array(24), (v, k) => k),
      closeHourPick: Array.from(Array(24), (v, k) => k),
      minutePick: Array.from(Array(60), (v, k) => k),
      formRules: {
        equipmentCode: [{ required: true, message: '请输入设备编码', trigger: 'blur' }],
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        communityAddress: [{ required: true, message: '请输入地址', trigger: 'blur' }],
        communityId: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      saveLoading: false,
      // 上传视频数据的信息
      fileInfo: {
        // uploadUrl: `${process.env.BASE_API}/system/util/upload`,
        uploadUrl: this.$utils.uploadUrl,
        uploadLoading: false
      }
    }
  },
  created () {
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    // 保存
    toSave () {
      if (this.fileInfo.uploadLoading) {
        return this.$message.warning('正在上传视频中，请稍后提交保存')
      }
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
      let reqData = Object.assign({}, this.formData, { orgId: this.userInfo.orgId })
      this.saveLoading = true
      let res = await this.$post('equipment/equipment/saveOrUpdate', reqData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('保存成功')
      this.$emit('success', true)
    },
    getCommunityName (val) {
      for (let item of this.communityList) {
        if (val === item.id) {
          this.formData.communityName = item.name
        }
      }
    },
    getTypeName (val) {
      for (let item of this.typeList) {
        if (val === item.id) {
          this.formData.typeName = item.name
        }
      }
    },
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newValue) {
      if (!newValue) return false
      this.formData = {
        equipmentName: '',
        equipmentCode: '',
        communityId: '',
        communityName: '',
        communityAddress: '',
        typeId: '',
        typeName: '',
        gpsCode: '',
        startHours: '',
        startMinute: '',
        endHours: '',
        endMinute: '',
        videoUrl: ''
      }
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          id: this.infoObj.id,
          equipmentName: this.infoObj.equipmentName,
          equipmentCode: this.infoObj.equipmentCode,
          communityId: this.infoObj.communityId,
          communityName: this.infoObj.communityName,
          communityAddress: this.infoObj.communityAddress,
          typeId: this.infoObj.typeId,
          typeName: this.infoObj.typeName,
          gpsCode: this.infoObj.gpsCode,
          startHours: this.infoObj.startHours,
          startMinute: this.infoObj.startMinute,
          endHours: this.infoObj.endHours,
          endMinute: this.infoObj.endMinute,
          videoUrl: this.infoObj.videoUrl || ''
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

<style scoped lang="scss" rel="stylesheet/scss">
  .video{
    width: 360px;
    height: auto;
    margin-right: 10px;
    vertical-align: bottom;
    display: inline-block;
  }
  .videoUpload{
    display: inline-block;
    vertical-align: bottom;
  }

</style>
<style  lang="scss" rel="stylesheet/scss">
  .videoUpload{
    /*.el-upload-dragger{
      width: 360px;
      height: auto;
      min-height: 180px;
      vertical-align: top;

    }*/
  }

</style>
