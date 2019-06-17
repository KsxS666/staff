<template>
  <div>
    <el-button size="small" class="addBtn" icon="el-icon-plus" @click="toAdd" style="margin-bottom: 10px">添加类型</el-button>
    <el-table class="tableBox v-table" border :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="类别名称" prop="communityName"  align="center">
        <template slot-scope="scope">
          <el-select size="mini" filterable clearable v-model="scope.row.typeObj" value-key="typeId">
            <el-option v-for="(item, i) in typeList" :key="i" :label="item.typeName" :value="item"> </el-option>
          </el-select>
        </template>
      </el-table-column>
      <!-- <el-table-column label="单位（kg/个）" prop="provinceName"  align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.unitValue" :maxlength="8" @input="toSetNumber(scope.row, 'unitValue')"></el-input>
        </template>
      </el-table-column> -->
      <el-table-column :label="`${typeRule === 0 ?'积分/kg' : (typeRule === 1 ? '积分/个' :'积分/次')}`" prop="cityName"  align="center">
        <template slot-scope="scope">
          <el-input size="mini" v-model="scope.row.typeValue" :maxlength="8" @input="toSetNumber(scope.row, 'typeValue')"></el-input>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="80px" align="center" >
        <template slot-scope="scope">
          <el-button plain size="mini" type="danger" @click="toDelete(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  name: 'ruleTable',
  props: {
    // dataList: {
    //   type: Array,
    //   default: () => []
    // },
    typeList: {
      type: Array,
      default: () => []
    },
    type: {
      type: Number,
      default: 0
    },
    editType: { // 1 是 新建  2是修改 3是默认规则
      type: Number,
      default: 1
    },
    typeRule: {
      type: Number,
      default: 0
    },
    dataInfo: { // 选中的社区
      type: Object,
      default: null
    }
  },
  data () {
    return {
      dataList: []
    }
  },
  mounted () {
    this.getList()
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
        let dataList = res.data.map(item => {
          if (this.typeRule === item.typeRule) {
            return {
              typeId: item.typeId,
              typeName: item.typeName,
              typeObj: {
                typeId: item.typeId,
                typeName: item.typeName,
                typeRule: this.typeRule
              },
              integralFlag: item.integralFlag,
              typeRule: this.typeRule,
              typeValue: item.typeValue.toString()
              // unitValue: item.unitValue
            }
          }
        })
        this.dataList = dataList.filter(ele => ele)
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
        integralFlag: this.type,
        typeValue: '',
        typeRule: this.typeRule
      })
    },
    // 删除
    toDelete (index) {
      this.dataList.splice(index, 1)
    },
    // 校验是否都有填
    validate () {
      if (!this.dataList.length) {
        return []
      }
      this.dataList.map(item => {
        item.typeId = item.typeObj ? item.typeObj.typeId : null
        item.typeName = item.typeObj ? item.typeObj.typeName : null
        item.typeRule = this.typeRule
      })
      return this.dataList
    }
  },
  watch: {
    dataInfo: {
      deep: true,
      handler () {
        this.getList()
      }
    }
  }
}
</script>

<style>

</style>
