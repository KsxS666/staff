<!-- 用户编辑、新建页面 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}用户`" :visible="value" width="650px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="100px" style="margin-right: 20px" size="small" @submit.native.prevent>
      <el-form-item label="姓名" prop="name">
        <el-input v-model="formData.name"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="phone">
        <el-input v-model="formData.phone"></el-input>
      </el-form-item>
      <el-form-item label="所属小区" prop="communityObj">
        <el-select filterable clearable v-model="formData.communityObj" value-key="id" @change="getHouseList(1)">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="楼号/年段" prop="building">
        <el-select filterable clearable v-model="formData.building" @change="getHouseList(2)">
          <el-option v-for="(item, i) in buildingList" :key="i" :label="item.label" :value="item.label"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单元/班级" prop="unit" v-if="!isSchool">
        <el-select filterable clearable v-model="formData.unit" @change="getHouseList(3)">
          <el-option v-for="(item, i) in unitList" :key="i" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="单元/班级" prop="unit" v-else>
        <el-select filterable clearable v-model="formData.unit" @change="getHouse1">
          <el-option v-for="(item, i) in unitList" :key="i" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="门牌号" prop="door" v-if="!isSchool">
        <el-select filterable clearable v-model="formData.door" @change="getHouse2">
          <el-option v-for="(item, i) in doorList" :key="i" :label="item.label" :value="item.value"></el-option>
        </el-select>
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
  name: 'userEditDialog',
  props: {
    value: Boolean,
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
    // let validatePhone = (rule, value, callback) => {
    //   if (!this.$utils.checkPhoneNum(value)) {
    //     callback(new Error('请输入正确的手机号格式'))
    //     return false
    //   }
    //   callback()
    // }
    return {
      formData: {
        name: '', // 姓名
        phone: '', // 手机号
        communityObj: null, // 小区id
        building: '', // 楼号、年段id
        unit: '', // 单元、班级id
        door: '' // 门牌号id
      },
      formRules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        // phone: [{ required: true, message: '请输入手机号', trigger: 'blur' }, { validator: validatePhone, trigger: 'blur' }],
        communityObj: [{ required: true, message: '请选择小区', trigger: 'change' }],
        building: [{ required: true, message: '请选择楼号/年段', trigger: 'change' }],
        unit: [{ required: true, message: '请选择单元/班级', trigger: 'change' }],
        door: [{ required: true, message: '请选择门牌号', trigger: 'change' }]
      },
      saveLoading: false,
      buildingList: [], // 楼号、单元、 门牌号 列表
      unitList: [],
      doorList: [],
      isSchool: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  methods: {
    // 获得 楼号、单元、 门牌号 列表
    async getHouseList (level, isShow, val) {
      console.log(level, val)
      let listName = 'buildingList'
      let reqData = Object.assign({}, this.formData)
      delete reqData.communityObj
      if (!this.formData.communityObj) { return }
      reqData.communityId = this.formData.communityObj.id
      switch (level) {
        case 1:
          this.isSchool = this.formData.communityObj.areaType === 1
          reqData.building = ''
          reqData.unit = ''
          reqData.door = ''
          if (!isShow) {
            this.formData.building = ''
            this.formData.unit = ''
            this.formData.door = ''
          }
          this.buildingList = []
          this.unitList = []
          this.doorList = []
          break
        case 2:
          listName = 'unitList'
          reqData.unit = ''
          if (!isShow) {
            this.formData.unit = ''
            this.formData.door = ''
          }
          this.unitList = []
          this.doorList = []
          break
        case 3:
          reqData.door = ''
          listName = 'doorList'
          if (!isShow) {
            this.formData.door = ''
          }
          this.doorList = []
      }

      // if (isShow) {
      //   reqData.building = ''
      //   reqData.unit = ''
      //   reqData.door = ''
      // }
      let res = await this.$post('user/api/house/getChildList', reqData)
      if (res.code === 0) {
        this[listName] = res.data
      }
    },
    getHouse1 (val) {
      this.formData.houseId = val
    },
    getHouse2 (val) {
      this.formData.houseId = val
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
      let reqData = Object.assign({}, this.formData)
      delete reqData.communityObj
      reqData.communityId = this.formData.communityObj.id ? this.formData.communityObj.id : ''
      // reqData.houseId = this.isSchool ? this.formData.unit : this.formData.door
      let res = await this.$post('user/user/saveOrUpdate', reqData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }

      this.beforeClose()
      this.$message.success('保存成功')
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
        name: '', // 姓名
        phone: '', // 手机号
        communityObj: null, // 小区id
        building: '', // 楼号、年段id
        unit: '', // 单元、班级id
        door: '' // 门牌号id
      }
      this.doorList = []
      this.unitList = []
      this.buildingList = []
      // 编辑
      if (this.type !== 1) {
        const id = this.infoObj.house ? this.infoObj.house.communityId : ''
        let communityObj = id ? this.communityList.find((i) => { return i.id === id }) : null
        this.formData = {
          id: this.infoObj.id, // id
          name: this.infoObj.name, // 姓名
          phone: this.infoObj.phone, // 手机号
          communityObj,
          building: this.infoObj.house ? this.infoObj.house.building : '',
          unit: this.infoObj.house ? this.infoObj.house.unit : '',
          door: this.infoObj.house ? this.infoObj.house.doorNumber : '',
          houseId: this.infoObj.house ? this.infoObj.house.id : ''
        }
        this.getHouseList(1, true)
        if (!this.formData.communityObj) {
          return false
        }
        this.getHouseList(2, true)
        if (!this.formData.building) {
          return false
        }
        this.getHouseList(3, true)
        if (!this.formData.unit) {
          return false
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

<style lang="scss" scoped rel="stylesheet/scss">
</style>
