<!-- 用户编辑、新建页面 -->
<template>
  <v-dialog :title="`${type === 2 ? '编辑' : '新建'}桶`" :visible="value" width="35%" :before-close="beforeClose" append-to-body>
    <el-form class="v-form" :model="formData" :rules="formRules" ref="ruleForm" label-width="100px" style="margin-right: 20px" size="small" @submit.native.prevent>
      <el-form-item label="桶类型"  prop="equipmentTypeId">
        <el-select filterable clearable v-model="formData.equipmentTypeId" placeholder="请选择类型" style="width: 100%;" @change="getTypeName">
          <el-option v-for="item in typeList" :label=item.name :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="无卡投放？" prop="isNeedCard">
        <el-radio v-model="formData.isNeedCard" :label="false">是</el-radio>
        <el-radio v-model="formData.isNeedCard" :label="true">否</el-radio>
      </el-form-item>
      <el-form-item label="" v-show="!formData.isNeedCard">
        <el-button size="small" icon="el-icon-plus" @click="addUnCheck" style="margin-bottom: 6px">添加时间段</el-button>
        <el-table class="v-table tableBox" border :data="formData.unCheckArr">
          <el-table-column align="center" label="序号" width="50">
            <template slot-scope="scope">{{scope.$index + 1}}</template>
          </el-table-column>
          <el-table-column align="center" label="无卡投放时间段">
            <template slot-scope="scope">
              <el-time-picker style="margin-bottom:10px" is-range v-model="scope.row.value" range-separator="-" start-placeholder="开始时间" end-placeholder="结束时间" placeholder="选择时间范围" value-format="HH:mm" format="HH:mm"></el-time-picker>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="100">
            <template slot-scope="scope">
              <!--<el-button size="mini" @click="toShowEdit(scope.row)" type="primary" plain>编辑</el-button>-->
              <el-button size="mini" @click="unCheckDelete(scope.$index)" :disabled="scope.$index === 0" type="danger" plain>删除</el-button>
            </template>
          </el-table-column>
        </el-table>
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
  name: 'barerEditDialog',
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
    equipmentInfo: {
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      formData: {
        name: '',
        equipmentCode: '',
        equipmentName: '',
        equipmentTypeId: '',
        equipmentTypeName: '',
        isNeedCard: true,
        unCheckStartHours: '',
        unCheckStartMinute: '',
        unCheckEndHours: '',
        unCheckEndMinute: '',
        unCheckArr: [{ id: 0, value: '' }]
      },
      formRules: {
        equipmentTypeId: [{ required: true, message: '请选择', trigger: 'change' }],
        isNeedCard: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      saveLoading: false,
      typeList: [] // 桶类型数据
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
  },
  methods: {
    // 获得 所有桶类型 列表  orgId 可能不同， 需要重新获取
    async getTypeList () {
      // 不是 超管 的 orgID 不变， 去一次就行
      if (this.userInfo.username !== 'admin' && this.typeList.length) {
        return true
      }
      if (this.equipmentInfo.typeList) {
        this.typeList = this.equipmentInfo.typeList
        return true
      }
      this.typeList = []
      let reqData = {
        type: 2,
        orgId: this.equipmentInfo.orgId
      }
      let res = await this.$post('equipment/equipmentType/findByType', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      res.data.map(ele => {
        if (ele.indexValue === 1) {
          ele.name = `${ele.name}(左)`
        } else {
          ele.name = `${ele.name}(右)`
        }
      })
      this.typeList = res.data || []
      this.equipmentInfo.typeList = this.typeList
    },
    // 增加无卡投放时间段
    addUnCheck () {
      this.formData.unCheckArr.push({ value: '' })
    },
    // 删除单条无卡投放时间段
    unCheckDelete (index) {
      this.formData.unCheckArr.splice(index, 1)
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
        // 选择是 可无卡投放
        if (!this.formData.isNeedCard) {
          let unCheckStartHours = []
          let unCheckStartMinute = []
          let unCheckEndHours = []
          let unCheckEndMinute = []
          this.formData.unCheckArr.map(item => {
            if (!item.value) return false
            unCheckStartHours.push(item.value[0].substr(0, 2))
            unCheckStartMinute.push(item.value[0].substring(item.value[0].length - 2))
            unCheckEndHours.push(item.value[1].substr(0, 2))
            unCheckEndMinute.push(item.value[1].substring(item.value[1].length - 2))
          })
          if (!unCheckStartHours.length) {
            this.$message.error('请至少填写一个无卡投放时间段')
            return false
          }
          this.formData.unCheckStartHours = unCheckStartHours.join(',')
          this.formData.unCheckStartMinute = unCheckStartMinute.join(',')
          this.formData.unCheckEndHours = unCheckEndHours.join(',')
          this.formData.unCheckEndMinute = unCheckEndMinute.join(',')
        }
        // 下面是保存
        this.saveData()
      })
    },
    // 请求保存
    async saveData () {
      this.saveLoading = true
      let reqData = Object.assign({}, this.formData, { orgId: this.equipmentInfo.orgId, equipmentCode: this.equipmentInfo.equipmentCode })
      delete reqData.unCheckArr
      let res = await this.$post('equipment/barrel/save', reqData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('保存成功')
      this.$emit('edit')
      this.$emit('success', true)
    },
    // 获取桶类型名称
    getTypeName (val) {
      let current = this.typeList.find(item => {
        return item.id === val
      })
      if (current) {
        this.formData.equipmentTypeName = current.name
      }
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
        name: '', // 桶名称
        equipmentCode: '', // 设备编码
        equipmentName: '', // 设备名称
        equipmentTypeId: '', // 设备类型id
        equipmentTypeName: '', // 设备类型名称
        isNeedCard: true, // 是否开启无卡投放
        unCheckStartHours: '', // 无卡投放开始小时集合字符串
        unCheckStartMinute: '', // 无卡投放结束分钟集合字符串
        unCheckEndHours: '', // 无卡投放结束小时集合字符串
        unCheckEndMinute: '', // 无卡投放结束分钟集合字符串
        unCheckArr: [{ value: '' }]
      }
      // 编辑
      if (this.type !== 1) {
        this.formData.id = this.infoObj.id
        this.formData.name = this.infoObj.name
        this.formData.equipmentCode = this.infoObj.equipmentCode
        this.formData.equipmentTypeId = this.infoObj.equipmentTypeId
        this.formData.equipmentTypeName = this.infoObj.equipmentTypeName
        this.formData.isNeedCard = this.infoObj.isNeedCard
        if (this.infoObj.unCheckStartHours) { // 之前选择 无卡投放
          let unCheckStartHours = []
          let unCheckStartMinute = []
          let unCheckEndHours = []
          let unCheckEndMinute = []
          let array = []
          unCheckStartHours = this.infoObj.unCheckStartHours.split(',')
          unCheckStartMinute = this.infoObj.unCheckStartMinute.split(',')
          unCheckEndHours = this.infoObj.unCheckEndHours.split(',')
          unCheckEndMinute = this.infoObj.unCheckEndMinute.split(',')
          for (let i in unCheckStartHours) {
            let obj = { value: [unCheckStartHours[i] + ':' + unCheckStartMinute[i], unCheckEndHours[i] + ':' + unCheckEndMinute[i]] }
            array.push(obj)
          }
          this.formData.unCheckArr = array
        }
      }
      this.formData = JSON.parse(JSON.stringify(this.formData))
      this.$nextTick(() => {
        this.$refs.ruleForm && this.$refs.ruleForm.clearValidate()
      })
      this.getTypeList()
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .tableBox{
    line-height: 22px;
  }
</style>
