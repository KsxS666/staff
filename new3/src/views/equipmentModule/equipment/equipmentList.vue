<!-- 二分类机列表 -->
<template>
  <div class="v-wrap">
    <el-tabs type="border-card" @tab-click="tabClick">
      <el-tab-pane label="智能设备" style="min-height: calc(100vh - 260px)">
        <tabTable :equipmentProperty=0 v-if="hasShow['list1']"/>
      </el-tab-pane>
      <el-tab-pane label="非智能设备" name="list2" style="min-height: calc(100vh - 260px)">
        <tabTable :equipmentProperty=1 v-if="hasShow['list2']"/>
      </el-tab-pane>
    </el-tabs>
  </div>

</template>
<script>
import tabTable from './components/tabTable'
export default {
  name: 'equipmentList',
  components: { tabTable },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        equipmentName: '',
        equipmentCode: '',
        typeId: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        communityId: '',
        page: 1,
        size: 20,
        total: 0
      },
      hasShow: { 'list1': true },
      isSelection: false,
      equipmentIds: [],
      dataList: [], // 主列表
      communityList: [], // 小区 列表
      allCommunityList: [], // 所有的小区的列表
      editInfo: { // 编辑、新增 的数据
        visible: false,
        type: 1, // 1 是 新建  2是修改
        infoObj: {}
      },
      bareListInfo: { // 桶列表
        visible: false,
        id: null
      },
      attenceSetInfo: {
        visible: false,
        type: 1,
        infoObj: {}
      },
      batchInfo: {
        visible: false
      }
    }
  },
  created () {
    this.getList()
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.topButton = !btnList.userAdd && !btnList.userDeleteMulti && !btnList.userDeleteAll && !btnList.userFileDownload && !btnList.userImport && !btnList.userDownload ? null : true
      btnList.tableButton = !btnList.userEdit && !btnList.userWasteRecode && !btnList.userDelete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取设备列表
    async getList () {
      this.isSelection = false
      let reqData = Object.assign({}, this.formData)
      reqData.orgId = this.userInfo.orgId
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
        if (!this.allCommunityList.length) {
          this.allCommunityList = res.data
        }
      }
    },
    tabClick (e) {
      console.log('this.hasShow', this.hasShow)
      // this.hasShow[`${e.name}`] = true
      this.hasShow = Object.assign({}, this.hasShow, {
        [`${e.name}`]: true
      })
      // this.$set(this.hasShow, `${e.name}`, true)
      // console.log('this.hasShow', this.hasShow, this.hasShow['正常'])
    },
    handleSelectChange (val) {
      this.equipmentIds = val.map(ele => {
        return ele.id
      })
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        equipmentName: '',
        equipmentCode: '',
        typeId: '',
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        communityId: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.$refs.areaSearch.toResetValue()
      this.getList()
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
    // 显示二分类机"新增，查看，编辑" 的弹窗
    toShowEditDialog (type, index) { // 1 是 新建  2是修改  3是查看
      this.editInfo.type = type
      let data = null
      if (type !== 1) {
        data = this.dataList[index]
      }
      this.editInfo.visible = true
      this.editInfo.infoObj = data
    },
    // 显示当前设备桶的弹窗
    toShowBareListDialog (index) {
      let data = null
      data = this.dataList[index]
      this.bareListInfo.visible = true
      this.bareListInfo.infoObj = data
    },
    toShowAttenceSetDialog (index) {
      let data = null
      data = this.dataList[index]
      this.attenceSetInfo.visible = true
      this.attenceSetInfo.infoObj = data
    },
    toShowBatchDialog () {
      this.batchInfo.visible = true
    },
    // 删除二分类机
    toDelete (id) {
      this.$confirm('确定删除该设备？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('equipment/equipment/delete', { id })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.getList()
            } else {
              res.msg && this.$message.error(res.msg)
            }
            done()
          } else {
            done()
          }
        }
      }).then(() => {
        return true
      }).catch(() => {
        return false
      })
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
