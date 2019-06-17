<!-- 社区管理员 绑定社区 -->
<template>
  <v-dialog title="绑定社区"  :visible="value" width="850px" :before-close="beforeClose">
    <el-cascader :options="areaList" v-model="currentArr" @change="handleItemChange" :props="props" style="margin: 0 10px 10px 0; min-width: 309px" clearable change-on-select></el-cascader>
    <el-button type="primary" :loading="saveLoading" @click="toSearch" icon="el-icon-search">查询</el-button>
    <el-transfer class="bindAdminTransferWrap" v-model="currentBindCommunityList" filterable v-loading="mainLoading"
      :titles="['未绑定', '已绑定']" :props="{ key: 'id', label: 'name' }"
      :data="communityList">
      <span slot-scope="{ option }"> {{option.name ? `${option.name}-${option.id}` : (option.id ? option.id : option.username)}}</span>
    </el-transfer>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="saveData">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'bindCommunityDialog',
  props: {
    value: Boolean,
    infoObj: { // 单项数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      mainLoading: true,
      currentArr: [],
      areaList: [],
      communityList: [], // 社区列表
      currentBindCommunityList: [], // 当前绑定的管理员的id 列表
      saveLoading: false,
      formData: {
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: ''
      },
      props: {
        value: 'id',
        label: 'name',
        children: 'children'
      },
      selectedOptions: []
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.getCommunityList()
    this.getArea()
  },
  methods: {
    handleItemChange (val) {
      console.log(51515, JSON.parse(JSON.stringify(val)))
      if (!val.length) return
      let currentObj = this.getCurrentObj(val, this.areaList)
      if (currentObj.children && currentObj.children.length) return
      this.getArea(currentObj, val.length)
    },
    getCurrentObj (valArr, list) {
      let val = JSON.parse(JSON.stringify(valArr))
      let currentObj = null
      let obj = list.find(item => {
        return item.id === val[0]
      })
      console.log('obj', obj)
      if (obj) {
        currentObj = obj
      }
      if (val.length > 1) {
        val.splice(0, 1)
        currentObj = this.getCurrentObj(val, currentObj.children)
        console.log('currentObjcurrentObjcurrentObj', currentObj)
      }
      return currentObj
    },
    async getArea (currentObj, currentIndex) {
      let parentId = currentObj ? currentObj.id : ''
      let res = await this.$post('system/area/getList', { parentId })
      if (res.code !== 0) return
      res.data.map(ele => {
        ele.children = currentIndex && currentIndex >= 3 ? null : []
      })
      if (!currentObj) {
        this.areaList = res.data
      } else {
        currentObj.children = res.data && res.data.length ? res.data : null
      }
    },
    // 获取全部的社区列表
    async getCommunityList () {
      let reqData = Object.assign({}, this.formData)
      let res = await this.$post('community/community/getCommunityList', reqData)
      if (res.code === 0) {
        this.communityList = res.data
      }
    },
    // 获取当前管理员已绑定的社区
    async getCurrentAdmin () {
      if (this.infoObj.currentCommunityList) { // 之前加载过的
        this.currentBindCommunityList = JSON.parse(this.infoObj.currentCommunityList)
        return false
      }
      this.currentBindCommunityList = []
      this.mainLoading = true
      let res = await this.$post('community/community/getListByCommunityAdmin', { communityAdminId: this.infoObj.id })
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      // 下面是保存
      res.data.map(item => {
        this.currentBindCommunityList.push(item.id)
      })
      this.infoObj.currentCommunityList = JSON.stringify(this.currentBindCommunityList) // 保存当前绑定的管理员
    },
    toSearch () {
      console.log(this.currentArr)
      this.formData = {
        provinceId: this.currentArr[0],
        cityId: this.currentArr[1],
        districtId: this.currentArr[2],
        streetId: this.currentArr[3]
      }
      this.getCommunityList()
    },
    // 请求保存
    async saveData () {
      let req = {
        communityAdminId: this.infoObj.id,
        communityIds: this.currentBindCommunityList.join(',')
      }
      this.saveLoading = true
      let res = await this.$post('community/communityAdmin/bindByAdmin', req)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('保存成功')
      this.infoObj.currentCommunityList = JSON.stringify(this.currentBindCommunityList)
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
      this.getCurrentAdmin()
    }
    // currentArr (newValue, oldValue) {
    //   if (!newValue.length) {
    //     this.formData = {
    //       provinceId: '',
    //       cityId: '',
    //       districtId: '',
    //       streetId: ''
    //     }
    //   }
    //   this.getCommunityList()
    // }
  }
}
</script>

<style lang="scss" rel="stylesheet/scss">
  .bindAdminTransferWrap{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .el-transfer-panel{
      width: 42%;
    }
    .el-transfer-panel__body{
      height: 350px;
    }
    .el-transfer-panel__list.is-filterable{
      height: 300px;
    }
  }
</style>
