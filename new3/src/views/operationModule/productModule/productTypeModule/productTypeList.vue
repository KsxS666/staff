<!-- 商品类型列表-->
<template>
  <div class="v-wrap">
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.add">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加商品类型</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="商品类型名称" prop="name" align="center"></el-table-column>
      <el-table-column label="图片" prop="img" align="center" width="200">
        <template slot-scope="scope">
          <img :src="scope.row.img" width="100%" height="100">
        </template>
      </el-table-column>
      <el-table-column label="是否推荐" prop="recommend" align="center">
        <template slot-scope="scope">{{scope.row.recommend?"是":"否"}}</template>
      </el-table-column>
      <el-table-column label="操作" width="200px" align="center">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible.edit" type="primary" @click="toShowEditDialog(2, scope.$index)">编辑</el-button>
          <el-button plain size="mini" v-if="btnVisible.delete" type="danger" @click="toDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 新增，编辑商品类型弹窗 -->
    <productTypeEditDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj" :type="editInfo.type" @success="getList"/>
  </div>
</template>

<script>
import productTypeEditDialog from './components/productTypeEditDialog'
export default {
  name: 'produceTypeList',
  components: { productTypeEditDialog },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        title: '',
        hasType: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      editInfo: { // 编辑、新增 的数据
        visible: false,
        type: 1, // 1 是 新建  2是修改
        infoObj: {}
      }
    }
  },
  created () {
    this.getList()
  },
  computed: {
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      console.log(btnList)
      if (!btnList) return null
      btnList.topButton = !btnList.userAdd && !btnList.userDeleteMulti && !btnList.userDeleteAll && !btnList.userFileDownload && !btnList.userImport && !btnList.userDownload ? null : true
      btnList.tableButton = !btnList.userEdit && !btnList.userWasteRecode && !btnList.userDelete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取商品类型列表
    async getList () {
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('system/goodsType/getGoodTypePage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    // 显示 "新增，查看，编辑" 的弹窗
    toShowEditDialog (type, index) { // 1 是 新建  2是修改  3是查看
      this.editInfo.type = type
      let data = null
      if (type !== 1) {
        data = this.dataList[index]
      }
      this.editInfo.visible = true
      this.editInfo.infoObj = data
    },
    // 删除商品类型
    toDelete (id) {
      this.$confirm('确定删除该商品类型？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          console.log(instance)
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('system/goodsType/deletedGoodsType', { id })
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
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        title: '',
        hasType: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.getList()
    }
  }
}
</script>
