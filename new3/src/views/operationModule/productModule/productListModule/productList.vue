<!-- 商品列表-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label>
        <el-input type="text" :maxlength="40" placeholder="商品名称" v-model="formData.name" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <el-form-item label>
        <el-select filterable clearable v-model="formData.productTypeID" placeholder="商品类型">
          <el-option v-for="(item, i) in productTypeList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.productAdd">
      <el-button class="v-button" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加商品</el-button>
    </div>
    <div class="location-tab">
      <div class="tab-item" :class="{'location-tab-active':tabPosition == 0}" @click="locationc(0)">全部</div>
      <div class="tab-item" :class="{'location-tab-active':tabPosition == 1}" @click="locationc(1)">积分商城</div>
      <div class="tab-item" :class="{'location-tab-active':tabPosition == 2}" @click="locationc(2)">兑换机</div>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">{{(formData.page - 1) * formData.size + scope.$index + 1}}</template>
      </el-table-column>
      <el-table-column label="图片" align="center" width="130">
        <template slot-scope="scope">
          <img :src="scope.row.img" width="100" height="100">
        </template>
      </el-table-column>
      <el-table-column align="center" label="商品名称" width="220" prop="name"></el-table-column>
      <el-table-column label="商品类型" align="center" prop="productTypeName"></el-table-column>
      <el-table-column label="是否推荐" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.recommend === true">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="上架状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.shelves === true">是</span>
          <span v-else>否</span>
        </template>
      </el-table-column>
      <el-table-column label="购买价格" align="center" prop="price"></el-table-column>
      <el-table-column label="兑换积分" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.integral}}</span>
        </template>
      </el-table-column>
      <el-table-column label="库存" align="center" prop="inventory"></el-table-column>
      <el-table-column label="所属机构" align="center" prop="orgName"></el-table-column>
      <el-table-column label="创建时间" align="center" width="180" prop="createTime"></el-table-column>
      <el-table-column label="更新时间" align="center" width="180" prop="modifyTime"></el-table-column>
      <el-table-column label="操作" width="200px" align="center" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible.productEdit" type="primary" @click="toShowEditDialog(2, scope.$index)">编辑</el-button>
          <el-button plain size="mini" v-if="btnVisible.productDelete" type="danger" @click="toDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 新增，编辑商品弹窗 -->
    <productListEditDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj" :type="editInfo.type" @success="getList"/>
  </div>
</template>

<script>
import productListEditDialog from './components/productListEditDialog'
export default {
  name: 'productList',
  components: { productListEditDialog },
  data () {
    return {
      mainLoading: false,
      productMatterInfo: { // 该商品列表对应的区域的信息
        provinceId: this.$route.query.provinceId, // 区域的省ID
        cityId: this.$route.query.cityId, // 区域的市ID
        matterAreaId: this.$route.query.matterAreaId, // 区域的ID
        orgId: this.$route.query.orgId // 公司ID
      },
      productTypeList: [],
      formData: { // 请求参数
        locationCode: '',
        productTypeID: '',
        provinceId: '',
        productName: '',
        cityId: '',
        districtId: '',
        page: 1,
        size: 20,
        total: 0
      },
      tabPosition: 0,
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
    this.getTypeList()
    // 获得该次级页面的按钮的权限 - 在父级页面中
    this.$store.dispatch('GetBtnIsShow', '/operation/productModule/productAreaList')
  },
  computed: {
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.topButton = !btnList.productAdd ? null : true
      btnList.tableButton = !btnList.productEdit && !btnList.productDelete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取商品列表
    async getList () {
      let reqData = Object.assign({}, this.formData, this.productMatterInfo)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('system/productDetail/getProductDetailPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    // 获取商品类型列表
    async getTypeList () {
      let res = await this.$post('system/goodsType/getGoodTypePage')
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.productTypeList = res.data.resultList || []
    },
    // 显示 "新增，查看，编辑" 的弹窗
    toShowEditDialog (type, index) { // 1 是 新建  2是修改  3是查看
      this.editInfo.type = type
      let data = null
      if (type !== 1) {
        data = this.dataList[index]
      }
      this.editInfo.visible = true
      this.editInfo.infoObj = Object.assign({}, data, this.productMatterInfo)
    },
    // 删除商品
    toDelete (id) {
      this.$confirm('确定删除该商品？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          console.log(instance)
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('system/productDetail/deletedGoodsDetail', { id })
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
        locationCode: '',
        productTypeID: '',
        provinceId: '',
        productName: '',
        cityId: '',
        districtId: '',
        page: 1,
        size: 20,
        total: 0
      }
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
    locationc (index) {
      this.tabPosition = index
      this.formData.locationCode = index
      if (index === 0) {
        this.formData.locationCode = ''
      }
      this.formData.page = 1
      this.getList()
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  .location-tab {
    width: 100%;
    border-bottom: 1px solid $border-base;
    margin-bottom: 10px;
  }

  .location-tab .tab-item {
    display: inline-block;
    width: 70px;
    height: 30px;
    margin-right: 8px;
    line-height: 30px;
    text-align: center;
    color: $color-primary;
    font-size: 12px;
    border: 1px solid #d9d9d9;
    border-radius: 4px 4px 0 0;
    cursor: pointer;
    transition: 0.3s;
    border-bottom: 0;
  }

  .location-tab .location-tab-active {
    background: $color-primary;
    color: #ffffff;
    border: 1px solid $color-primary;
  }
</style>
