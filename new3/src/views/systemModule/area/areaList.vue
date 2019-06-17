<!-- 地区列表 -->
<template>
  <div  class="v-wrap listWrap">
    <div class="v-other-btn-list" v-if="btnVisible&&btnVisible.add">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加地区</el-button>
    </div>
    <div class="v-tree-table">
      <div class="v-tree-item v-tree-item-title">
        <div>地区名称</div>
        <div class="center"  v-if="btnVisible&&btnVisible.tableButton">操作</div>
      </div>
      <el-tree :data="dataList" lazy :load="loadNode" node-key="id" class="menuTreeWrap" v-loading="mainLoading">
        <div class="v-tree-item" slot-scope="{ node, data }">
          <div style="cursor: pointer">{{ data.name }}</div>
          <div class="center" @click.stop=""  v-if="btnVisible&&btnVisible.tableButton">
            <el-button plain size="mini" v-if="btnVisible.addSub" :disabled="node.level >= 4" @click="toShowEditDialog(4, data)">添加下级地区</el-button>
            <el-button plain size="mini" v-if="btnVisible.edit" type="primary" @click="toShowEditDialog(2, data)">编辑</el-button>
            <el-button plain size="mini" v-if="btnVisible.delete" type="danger" @click="toDelete(data.id)">删除</el-button>
          </div>
          <!--</div>-->
        </div>
      </el-tree>
    </div>
    <areaEditDialog v-model="editInfo.visible" :type="editInfo.type" :infoObj="editInfo.infoObj" @success="$router.go(0)" />
  </div>
</template>

<script>
import areaEditDialog from './components/areaEditDialog'
export default {
  name: 'areaList',
  components: { areaEditDialog },
  data () {
    return {
      mainLoading: false,
      dataList: [],
      editInfo: {
        visible: false,
        type: 1, // 1 是 新建  2是修改  3是查看
        infoObj: {}
      }
    }
  },
  async created () {
    this.dataList = await this.getList(null)
  },
  computed: {
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.tableButton = !btnList.edit && !btnList.addSub && !btnList.delete ? null : true
      return btnList
    }
  },
  methods: {
    // 获得地区列表
    async getList (parentId) {
      if (!parentId) this.mainLoading = true
      let res = await this.$post('system/area/getList', { parentId })
      if (!parentId) this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return []
      }
      return res.data
    },
    // 懒加载下一级地区
    async loadNode (node, resolve) {
      if (node.level === 0) {
        return resolve(this.dataList)
      }
      if (node.level > 3) return resolve([])

      let list = await this.getList(node.data.id)
      resolve(list)
    },
    // 显示 "新增，编辑" 的弹窗
    toShowEditDialog (type, data = null) { // 1 是 新建  2是修改  4 是添加下级
      this.editInfo.type = type
      this.editInfo.visible = true
      this.editInfo.infoObj = data
    },
    // 删除
    toDelete (id) {
      this.$confirm('确定删除该地区？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('system/area/delete', { id })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.$router.go(0)
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
        width: 530px;
        flex: 0 0 350px;
      }
    }
  }
</style>
