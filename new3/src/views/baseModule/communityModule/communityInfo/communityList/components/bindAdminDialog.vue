<!-- 社区 绑定管理员 -->
<template>
  <v-dialog title="绑定管理员"  :visible="value" width="850px" :before-close="beforeClose">
    <el-transfer class="bindAdminTransferWrap" v-model="currentBindAdminList" filterable v-loading="mainLoading"
      :titles="['未绑定', '已绑定']" :props="{ key: 'id', label: 'name' }"
      :data="adminList">
      <span slot-scope="{ option }"> {{option.name ? `${option.name}` : (option.phone ? option.phone : option.username)}}</span>
    </el-transfer>
    <div slot="footer">
      <el-button type="primary" :loading="saveLoading" @click="saveData">确 定</el-button>
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>

<script>
export default {
  name: 'bindAdminDialog',
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
      adminList: [], // 管理员列表
      currentBindAdminList: [], // 当前绑定的小区的id 列表
      saveLoading: false
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  },
  created () {
    this.getAdminList()
  },
  methods: {
    // 获取全部的管理员列表
    async getAdminList () {
      let res = await this.$post('community/communityAdmin/getList', { size: 100000 })
      if (res.code === 0) {
        this.adminList = res.data
      }
    },
    // 获取当前小区已绑定的管理员
    async getCurrentAdmin () {
      if (this.infoObj.currentAdminList) { // 之前加载过的
        this.currentBindAdminList = JSON.parse(this.infoObj.currentAdminList)
        return false
      }
      this.currentBindAdminList = []
      this.mainLoading = true
      let res = await this.$post('community/communityAdmin/getListByCommunity', { communityId: this.infoObj.id })
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      // 下面是保存
      res.data.map(item => {
        this.currentBindAdminList.push(item.id)
      })
      this.infoObj.currentAdminList = JSON.stringify(this.currentBindAdminList) // 保存当前绑定的管理员
    },
    // 请求保存
    async saveData () {
      let req = {
        communityId: this.infoObj.id,
        communityAdminIds: this.currentBindAdminList.join(',')
      }
      this.saveLoading = true
      let res = await this.$post('community/community/bindByCommunity', req)
      this.saveLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.beforeClose()
      this.$message.success('保存成功')
      this.infoObj.currentAdminList = JSON.stringify(this.currentBindAdminList)
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
