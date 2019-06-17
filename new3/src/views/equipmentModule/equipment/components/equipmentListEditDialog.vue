<!-- 二分类机编辑弹窗 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}设备`" :visible="value" width="50%" :before-close="beforeClose">
    <el-form :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="设备编码" prop="equipmentCode">
        <el-input v-model="formData.equipmentCode"  type="text"></el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input v-model="formData.equipmentName"  type="text"></el-input>
      </el-form-item>
      <el-form-item label="所属类型" prop="typeId">
        <el-select filterable clearable v-model="formData.typeId" style="width:100%" @change="getTypeName">
          <el-option v-for="item in typeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属小区" prop="communityId">
        <el-select filterable clearable v-model="formData.communityId" style="width:100%" @change="getCommunityName">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="地址" prop="communityAddress">
        <el-input v-model="formData.communityAddress" type="text"></el-input>
      </el-form-item>
      <el-form-item label="GPS设备编码" prop="gpsCode">
        <el-input v-model="formData.gpsCode" type="text"></el-input>
      </el-form-item>
      <el-form-item label="开机时间" class="timePk">
        <el-select filterable v-model="formData.startHours" style="margin-right:10px;border-radius:0">
          <el-option v-for="item in openHourPick" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <span style="margin-right:10px">时</span>
        <el-select filterable v-model="formData.startMinute" style="margin-right:10px">
          <el-option v-for="item in minutePick" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <span>分</span>
      </el-form-item>
      <el-form-item label="关机时间" >
        <el-select filterable v-model="formData.endHours" style="margin-right:10px;border-radius:0">
          <el-option v-for="item in closeHourPick" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <span style="margin-right:10px">时</span>
        <el-select filterable v-model="formData.endMinute" style="margin-right:10px">
          <el-option v-for="item in minutePick" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <span>分</span>
      </el-form-item>
      <el-form-item label="开机视频">
        <video ref="video" class="video" :src="formData.videoUrl" controls="controls" v-if="formData.videoUrl"></video>
        <div class="videoUpload">
          <el-upload style="display: inline-block" :action="fileInfo.uploadUrl" accept="video/avi,video/mp4,video/flv,video/3gp,video/swf" :show-file-list="false" :before-upload="beforeUpload" :on-error="handleError" :on-success="handleSuccess">
            <el-button>上传视频</el-button>
          </el-upload>
          <el-button v-if="formData.videoUrl" plain type="danger" @click="handleRemove">删除视频</el-button>
          <span v-if="fileInfo.uploadLoading" style="margin-left: 30px">上传中...</span>
          <div class="el-upload__tip" slot="tip">只能上传video/avi,video/mp4,video/flv,video/3gp,video/swf文件</div>
        </div>
      </el-form-item>
      <!--<el-form-item label="设备定位">-->
      <!--</el-form-item>-->
      <!--<mapPosition />-->
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
// import mapPosition from './mapPosition'
export default {
  name: 'equipmentEditDialog',
  // components: { mapPosition },
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
        typeId: '',
        typeName: '',
        gpsCode: '',
        startHours: '',
        startMinute: '',
        endHours: '',
        endMinute: '',
        // videoUrl: 'http://ajwl.oss-cn-shenzhen.aliyuncs.com/201902181423048827514.mp4'
        videoUrl: ''
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
        typeId: [{ required: true, message: '请选择', trigger: 'change' }],
        communityId: [{ required: true, message: '请选择', trigger: 'change' }],
        communityAddress: [{ required: true, message: '请输入', trigger: 'blur' }]
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
    this.getTypeList()
  },
  mounted () {
    this.getAdminList()
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
    // 获取设备类型列表
    async getTypeList () {
      this.typeFormData.orgId = this.userInfo.orgId
      let res = await this.$post('equipment/equipmentType/findByType', this.typeFormData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.typeList = res.data || []
    },
    async getAdminList () {
      let res = await this.$post('system/admin/getList')
      if (res.code === 0) {
        this.adminList = res.data.filter(item => {
          return item.username !== 'admin'
        })
      }
    },
    beforeUpload (file) {
      if (this.fileInfo.uploadLoading) {
        return this.$message.warning('正在上传中，请勿重复操作')
      }
      this.fileInfo.uploadLoading = true
    },
    handleSuccess (res, file, fileList) {
      this.fileInfo.uploadLoading = false
      console.log(res, file)
      if (res.code === 0) {
        this.formData.videoUrl = res.data[0]
      }
    },
    handleError (res, file, fileList) {
      this.fileInfo.uploadLoading = false
    },
    handleRemove () {
      this.formData.videoUrl = ''
    },
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
        startHours: 5,
        startMinute: 30,
        endHours: 0,
        endMinute: 30,
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
</style>
