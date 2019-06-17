<!-- 新增考勤 -->
<template>
  <v-dialog :title="type === 1 ? '新增考勤' : '编辑考勤'"  :visible="value" width="650px" :before-close="beforeClose">
    <el-form class="v-form" :rules="formRules" :model="formData" ref="ruleForm" label-width="120px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="添加管理员：" prop="communityAdminId">
        <el-select filterable clearable v-model="formData.communityAdminId" @change="handleCommunityAdminChange">
          <el-option v-for="(item, i) in adminList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="固定考勤地点：" prop="location" v-if="formData.communityAdminId">
        <section :class="listByAdmin.length ? 'chooseBtn' : ''">
          <el-button @click="toShowEquipmentSelectDialog()">选择考勤地址</el-button>
        </section>
        <section style="width: 77%" v-for="(item, index) in listByAdmin" :key="index">{{index+1+'、' + item.provinceName + item.cityName + item.districtName + item.communityName + item.communityAddress}}</section>
      </el-form-item>
      <!-- <el-form-item label="有效范围(米)：" prop="attendanceDistance">
        <el-input v-model="formData.attendanceDistance" @input="toSetNumber(formData, 'round')"></el-input>
      </el-form-item> -->
    </el-form>
    <div slot="footer">
      <!-- <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button> -->
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
    <equipmentSelectDialog v-model="equipmentSelectInfo.visible" :communityAdminId="communityAdminId" :listByAdmin="listByAdmin"  @success="getListByAdmin"/>
  </v-dialog>
</template>
<script>
import equipmentSelectDialog from './equipmentSelectDialog'
export default {
  name: 'attenceSetEditDialog',
  components: { equipmentSelectDialog },
  props: {
    value: Boolean,
    type: { // 1 是 新建  2是设置默认
      type: Number,
      default: 1
    },
    infoObj: { // 表单数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      communityAdminArr: [],
      formData: {
        communityAdminId: ''
      },
      equipmentInfo: {},
      locationList: [],
      adminList: [],
      listByAdmin: [],
      communityAdminId: '',
      formRules: {
        communityAdminId: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      saveLoading: false,
      equipmentSelectInfo: {
        visible: false
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  mounted () {
    this.getAdminList()
  },
  methods: {
    // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
    // 获得社区管理员列表
    async getAdminList () {
      let res = await this.$post('community/communityAdmin/getList')
      if (res.code === 0) {
        this.adminList = res.data.filter(item => {
          return item.username !== 'admin'
        })
      }
    },
    // 考勤地点选择弹窗
    toShowEquipmentSelectDialog () {
      this.equipmentSelectInfo.visible = true
    },
    async handleCommunityAdminChange (val) {
      this.communityAdminId = val
      this.getListByAdmin()
    },
    async getListByAdmin () {
      let res = await this.$post('community/admin2Equipment/listByAdmin', { communityAdminId: this.communityAdminId })
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.listByAdmin = res.data
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
      console.log(this.formData)
      // let res = await this.$post('community/admin2Equipment/bindByAdmin', this.formData)
      // this.saveLoading = false
      // if (res.code !== 0) {
      //   this.$message.error(res.msg)
      //   return false
      // }

      // this.beforeClose()
      // this.$message.success('保存成功')
      // this.$emit('success', 0)
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
        communityAdminId: ''
      }
      this.locationList = []
      // 编辑
      if (this.type !== 1) {
        this.formData = {
          id: this.infoObj.id, // id
          name: this.infoObj.name,
          areaType: this.infoObj.areaType,
          provinceId: this.infoObj.provinceId,
          cityId: this.infoObj.cityId,
          districtId: this.infoObj.districtId,
          streetId: this.infoObj.streetId,
          tribe: this.infoObj.tribe,
          rollNumber: this.infoObj.rollNumber
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
  .chooseBtn{
    position:absolute;
    right: 0;
  }
  .locationItem{
    width: 100%;
    padding: 0 2px;
    color: #ffffff;
    background: #666666;
    border-radius: 6px;
    margin-bottom: 5px;
    font-size: 12px;
  }
</style>
