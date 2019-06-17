<template>
  <div>
    <el-form :model="formData" class="v-form v-form-search" label-width="0"  @submit.native.prevent>
      <areaSearch ref="areaSearch" isCommunity :level="4" :formData="formData" @change="getCommunityList"/>
      <el-form-item>
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="selectTable" class="v-table" border v-loading="mainLoading" :data="dataList" stripe height="450px" @selection-change='handleSelectionChange' >
      <el-table-column type="selection" ></el-table-column>
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="设备编号" prop="equipmentCode"  align="center"> </el-table-column>
      <el-table-column label="设备名称" prop="equipmentName"  align="center"> </el-table-column>
      <el-table-column label="地址" prop="communityAddress"  align="center"> </el-table-column>
      <el-table-column label="考勤有效范围" prop="attendanceDistance" align="center"> </el-table-column>
    </el-table>
    <!-- <div slot="footer" style="text-align: center">
      <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div> -->
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'tabTable',
  props: {
    value: Boolean,
    // formData: {
    //   type: Object,
    //   default: () => {}
    // },
    equipmentProperty: {
      type: Number,
      default: () => 0
    },
    listByAdmin: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      dataList: [],
      mainLoading: false,
      saveLoading: false,
      communityList: [],
      equipmentArrays: [],
      selections: [],
      oldSelectByAdmin: [],
      hasSelect: new Map(),
      currentSelect: new Map(),
      formData: {
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        communityId: '',
        equipmentProperty: 0,
        size: 20,
        page: 1,
        total: 0
      }
    }
  },
  created () {
    this.getList()
    this.getCommunityList()
  },
  mounted () {
    this.getOldSelect()
    this.hasSelect.clear()
    this.hasSelect.set(9999999, JSON.parse(JSON.stringify(this.oldSelectByAdmin || [])))
  },
  updated () {
    // this.hasSelect.clear()
    // this.hasSelect.set(9999999, this.listByAdmin || [])
    // console.log(777, this.hasSelect)
  },
  methods: {
    async getList (equipmentProperty = 0) {
      let reqData = Object.assign({}, this.formData)
      reqData.equipmentProperty = this.equipmentProperty
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('equipment/equipment/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
      let toggleRowSelection = []
      let oldSelectArr = JSON.parse(JSON.stringify(this.oldSelectByAdmin))
      // 之前有加载过这一页的  从hasSelect取之前选中的
      // console.log('this.hasSelect2', this.hasSelect)
      if (this.hasSelect.has(this.formData.page)) {
        // alert(this.formData.page)
        // alert('加载过这页了！')
        oldSelectArr = this.hasSelect.get(this.formData.page)
      }
      oldSelectArr.map(item => {
        this.dataList.map(listItem => {
          if (item.equipmentId === listItem.id) {
            toggleRowSelection.push(listItem)
          }
        })
      })
      this.$refs.selectTable.clearSelection()
      this.$nextTick(() => {
        toggleRowSelection.map(item => {
          this.$refs.selectTable.toggleRowSelection(item, true)
        })
      })
    },
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
      }
    },
    getOldSelect () {
      this.oldSelectByAdmin = this.listByAdmin.filter(item => {
        return item.equipmentProperty === this.equipmentProperty
      })
    },
    handleSelectionChange (selections) {
      let hasIdArr = []
      this.equipmentArrays = selections.map(ele => {
        hasIdArr.push(ele.id)
        return { equipmentId: ele.id, equipmentCode: ele.equipmentCode, equipmentProperty: this.equipmentProperty, address: `${ele.cityName}${ele.districtName}${ele.communityName}${ele.communityAddress}` }
      })
      // 保存每一页各自选中的
      this.hasSelect.set(this.formData.page, this.equipmentArrays)
      //  在 hasSelect 9999999中删除取消选中的项
      // if (!this.hasSelect.has(9999999)) return
      console.log('this.hasSelect5', this.hasSelect)
      let oldSelect = this.hasSelect.get(9999999)
      console.log('oldSelect', oldSelect)
      if (!oldSelect || !oldSelect.length) return
      let noSelect = this.dataList.filter(item => {
        return hasIdArr.indexOf(item.id) === -1
      })
      oldSelect && oldSelect.length && oldSelect.map((item, i) => {
        let find = noSelect.find(findItem => {
          return findItem.id === item.equipmentId
        })
        if (find) {
          oldSelect.splice(i, 1)
        }
      })
      this.hasSelect.set(9999999, oldSelect)
      console.log('hasSelect6', this.hasSelect)
      //   let list = [...this.hasSelect.values()]
      //   let allList = []
      //   list.map(arr => {
      //     allList = allList.concat(arr)
      //   })
      //   let filterMap = new Map()

    //   allList.map(item => {
    //     filterMap.set(item.equipmentId, item)
    //   })
    //   console.log('selectionslist', list, allList, filterMap)
    //   let filterList = [...filterMap.values()]
    //   // if (!allList.length) {
    //   //   this.$message().err('请选择设备')
    //   //   return
    //   // }
    //   // this.saveData(allList)
    //   if (this.equipmentProperty === 0) {
    //     this.$emit('set1', filterList)
    //   } else {
    //     this.$emit('set2', filterList)
    //   }
    },
    // 切换页面 - 页码
    handleCurrentChange (val) {
      this.formData.page = val
      this.getList()
    },
    // 切换页面 - 页size
    handleSizeChange (val) {
      this.formData.page = 1
      this.formData.size = val
      this.getList()
    },
    clear () {
      this.$refs.selectTable.clearSelection()
    },
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 保存
    toSave () {
      let list = [...this.hasSelect.values()]
      // if (this.hasSelect.has(9999999)) {
      //   list.splice(0, 1)
      // }
      console.log('listsave', list, this.hasSelect)
      let allList = []
      list.map(arr => {
        allList = allList.concat(arr)
      })
      // if (!allList.length) {
      //   this.$message().err('请选择设备')
      //   return
      // }
      return allList
      // this.saveData(allList)
    },
    // 请求保存
    async saveData (allList) {
      this.$emit('locationSet', allList)
      this.beforeClose()
    },
    // 关闭弹窗
    beforeClose () {
      this.$emit('input', false)
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) return false
      this.$refs.selectTable.clearSelection()
      this.getOldSelect()
      this.hasSelect.clear()
      this.hasSelect.set(9999999, JSON.parse(JSON.stringify(this.oldSelectByAdmin || [])))
      // console.log('hasSelect1', this.hasSelect)
      this.formData = {
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        communityId: '',
        equipmentProperty: 0,
        size: 20,
        page: 1,
        total: 0
      }
      this.getList()
    }
  }
}
</script>

<style>

</style>
