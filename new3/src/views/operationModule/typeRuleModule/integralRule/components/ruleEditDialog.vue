<!-- 积分规则 - 新增 编辑 -->
<template>
  <v-dialog :title="`${type === 3 ? '设置默认' : type === 2 ? '编辑' : '新建'}规则`"  :visible="value" width="900px" :before-close="beforeClose">
    <el-form class="v-form" :model="formData" :rules="type === 1 ? formRules : {}" ref="ruleForm" label-width="100px" style="margin-right: 20px"  size="small" @submit.native.prevent>
      <el-form-item label="类型">
        {{type === 3 ? '默认规则' : '非默认规则'}}
      </el-form-item>
      <el-form-item v-if="type === 2" label="区域">
        {{infoObj.provinceName}} {{infoObj.cityName}} {{infoObj.districtName}}  {{infoObj.communityName}}
      </el-form-item>
      <areaForm v-show="type === 1" v-model="value" ref="areaForm" :level="3" :formData="formData"  @change="getCommunityList"/>
      <el-form-item v-show="type === 1" label="小区" prop="communityId">
        <el-select filterable clearable v-model="formData.communityId">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="设备类型">
        <el-tabs type="card">
          <el-tab-pane label="智能设备" name="0">
            <typeTable ref="typeRef0" :type="0" :editType="type" v-model="value" :dataInfo="formData"/>
          </el-tab-pane>
          <el-tab-pane label="非智能设备" name="1">
            <typeTable ref="typeRef1" :type="1" :editType="type" v-model="value" :dataInfo="formData"/>
          </el-tab-pane>
        </el-tabs>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
import typeTable from './typeTable'
export default {
  name: 'ruleEditDialog',
  components: { typeTable },
  props: {
    value: Boolean,
    type: { // 1 是 新建  2是修改 3是默认规则
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
      formData: {
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: ''
      },
      formRules: {
        provinceId: [{ required: true, message: '请选择省', trigger: 'change' }],
        cityId: [{ required: true, message: '请选择市', trigger: 'change' }]
        // districtId: [{ required: true, message: '请选择区', trigger: 'change' }],
        // communityId: [{ required: true, message: '请选择小区', trigger: 'change' }]
      },
      communityList: [], // 社区列表
      saveLoading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  mounted () {
  },
  methods: {
    // 获取社区列表 当省市区街道发生变化时， 加载
    async getCommunityList (isShow) { // isShow 是否是回显的
      if (!isShow) this.formData.communityId = ''
      this.communityList = []
      if (!this.formData.provinceId || !this.formData.cityId || !this.formData.districtId) {
        return false
      }
      let req = {
        provinceId: this.formData.provinceId,
        cityId: this.formData.cityId,
        districtId: this.formData.districtId
      }
      let res = await this.$post('community/community/getCommunityList', req)
      if (res.code === 0) {
        this.communityList = res.data
      }
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
        // 下面是校验表格的数据
        let res0 = this.$refs.typeRef0.validate()
        let res1 = this.$refs.typeRef1.validate()
        console.log(res0.concat(res1))
        if (typeof res0 === 'string') { // res0  不为 true 时
          this.$message.error(`智能设备-${res0}`)
          return false
        }
        if (typeof res1 === 'string') { // res0  不为 true 时
          this.$message.error(`非智能设备-${res1}`)
          return false
        }
        // 下面是返回数组的
        // if (typeof res0 === 'object' && typeof res1 === 'object') { // 两个都是空数组时
        //   this.$message.error('请添加类型')
        //   return false
        // }
        let list = res0.concat(res1)
        console.log('list', list)
        if (!list.length) { // 两个都是空数组时
          this.$message.error('请添加类型')
          return false
        }
        console.log('下面是成功', list)
        this.saveData(list)
        return false
      })
    },
    // 请求保存
    async saveData (list) {
      let reqData = Object.assign({}, this.formData)
      reqData.isAdd = this.type === 1
      reqData.dataArray = JSON.stringify(list)
      this.saveLoading = true
      let res = await this.$post('integral/integralRule/saveOrUpdate', reqData)
      this.saveLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
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
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: ''
      }
      // 编辑
      if (this.type === 2) {
        this.formData = {
          id: this.infoObj.id, // id
          provinceId: this.infoObj.provinceId,
          cityId: this.infoObj.cityId,
          districtId: this.infoObj.districtId,
          communityId: this.infoObj.communityId
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

</style>
