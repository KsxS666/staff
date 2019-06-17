<!-- 机构管理列表 -->
<template>
  <div  class="v-wrap listWrap">
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.add">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加机构</el-button>
    </div>
    <div class="v-tree-table">
      <div class="v-tree-item v-tree-item-title">
        <div>机构名</div>
        <!--<div>状态</div>-->
        <div class="center">所属类型</div>
        <div class="center">地址</div>
        <div class="center"  v-if="btnVisible && btnVisible.tableButton">操作</div>
      </div>
      <el-tree :data="dataList" node-key="id" class="menuTreeWrap" v-loading="mainLoading">
        <div class="v-tree-item" slot-scope="{ node, data }">
          <div style="cursor: pointer">{{ data.name }}</div>
          <div class="center" @click.stop="">{{data.type === 1 ? '公司' : (data.type === 2 ? '部门' : '区域')}}</div>
          <div class="center" @click.stop="">{{data.address}}</div>
          <div class="center" @click.stop=""  v-if="btnVisible && btnVisible.tableButton">
            <el-button plain size="mini" v-if="btnVisible.addSub" :disabled="(data.type === 2 && node.level >= 3) || (data.type === 3 && node.level >= 2)" @click="toShowEditDialog(4, data)">添加下级机构</el-button>
            <el-button plain size="mini" v-if="btnVisible.permission" @click="toShowPermission(data)">权限管理</el-button>
            <el-button plain size="mini" v-if="btnVisible.edit" type="primary" @click="toShowEditDialog(2, data)">编辑</el-button>
            <el-button plain size="mini" v-if="btnVisible.delete" type="danger" @click="toDelete(data.id)">删除</el-button>
          </div>
          <!--</div>-->
        </div>
      </el-tree>
    </div>
    <!-- 添加 编辑弹窗 -->
    <orgEditDialog v-model="editInfo.visible" :type="editInfo.type" :infoObj="editInfo.infoObj" @success="getList"/>
    <!-- 权限管理 弹窗 -->
    <permissionDialog v-model="permissionInfo.visible" :infoObj="permissionInfo.infoObj"/>
  </div>
</template>

<script>
import orgEditDialog from './components/orgEditDialog'
import permissionDialog from './components/permissionDialog'
export default {
  name: 'orgList',
  components: { orgEditDialog, permissionDialog },
  data () {
    return {
      mainLoading: false,
      dataList: [],
      editInfo: {
        visible: false,
        type: 1, // 1 是 新建  2是修改  4 是添加下级
        infoObj: {}
      },
      permissionInfo: { // 权限
        visible: false,
        infoObj: {}
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
      btnList.tableButton = !btnList.addSub && !btnList.permission && !btnList.edit && !btnList.delete ? null : true
      return btnList
    }
  },
  methods: {
    // 获得机构列表
    async getList () {
      this.mainLoading = true
      let res = await this.$post('system/organization/getListByAdmin')
      this.mainLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data
    },
    // 显示 "新增，编辑" 的弹窗
    toShowEditDialog (type, data = null) { // 1 是 新建  2是修改  4 是添加下级
      console.log(data)
      this.editInfo.type = type
      this.editInfo.visible = true
      this.editInfo.infoObj = data
    },
    // 权限管理
    toShowPermission (data) {
      this.permissionInfo.infoObj = data
      this.permissionInfo.visible = true
    },
    // 删除
    toDelete (id) {
      this.$confirm('确定删除该机构？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('system/organization/delete', { id })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.getList()
              // 重新请求菜单的数据
              // this.$store.dispatch('GetInfo')
            } else {
              this.$message.error(res.msg)
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
  .listWrap{
    overflow: auto;
    min-width: 1200px;
  }
  .v-tree-item{
    div{
      &:nth-of-type(1) {
        flex:  1;
      }
      &:nth-of-type(2) {
        /*width: 100px;*/
        flex: 0 0 150px;
      }
      &:nth-of-type(3) {
        /*width: 100px;*/
        flex: 0 0 350px;
      }
      &:nth-of-type(4) {
        width: 530px;
        flex: 0 0 400px;
      }
    }
  }
</style>
