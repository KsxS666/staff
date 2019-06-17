<template>
    <v-dialog title="选择考勤地点" :visible="value" width="60%" :before-close="beforeClose" append-to-body>
      <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
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
      <el-table ref="selectTable" class="v-table" border v-loading="mainLoading" :data="dataList" stripe height="450px" :row-key="getRowKeys" @selection-change='handleSelectionChange' >
        <el-table-column type="selection" ></el-table-column>
        <el-table-column label="序号" align="center" width="70px">
          <template slot-scope="scope">
            {{(formData.page - 1) * formData.size + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="设备编号" prop="equipmentCode"  align="center"> </el-table-column>
        <el-table-column label="设备名称" prop="equipmentName"  align="center"> </el-table-column>
        <el-table-column label="地址" prop="communityAddress"  align="center"> </el-table-column>
        <el-table-column label="考勤有效范围" prop="attendanceDistance"  align="center"> </el-table-column>
      </el-table>
      <div slot="footer" style="text-align: center">
        <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
        <el-button @click="beforeClose">关 闭</el-button>
      </div>
      <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: Boolean,
    communityAdminId: {
      type: String,
      default: () => ''
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
      hasSelect: new Map(),
      currentSelect: new Map(),
      formData: {
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        equipmentProperty: 0,
        size: 20,
        page: 1,
        total: 0
      }
    }
  },
  methods: {
    getRowKeys (row) {
      return row.id
    },
    async getList (equipmentProperty = 0) {
      let reqData = Object.assign({}, this.formData)
      reqData.equipmentProperty = equipmentProperty
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
      let oldSelectArr = this.listByAdmin
      // 之前有加载过这一页的  从hasSelect取之前选中的
      if (this.hasSelect.has(this.formData.page)) {
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
    tabClick (e) {
      this.getList(e.index)
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    handleSelectionChange (selections) {
      this.selections = selections
      let hasIdArr = []
      this.equipmentArrays = selections.map(ele => {
        hasIdArr.push(ele.id)
        return { equipmentId: ele.id, id: ele.id, equipmentCode: ele.equipmentCode, equipmentProperty: 0 }
      })
      // 保存每一页各自选中的
      this.hasSelect.set(this.formData.page, this.equipmentArrays)
      //  在 hasSelect 9999999中删除取消选中的项
      if (!this.hasSelect.has(9999999)) return
      let oldSelect = this.hasSelect.get(9999999)
      if (!oldSelect || !oldSelect.length) return
      let noSelect = this.dataList.filter(item => {
        return hasIdArr.indexOf(item.id) === -1
      })
      oldSelect.map((item, i) => {
        let find = noSelect.find(findItem => {
          return findItem.id === item.id
        })
        if (find) {
          oldSelect.splice(i, 1)
        }
      })
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
    // 保存
    toSave () {
      let list = [...this.hasSelect.values()]
      let allList = []
      list.map(arr => {
        allList = allList.concat(arr)
      })

      let filterMap = new Map()

      allList.map(item => {
        filterMap.set(item.equipmentId, item)
      })

      let filterList = [...filterMap.values()]
      if (!filterList.length) {
        this.$message().error('请选择设备')
        return
      }
      this.saveData(filterList)
    },
    // 请求保存
    async saveData (allList) {
      this.saveLoading = true
      let reqData = { communityAdminId: this.communityAdminId, equipmentArrays: JSON.stringify(allList) }
      let res = await this.$post('community/admin2Equipment/bindByAdmin', reqData)
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
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) return false
      this.formData = {
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        equipmentProperty: 0,
        size: 20,
        page: 1,
        total: 0
      }
      this.getList()
      this.hasSelect.clear()
      this.hasSelect.set(9999999, this.listByAdmin || [])
    }
  }
}
</script>

<style>

</style>
