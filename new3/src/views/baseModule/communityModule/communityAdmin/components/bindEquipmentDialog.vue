<!-- 社区管理员 绑定设备 -->
<template>
  <v-dialog title="绑定设备"  :visible="value" width="850px" :before-close="beforeClose">
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
  name: 'bindEquipmentDialog',
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
      communityList: [], // 社区列表
      currentBindCommunityList: [], // 当前绑定的管理员的id 列表
      saveLoading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.getCommunityList()
  },
  methods: {
    // 获取全部的社区列表
    async getCommunityList () {
      let res = await this.$post('community/community/getCommunityList')
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
