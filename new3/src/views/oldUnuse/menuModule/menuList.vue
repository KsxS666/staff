<!-- 菜单管理列表 -->
<template>
  <div  class="v-wrap listWrap">
   <!-- <div class="v-other-btn-list">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加菜单</el-button>
    </div>-->
    <div class="v-tree-table">
      <div class="v-tree-item v-tree-item-title">
        <div>菜单名称</div>
        <div>链接</div>
        <!--<div class="center">显示/隐藏</div>-->
        <div class="center">权限标识</div>
      </div>
      <el-tree :data="dataList" node-key="id" class="menuTreeWrap" v-loading="mainLoading">
        <div class="v-tree-item" slot-scope="{ node, data }">
          <div style="cursor: pointer">{{ data.name }}</div>
          <div @click.stop="">{{data.href}}</div>
          <!--<div class="center" @click.stop="">{{data.isShow ? '显示' :'隐藏'}}</div>-->
          <div class="center" @click.stop="">{{node.level >= 3 ? '按钮' : '菜单'}}</div>
        </div>
      </el-tree>
    </div>
    <!--<MenuEditDialog v-model="editInfo.visible" :type="editInfo.type" :infoObj="editInfo.infoObj" @success="getList"></MenuEditDialog>-->
  </div>
</template>

<script>
// import MenuEditDialog from './components/menuEditDialog'
export default {
  name: 'MenuList',
  // components: {MenuEditDialog},
  data () {
    return {
      mainLoading: false,
      // dataList: [],
      editInfo: {
        visible: false,
        type: 1, // 1 是 新建  2是修改  3是查看
        infoObj: {}
      }
    }
  },
  created () {
    // this.getList()
  },
  computed: {
    dataList () {
      let list = JSON.parse(JSON.stringify(this.$store.getters.showMenuList))
      list.map(item => {
        item.children.map(child => {
          child.children = child.btnList
        })
      })
      return list
      // return this.$store.getters.showMenuList
    }
  },
  methods: {
    // 获得菜单类别
    async getList () {
      this.mainLoading = true
      let res = await this.$post('system/menu/getMenuListByAdmin')
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data
    },
    // 显示 "新增，编辑" 的弹窗
    toShowEditDialog (type, data = null) { // 1 是 新建  2是修改  4 是添加下级
      this.editInfo.type = type
      this.editInfo.visible = true
      this.editInfo.infoObj = data
    },
    // 删除
    toDelete (id) {
      this.$confirm('确定删除该菜单？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('system/menu/delete', { id })
            instance.confirmButtonLoading = false
            instance.confirmButtonText = '确定'
            if (res.code === 0) {
              this.$message.success('删除成功')
              this.getList()
              // 重新请求菜单的数据
              this.$store.dispatch('GetInfo')
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

<style lang="scss" scoped rel="stylesheet/scss">
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
        /*width: 300px;*/
        flex: 0 0 300px;
      }
      &:nth-of-type(3) {
        /*width: 100px;*/
        flex: 0 0 150px;
      }
      &:nth-of-type(4) {
        /*width: 100px;*/
        flex: 0 0 150px;
      }
      &:nth-of-type(5) {
        width: 530px;
        flex: 0 0 350px;
      }
    }
  }
</style>
