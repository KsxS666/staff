<!-- 题目列表-->
<template>
  <div class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0"  @submit.native.prevent>
      <el-form-item label>
        <el-input type="text" placeholder="请输入题目" v-model="formData.matterName" @keyup.enter.native="toSearch"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.topButton">
      <el-button class="v-button" v-if="btnVisible.answerAdd" type="primary" icon="el-icon-plus" plain @click="toShowEditDialog(1)">添加题目</el-button>
      <el-button class="v-button" v-if="btnVisible.answerSet" type="success" icon="el-icon-setting" plain @click="settingInfo.visible = true">题目设定</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column align="center" label='序号' type="index" width="68">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column align="center" label='题目' prop="problems"></el-table-column>
      <el-table-column align="center" label='选项' prop="answerList">
        <template slot-scope="scope">
          <span class="content" v-for="(item, i) in scope.row.answerList" :key="i">{{item.content}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label='答案' prop="name">
        <template slot-scope="scope">
          <template v-for="(item, i) in scope.row.answerList">
            <span  class="content" :key="i" v-if="item.isTrue">{{item.content}}</span>
          </template>
        </template>
      </el-table-column>
      <el-table-column align="center" label='赠送分数' prop="integral"></el-table-column>
      <el-table-column align="center" label='排序' prop="sort"></el-table-column>
      <el-table-column align="center" label="操作" width="200px" v-if="btnVisible && btnVisible.tableButton">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if=" btnVisible.answerEdit" type="primary" @click="toShowEditDialog(2, scope.$index)">编辑</el-button>
          <el-button plain size="mini" v-if=" btnVisible.answerDelete" type="danger" @click="toDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    <!-- 新增，编辑题目弹窗 -->
    <answerEditDialog v-model="editInfo.visible" :infoObj="editInfo.infoObj" :type="editInfo.type" :matterAreaId="formData.matterAreaId" @success="getList"/>
    <questionSettingDialog v-model="settingInfo.visible" :matterAreaId="formData.matterAreaId" :matterCounts="formData.total"/>
  </div>
</template>

<script>
import answerEditDialog from './components/answerEditDialog'
import questionSettingDialog from './components/questionSettingDialog'
export default {
  name: 'answerList',
  components: { answerEditDialog, questionSettingDialog },
  data () {
    return {
      mainLoading: false,
      productMatterInfo: {
        // 该答题列表对应的区域的信息
        // provinceId: this.$route.query.provinceId, // 区域的省ID
        // cityId: this.$route.query.cityId, // 区域的市ID
        matterAreaId: this.$route.query.matterAreaId, // 区域的ID
        // matterAreaId: '01014b99e96f42e0868172be396e9030', // 区域的ID
        orgId: this.$route.query.orgId // 公司ID
      },
      formData: {
        // matterAreaId: '01014b99e96f42e0868172be396e9030', // 区域的ID
        matterAreaId: this.$route.query.matterAreaId, // 区域的ID
        // 请求参数
        matterName: '',
        page: 1,
        size: 20,
        total: 0
      },
      dataList: [], // 主列表
      editInfo: {
        // 编辑、新增 的数据
        visible: false,
        type: 1, // 1 是 新建  2是修改
        infoObj: {}
      },
      settingInfo: {
        visible: false
      }
    }
  },
  created () {
    this.getList()
    // 获得该次级页面的按钮的权限 - 在父级页面中
    this.$store.dispatch('GetBtnIsShow', '/operation/answerModule/answerAreaList')
  },
  computed: {
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      if (!btnList) return null
      btnList.topButton = !btnList.answerAdd && !btnList.answerSet ? null : true
      btnList.tableButton = !btnList.answerEdit && !btnList.answerDelete ? null : true
      return btnList
    }
  },
  methods: {
    // 获取题目列表
    async getList () {
      let reqData = Object.assign({}, this.formData, this.productMatterInfo)
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('system/matter/getAllMatter', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData.matterName = ''
      this.formData.page = 1
      this.formData.size = 20
      this.formData.total = 0
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
    // 显示 "新增，查看，编辑" 的弹窗
    toShowEditDialog (type, index) {
      // 1 是 新建  2是修改  3是查看
      this.editInfo.type = type
      let data = null
      if (type !== 1) {
        data = this.dataList[index]
      }
      this.editInfo.visible = true
      this.editInfo.infoObj = Object.assign({}, data, this.productMatterInfo)
    },
    // 删除题目
    toDelete (id) {
      this.$confirm('确定删除该题目？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          console.log(instance)
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('system/matter/deletedMatter', { matterId: id })
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
      })
        .then(() => {
          return true
        })
        .catch(() => {
          return false
        })
    }
  }
}
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  .content {
    & + span.content {
      &:before {
        content: '、'
      }
    }
  }
</style>
