<template>
    <v-dialog title="选择考勤地点" width="80%" :visible="value" :before-close="beforeClose" append-to-body>
      <el-tabs type="border-card" @tab-click="tabClick">
        <el-tab-pane label="智能设备">
          <tabTable ref="tabTable1" :value="value" :listByAdmin="listByAdmin" :equipmentProperty="0" />
        </el-tab-pane>
        <el-tab-pane label="非智能设备">
          <tabTable ref="tabTable2" :value="value" :listByAdmin="listByAdmin" :equipmentProperty="1" />
        </el-tab-pane>
      </el-tabs>
      <!-- <el-table ref="selectTable" class="v-table" border v-loading="mainLoading" :data="dataList" stripe height="450px" :row-key="getRowKeys" @selection-change='handleSelectionChange' >
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
      </el-table> -->
      <div slot="footer" style="text-align: center">
        <el-button type="primary" :loading="saveLoading" @click="toSave">确 定</el-button>
        <el-button @click="beforeClose">关 闭</el-button>
      </div>
      <!-- <div class="v-page v-text-center" v-if="formData.total">
        <el-pagination :current-page="formData.page" :page-size="formData.size" layout="total, sizes, prev, pager, next, jumper" :page-sizes="[20, 50, 100, 150]" @current-change="handleCurrentChange" @size-change="handleSizeChange" :total="formData.total"> </el-pagination>
      </div> -->
  </v-dialog>
</template>

