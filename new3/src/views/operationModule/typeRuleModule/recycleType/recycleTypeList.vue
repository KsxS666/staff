<!-- 回收物 类型 -- 列表 -->
<template>
  <div  class="v-wrap listWrap">
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.add">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加类型</el-button>
    </div>
    <div class="v-tree-table">
      <div class="v-tree-item v-tree-item-title">
        <div>类型名称</div>
        <div class="center">类型单位</div>
        <div class="center" v-if="btnVisible && btnVisible.tableButton">操作</div>
      </div>
      <el-tree :data="dataList" node-key="id" class="menuTreeWrap" v-loading="mainLoading">
        <div class="v-tree-item" slot-scope="{ node, data }">
          <div style="cursor: pointer">{{ data.typeName }}</div>
          <div class="center" @click.stop="" v-if="node.level !== 1">{{data.typeRule === 0  ?'重量':'数量'}}</div>
          <div class="center" @click.stop="" v-else>-</div>
          <div class="center" @click.stop="" v-if="btnVisible && btnVisible.tableButton">
            <el-button plain size="mini" v-if="btnVisible.addSub" :disabled="node.level > 2" @click="toShowEditDialog(4, data, node.level)">添加下级类型</el-button>
            <el-button plain size="mini" v-if="btnVisible.edit" type="primary" @click="toShowEditDialog(2, data, node.level)">编辑</el-button>
            <el-button plain size="mini" v-if="btnVisible.delete" type="danger" @click="toDelete(data.id)">删除</el-button>
          </div>
          <!--</div>-->
        </div>
      </el-tree>
    </div>
    <typeEditDialog v-model="editInfo.visible" :type="editInfo.type" :infoObj="editInfo.infoObj" @success="getList"></typeEditDialog>
  </div>
</template>

<script>
import typeEditDialog from './components/typeEditDialog'
export default {
  name: 'recycleTypeList',
  components: { typeEditDialog },
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
      btnList.tableButton = !btnList.edit && !btnList.delete && !btnList.addSub ? null : true
      return btnList
    }
  },
  methods: {
    // 获得列表
    async getList () {
      this.mainLoading = true
      let res = await this.$post('integral/reclaimType/getList')
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data
    },
    // 显示 "新增，编辑" 的弹窗
    toShowEditDialog (type, data = null, level = 1) { // 1 是 新建  2是修改  4 是添加下级
      this.editInfo.type = type
      this.editInfo.visible = true
      if (type === 2 || type === 4) {
        this.editInfo.infoObj = data
      }
      this.editInfo.infoObj.level = level
    },
    // 删除
    toDelete (id) {
      this.$confirm('确定删除该回收类型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('integral/reclaimType/delete', { id })
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
        width: 530px;
        flex: 0 0 350px;
      }
    }
  }
</style>
