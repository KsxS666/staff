<!-- 积分规则 - 新增、编辑中的 类型列表 -->
<template>
  <div>
    <div style="margin-bottom: 10px">
      <el-radio-group v-model="typeRule" size="small">
        <el-radio :label="0" border>按重量</el-radio>
        <el-radio :label="1" border v-if="type === 1">按数量</el-radio>
        <el-radio :label="2" border>按次数</el-radio>
      </el-radio-group>
    </div>
    <ruleTable ref="rule0" :typeList="typeList" :typeRule="0" :type="type" :editType="editType" :dataInfo="dataInfo" v-show="typeRule === 0" />
    <ruleTable ref="rule1" :typeList="typeList" :typeRule="1" :type="type" :editType="editType" :dataInfo="dataInfo" v-show="typeRule === 1" />
    <ruleTable ref="rule2" :typeList="typeList" :typeRule="2" :type="type" :editType="editType" :dataInfo="dataInfo" v-show="typeRule === 2" />
  </div>
</template>

<script>
import ruleTable from './ruleTable'
export default {
  name: 'typeTable',
  components: { ruleTable },
  props: {
    value: Boolean,
    editType: { // 1 是 新建  2是修改 3是默认规则
      type: Number,
      default: 1
    },
    type: {
      type: Number,
      default: 0 // 0:智能设备, 1:非智能设备，2:厨余垃圾
    },
    communityId: { // 选中的社区
      type: String,
      default: ''
    },
    dataInfo: { // 选中的社区
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dataList: [],
      typeList: [],
      ruleList: [],
      typeRule: 0
    }
  },
  mounted () {
    this.getTypeList()
    // this.getList()
  },
  methods: {
    // 获得列表 -- 配置的规则
    async getList () {
      if (this.editType === 1) {
        this.dataList = []
        return false
      }
      let req = Object.assign({ integralFlag: this.type }, this.dataInfo)
      this.dataList = []
      let res = await this.$post('integral/integralRule/getList', req)
      if (res.code === 0) {
        this.dataList = res.data.map(item => {
          return {
            // typeId: item.typeId,
            // typeName: item.typeName,
            typeObj: {
              typeId: item.typeId,
              typeName: item.typeName
            },
            integralFlag: item.integralFlag,
            typeValue: item.typeValue.toString()
            // unitValue: item.unitValue
          }
        })
      }
    },
    // 获得回收类型
    async getTypeList () {
      let req = {
        integralFlag: this.type
        // communityId: this.communityId
      }
      let res = await this.$post('integral/integralRule/getTypeListByAdd', req)
      if (res.code === 0) {
        this.typeList = res.data
      }
    },
    // 只能输入数字
    toSetNumber (item, itemName) {
      this.$utils.limitNumInput(item, itemName, this)
    },
    // 添加
    toAdd () {
      this.dataList.push({
        typeObj: null,
        // typeId: '',
        // typeName: '',
        integralFlag: this.type,
        typeValue: ''
        // unitValue: ''
      })
    },
    // 删除
    toDelete (index) {
      this.dataList.splice(index, 1)
    },
    // 校验是否都有填
    validate () {
      if (this.type === 0) {
        this.ruleList = this.$refs.rule0.validate().concat(this.$refs.rule2.validate())
      } else {
        this.ruleList = this.$refs.rule0.validate().concat(this.$refs.rule1.validate()).concat(this.$refs.rule2.validate())
      }
      if (!this.ruleList.length) {
        return []
      }
      // if (typeof (this.ruleList) === 'string') {
      //   return this.ruleList
      // }
      let error = null
      let typeArr = new Set()
      this.ruleList.map(item => {
        if (error) return
        if (!item.typeObj) {
          error = '请选择类别名称'
          return false
        }
        if (item.typeValue === '') {
          error = '请输入积分'
          return false
        }
        if (Number(item.typeValue) < 0) {
          error = '积分需大于0'
          return false
        }
        typeArr.add(item.typeObj.typeId)
      })
      if (error) {
        return error
      }
      if (typeArr.size < this.ruleList.length) {
        return '类型名称不能相同'
      }
      return this.ruleList
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .tableBox{
    line-height: 22px;
  }
  .addBtn{
    margin-bottom: 6px;
  }
</style>
