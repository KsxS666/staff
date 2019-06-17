<!-- 设备编辑 -->
<template>
  <div class="v-wrap">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="130px" v-loading="mainLoading" size="small" @submit.native.prevent>
      <el-form-item label="设备编码" prop="equipmentCode">
        <el-input v-model="formData.equipmentCode" type="text"></el-input>
      </el-form-item>
      <el-form-item label="设备名称" prop="equipmentName">
        <el-input v-model="formData.equipmentName" type="text"></el-input>
      </el-form-item>
      <el-form-item label="所属类型" prop="typeObj">
        <!--<el-select filterable v-model="formData.typeId" style="width:100%" @change="getTypeName">
          <el-option v-for="item in typeList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>-->
        <el-select filterable clearable v-model="formData.typeObj" value-key="id">
          <el-option v-for="(item, i) in typeList" :key="i" :label="item.name" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属小区" prop="communityObj">
        <!--<el-select filterable clearable v-model="formData.communityId" style="width:100%" @change="getCommunityName">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>-->
        <el-select filterable clearable v-model="formData.communityObj" value-key="id" style="width:100%">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item"></el-option>
        </el-select>
      </el-form-item>
     <!-- <el-form-item label="地址" prop="communityAddress">
        <el-input v-model="formData.communityAddress" type="text"></el-input>
      </el-form-item>-->
      <el-form-item label="GPS设备编码" prop="gpsCode">
        <el-input v-model="formData.gpsCode" type="text"></el-input>
      </el-form-item>
      <el-form-item label="开机时间" class="timePk">
        <el-select filterable v-model="formData.startHours" class="selectTime">
          <el-option v-for="item in openHourPick" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <span style="margin-right:10px">时</span>
        <el-select filterable v-model="formData.startMinute" class="selectTime">
          <el-option v-for="item in minutePick" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <span>分</span>
      </el-form-item>
      <el-form-item label="关机时间">
        <el-select filterable v-model="formData.endHours" class="selectTime">
          <el-option v-for="item in closeHourPick" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <span style="margin-right:10px">时</span>
        <el-select filterable v-model="formData.endMinute" class="selectTime">
          <el-option v-for="item in minutePick" :label="item" :value="item" :key="item"></el-option>
        </el-select>
        <span>分</span>
      </el-form-item>
      <el-form-item label="开机视频">
        <video ref="video" class="video" :src="formData.videoUrl" controls="controls" v-if="formData.videoUrl"></video>
        <!-- <object type="video/x-msvideo" :data="formData.videoUrl" width="320" height="240" v-if="formData.videoUrl"> -->
        <div class="videoUpload">
          <el-upload style="display: inline-block; margin-right: 10px" :action="fileInfo.uploadUrl"
                     accept="video/avi,video/mp4,video/flv,video/3gp,video/swf" :show-file-list="false"
                     :before-upload="beforeUpload" :on-error="handleError" :on-success="handleSuccess">
            <el-button>上传视频</el-button>
          </el-upload>
          <el-button v-if="formData.videoUrl" plain type="danger" @click="handleRemove">删除视频</el-button>
          <span v-if="fileInfo.uploadLoading" style="margin-left: 30px">上传中...</span>
          <div class="el-upload__tip" slot="tip">只能上传video/avi,video/mp4,video/flv,video/3gp,video/swf文件</div>
        </div>
      </el-form-item>
      <el-form-item label="SIM卡号">
        <el-input v-model="formData.iccid"></el-input>
      </el-form-item>
      <el-form-item label="设备地址" class="is-required">
        <mapPosition ref="mapPosition" :init-address="formData.communityAddress" :lng="formData.longitude" :lat="formData.dimensionality"/>
      </el-form-item>
      <el-form-item label="" style="margin-top: 50px">
        <el-button class="v-button" size="me" type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
        <el-button class="v-button" size="me" @click="$router.go(-1)">关 闭</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import mapPosition from './components/mapPosition'