<script>
import tabTable from './tabTable'
export default {
  name: 'equipmentSelectDialog',
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
  components: { tabTable },
  data () {
    return {
      dataList: [],
      mainLoading: false,
      saveLoading: false,
      communityList: [],
      equipmentArrays: [],
      selections: [],
      // listByAdmin: [],
      val1: [],
      val2: []
      // hasSelect: new Map(),
      // currentSelect: new Map(),
      // formData: {
      //   provinceId: '',
      //   cityId: '',
      //   districtId: '',
      //   streetId: '',
      //   communityId: '',
      //   equipmentProperty: 0,
      //   size: 20,
      //   page: 1,
      //   total: 0
      // },
      // isShowTable: false
    }
  },
  methods: {
    getRowKeys (row) {
      return row.id
    },
    async getList (equipmentProperty = 0) {
      // console.log(11111, this.listByAdmin)
      // let reqData = Object.assign({}, this.formData)
      // reqData.orgId = this.userInfo.orgId
      // reqData.equipmentProperty = equipmentProperty
      // delete reqData.total
      // this.mainLoading = true
      // let res = await this.$post('equipment/equipment/getPage', reqData)
      // this.mainLoading = false
      // if (res.code !== 0) {
      //   res.msg && this.$message.error(res.msg)
      //   return false
      // }
      // this.dataList = res.data.resultList || []
      // this.formData.total = res.data.totalNum
      // let toggleRowSelection = []
      // let oldSelectArr = this.listByAdmin
      // // 之前有加载过这一页的  从hasSelect取之前选中的
      // if (this.hasSelect.has(this.formData.page)) {
      //   oldSelectArr = this.hasSelect.get(this.formData.page)
      // }
      // oldSelectArr.map(item => {
      //   this.dataList.map(listItem => {
      //     if (item.equipmentId === listItem.id) {
      //       toggleRowSelection.push(listItem)
      //     }
      //   })
      // })
      // // this.$refs.selectTable.clearSelection()
      // this.$nextTick(() => {
      //   toggleRowSelection.map(item => {
      //     this.$refs.selectTable.toggleRowSelection(item, true)
      //   })
      // })
      // console.log(22222, this.listByAdmin)
    },
    async getListByAdmin () {
      let res = await this.$post('community/admin2Equipment/listByAdmin', { communityAdminId: this.communityAdminId })
      this.saveLoading = false
      this.isShowTable = true
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      // this.listByAdmin = res.data.map(ele => {
      //   return {equipmentId: ele.equipmentId, id: ele.equipmentId, equipmentCode: ele.equipmentCode, equipmentProperty: ele.equipmentProperty, address: `${ele.cityName}${ele.districtName}${ele.communityName}${ele.communityAddress}`}
      // })
    },
    // 获取社区列表 当省市区街道发生变化时， 加载
    // async getCommunityList () {
    //   this.formData.communityId = ''
    //   let req = {
    //     provinceId: this.formData.provinceId,
    //     cityId: this.formData.cityId,
    //     districtId: this.formData.districtId,
    //     streetId: this.formData.streetId
    //   }
    //   let res = await this.$post('community/community/getCommunityList', req)
    //   if (res.code === 0) {
    //     this.communityList = res.data
    //   }
    // },
    // set1 (val) {
    //   this.val1 = val
    // },
    // set2 (val) {
    //   this.val2 = val
    // },
    tabClick (e) {},
    // // 查询
    // toSearch () {
    //   this.formData.page = 1
    //   this.getList()
    // },
    // handleSelectionChange (selections) {
    //   // console.log('haisdada ', selections)
    //   this.selections = selections
    //   let hasIdArr = []
    //   this.equipmentArrays = selections.map(ele => {
    //     hasIdArr.push(ele.id)
    //     return {equipmentId: ele.id, equipmentCode: ele.equipmentCode, equipmentProperty: this.formData.equipmentProperty, address: `${ele.cityName}${ele.districtName}${ele.communityName}${ele.communityAddress}`}
    //   })
    //   // 保存每一页各自选中的
    //   this.hasSelect.set(this.formData.page, this.equipmentArrays)
    //   //  在 hasSelect 9999999中删除取消选中的项
    //   if (!this.hasSelect.has(9999999)) return
    //   let oldSelect = this.hasSelect.get(9999999)
    //   if (!oldSelect || !oldSelect.length) return
    //   let noSelect = this.dataList.filter(item => {
    //     return hasIdArr.indexOf(item.id) === -1
    //   })
    //   oldSelect.map((item, i) => {
    //     let find = noSelect.find(findItem => {
    //       return findItem.id === item.equipmentId
    //     })
    //     console.log('find', find)
    //     if (find) {
    //       oldSelect.splice(i, 1)
    //     }
    //   })
    // },
    // // 切换页面 - 页码
    // handleCurrentChange (val) {
    //   this.formData.page = val
    //   this.getList()
    // },
    // // 切换页面 - 页size
    // handleSizeChange (val) {
    //   this.formData.page = 1
    //   this.formData.size = val
    //   this.getList()
    // },
    // 保存
    toSave () {
      let val1 = this.$refs.tabTable1.toSave()
      let val2 = this.$refs.tabTable2.toSave()
      // let list = [...this.hasSelect.values()]
      // let allList = []
      // list.map(arr => {
      //   allList = allList.concat(arr)
      // })
      // console.log('list', list, allList)
      let all = val1.concat(val2)
      let filterMap = new Map()

      all.map(item => {
        filterMap.set(item.equipmentId, item)
      })
      let filterList = [...filterMap.values()]
      // if (!filterList.length) {
      //   this.$message.error('请选择设备')
      //   return
      // }
      this.saveData(filterList)
    },
    // 请求保存
    async saveData (allList) {
      // this.$emit('locationSet', allList)
      // this.beforeClose()
      // this.formData.equipmentArrays = JSON.stringify(allList)
      // this.formData.communityAdminId = this.communityAdminId
      // let a = []
      // let b = [...allList,...a]
      let reqData = {
        equipmentArrays: JSON.stringify(JSON.parse(JSON.stringify(allList))),
        communityAdminId: this.communityAdminId
      }
      // console.log('reqData', reqData)
      this.saveLoading = true
      let res = await this.$post('community/admin2Equipment/bindByAdmin', reqData)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('保存成功')
      this.$emit('success')
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
      // if (!newVal) return false
      // this.formData = {
      //   provinceId: '',
      //   cityId: '',
      //   districtId: '',
      //   streetId: '',
      //   communityId: '',
      //   equipmentProperty: 0,
      //   size: 20,
      //   page: 1,
      //   total: 0
      // }
      // this.isShowTable = false
      // this.getList()
      // this.getListByAdmin()
      // this.$nextTick(() => {
      //   // this.$refs.tabTable.clear()
      // })
      // this.$refs.tabTable.clear()
      // this.hasSelect.clear()
      // this.hasSelect.set(9999999, this.listlistByAdmin || [])
    }
  }
}
</script>

<style>

</style>