export default {
  name: 'equipmentEdit',
  components: { mapPosition },
  data () {
    return {
      equipmentId: this.$route.query.id || null, // 设备id
      type: Number(this.$route.query.type || 0), // 1 是 新建  2是修改  3是查看
      formData: {
        equipmentName: '',
        equipmentCode: '',
        communityAddress: '', // 设备地址
        longitude: null, // 经度
        dimensionality: null, // 纬度
        // latLng: '118.1164,24.467977',
        communityObj: null,
        // communityId: '',
        // communityName: '',
        typeObj: null,
        // typeId: '',
        // typeName: '',
        gpsCode: '',
        startHours: '05',
        startMinute: '30',
        endHours: '00',
        endMinute: '30',
        // videoUrl: 'http://ajwl.oss-cn-shenzhen.aliyuncs.com/201902181423048827514.mp4'
        videoUrl: '',
        iccid: ''
      },
      typeFormData: {
        type: 1
      },
      typeList: [],
      communityList: [],
      openHourPick: Array.from(Array(24), (v, k) => k),
      closeHourPick: Array.from(Array(24), (v, k) => k),
      minutePick: Array.from(Array(60), (v, k) => k),
      formRules: {
        equipmentCode: [{ required: true, message: '请输入设备编码', trigger: 'blur' }],
        equipmentName: [{ required: true, message: '请输入设备名称', trigger: 'blur' }],
        typeObj: [{ required: true, message: '请选择类型', trigger: 'change' }],
        communityObj: [{ required: true, message: '请选择小区', trigger: 'change' }],
        communityAddress: [{ required: true, message: '请输入', trigger: 'blur' }]
      },
      mainLoading: false,
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
    if (this.equipmentId) this.getDetail()
    this.getTypeList()
    this.getCommunityList()
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
    async getDetail () {
      this.mainLoading = true
      let res = await this.$post('equipment/equipment/getDetail', { equipmentId: this.equipmentId })
      this.mainLoading = false
      if (res.code !== 0) {
        return res.msg && this.$message.error(res.msg)
      }
      this.formData.id = res.data.id
      this.formData.equipmentName = res.data.equipmentName
      this.formData.equipmentCode = res.data.equipmentCode
      this.formData.gpsCode = res.data.gpsCode
      this.formData.startHours = res.data.startHours
      this.formData.startMinute = res.data.startMinute
      this.formData.endHours = res.data.endHours
      this.formData.endMinute = res.data.endMinute
      this.formData.videoUrl = res.data.videoUrl
      this.formData.iccid = res.data.iccid
      this.formData.communityAddress = res.data.communityAddress
      this.formData.longitude = res.data.longitude ? Number(res.data.longitude) : null
      this.formData.longitude = res.data.dimensionality ? Number(res.data.dimensionality) : null
      this.formData.communityObj = {
        id: res.data.communityId,
        name: res.data.communityName
      }
      this.formData.typeObj = {
        id: res.data.typeId,
        name: res.data.typeName
      }
    },
    // 获取社区列表 当省市区街道发生变化时， 加载
    async getCommunityList () {
      let res = await this.$post('community/community/getCommunityList')
      if (res.code === 0) {
        this.communityList = res.data
      }
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
    // async getAdminList () {
    //   let res = await this.$post('system/admin/getList')
    //   if (res.code === 0) {
    //     this.adminList = res.data.filter(item => {
    //       return item.username !== 'admin'
    //     })
    //   }
    // },
    // ///// 上传视频
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
      } else {
        this.$message.error(res.msg)
      }
    },
    handleError (res, file, fileList) {
      this.fileInfo.uploadLoading = false
    },
    handleRemove () {
      this.formData.videoUrl = ''
    },
    // ///// --- 上传视频end
    // 保存
    toSave () {
      // let addressInfo = this.$refs.mapPosition.getChooseInfo()
      // console.log('this.$refs.mapPosition.getChooseInfo()', addressInfo)
      // if (!addressInfo) {
      //   return this.$message.error('请设置设备地址')
      // }
      // this.formData.communityAddress = addressInfo.address
      // this.formData.longitude = addressInfo.position.lng // 经度
      // this.formData.dimensionality = addressInfo.position.lat // 纬度
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
        let addressInfo = this.$refs.mapPosition.getChooseInfo()
        console.log('this.$refs.mapPosition.getChooseInfo()', addressInfo)
        if (!addressInfo) {
          return this.$message.error('请设置设备地址')
        }
        this.formData.communityAddress = addressInfo.address
        this.formData.longitude = addressInfo.position.lng // 经度
        this.formData.dimensionality = addressInfo.position.lat // 纬度
        console.log('this.formData', this.formData)
        // 下面是保存
        this.saveData()
      })
    },
    // 请求保存
    async saveData () {
      let reqData = Object.assign({}, this.formData, { orgId: this.userInfo.orgId })
      reqData.communityId = reqData.communityObj.id
      reqData.communityName = reqData.communityObj.name
      delete reqData.communityObj
      reqData.typeId = reqData.typeObj.id
      reqData.typeName = reqData.typeObj.name
      delete reqData.typeObj
      this.saveLoading = true
      let res = await this.$post('equipment/equipment/saveOrUpdate', reqData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.$message.success('保存成功')
      // this.$emit('success', true)
      setTimeout(() => {
        this.$router.go(-1)
      }, 1000)
    }
    // getCommunityName (val) {
    //   for (let item of this.communityList) {
    //     if (val === item.id) {
    //       this.formData.communityName = item.name
    //     }
    //   }
    // },
    // getTypeName (val) {
    //   for (let item of this.typeList) {
    //     if (val === item.id) {
    //       this.formData.typeName = item.name
    //     }
    //   }
    // }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .v-wrap {
    .v-form{
      width: 1000px;
      margin-top: 40px;
    }
    .video {
      width: 360px;
      height: auto;
      margin-right: 10px;
      vertical-align: bottom;
      display: inline-block;
    }
    .videoUpload {
      display: inline-block;
      vertical-align: bottom;
    }
    .selectTime{
      width: 40%;
      margin-right: 10px;
    }
  }
</style>
