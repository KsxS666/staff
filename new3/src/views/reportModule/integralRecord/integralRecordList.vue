<!-- 积分记录 -->
<template>
  <div  class="v-wrap">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入用户姓名" v-model="formData.memberName" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入用户手机号" v-model="formData.memberPhone" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入操作人姓名" v-model="formData.operatorName" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="text" :maxlength="40" placeholder="请输入操作人手机号" v-model="formData.operatorPhone" @keyup.enter.native="toSearch"> </el-input>
      </el-form-item>
      <el-form-item label="">
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="" class="date-box">
        <el-date-picker v-model="timeArr" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" v-if="btnVisible && btnVisible.download">
      <el-button class="v-button" type="success" icon="el-icon-download" plain @click="toDownload">导出列表</el-button>
    </div>
    <el-table class="v-table" border v-loading="mainLoading" :data="dataList">
      <el-table-column label="序号" align="center" width="70px">
        <template slot-scope="scope">
          {{(formData.page - 1) * formData.size + scope.$index + 1}}
        </template>
      </el-table-column>
      <el-table-column label="用户姓名" prop="memberName"  align="center"> </el-table-column>
      <el-table-column label="用户手机号" prop="memberPhone"  align="center"> </el-table-column>
      <el-table-column label="地区" prop="memberAddress" align="center">
        <template slot-scope="scope">
          {{scope.row.communityName + scope.row.memberAddress}}
        </template>
      </el-table-column>
      <el-table-column label="投放类型" prop="putName"  align="center"> </el-table-column>
      <el-table-column label="重量/数量" prop="weight"  align="center"> </el-table-column>
      <el-table-column label="操作积分" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.operateIntegralStr>0" class="v-green">{{scope.row.operateIntegralStr}}</span>
          <span v-else class="v-red">{{scope.row.operateIntegralStr}}</span>
        </template>
      </el-table-column>
      <el-table-column label="当前积分" prop="integral"  align="center"> </el-table-column>
      <el-table-column label="累计积分" prop="cumulativeIntegral"  align="center"> </el-table-column>
      <el-table-column label="操作员" align="center" >
        <template slot-scope="scope">
          {{scope.row.operatorName}}-{{scope.row.operatorPhone}}
        </template>
      </el-table-column>
      <el-table-column label="操作类型" prop="operateName"  align="center" > </el-table-column>
      <el-table-column label="操作时间" prop="operateTime"  align="center" > </el-table-column>
      <el-table-column label="备注" prop="remark"  align="center" > </el-table-column>
      <el-table-column label="操作" width="100px" align="center"  v-if="btnVisible.delete">
        <template slot-scope="scope">
          <el-button plain size="mini" v-if="btnVisible.delete && scope.row.operateCode !== 9" type="danger" @click="toDelete(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
  </div>
</template>

<script>
export default {
  name: 'integralRecordList',
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        memberName: '',
        memberPhone: '',
        operatorName: '',
        operatorPhone: '',
        communityId: '',
        page: 1,
        size: 20,
        total: 0
      },
      timeArr: [],
      dataList: [], // 主列表
      communityList: [] // 小区 列表
    }
  },
  created () {
    if (this.$route.query.memberId) {
      this.formData.memberName = this.$route.query.memberName
      this.formData.memberId = this.$route.query.memberId
    }
    this.getList()
    this.getCommunityList()
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      return btnList
    }
  },
  methods: {
    // 获取用户列表
    async getList () {
      // if (this.timeArr.length) {
      //   let timeStart = ''
      //   let timeEnd = ''
      //   const addOne = new Date(new Date().setDate(this.timeArr[1].getDate() + 1))
      //   const addNo = this.timeArr[0]
      //   const startYear = addNo.getFullYear()
      //   const startMonth = addNo.getMonth() + 1 < 10 ? `0${addNo.getMonth() + 1}` : addNo.getMonth() + 1
      //   const startDay = addNo.getDate() < 10 ? `0${addNo.getDate()}` : addNo.getDate()
      //   const endMonth = addOne.getMonth() + 1 < 10 ? `0${addOne.getMonth() + 1}` : addOne.getMonth() + 1
      //   const endYear = addOne.getFullYear()
      //   const endDay = addOne.getDate() < 10 ? `0${addOne.getDate()}` : addOne.getDate()
      //   timeStart = `${startYear}-${startMonth}-${startDay}`
      //   timeEnd = `${endYear}-${endMonth}-${endDay}`
      //   this.formData.timeStart = timeStart
      //   this.formData.timeEnd = timeEnd
      // }
      let reqData = Object.assign({}, this.formData)
      delete reqData.total
      reqData.timeStart = this.timeArr && this.timeArr.length ? this.$moment(this.timeArr[0]).format('YYYY-MM-DD') : ''
      reqData.timeEnd = this.timeArr && this.timeArr.length ? this.$moment(this.timeArr[1]).format('YYYY-MM-DD') : ''
      this.mainLoading = true
      let res = await this.$post('integral/getIntegralRecord/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    // 获取社区列表 当省市区街道发生变化时， 加载
    async getCommunityList () {
      let res = await this.$post('community/community/getCommunityList')
      if (res.code === 0) {
        this.communityList = res.data
      }
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        memberName: '',
        memberPhone: '',
        operatorName: '',
        operatorPhone: '',
        communityId: '',
        dataSourceCode: '',
        timeArr: [],
        page: 1,
        size: 20,
        total: 0
      }
      this.timeArr = []
      this.getList()
    },
    toDelete (id) {
      this.$confirm('确定删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        beforeClose: async (action, instance, done) => {
          console.log(instance)
          if (action === 'confirm') {
            instance.confirmButtonLoading = true
            instance.confirmButtonText = '删除中...'
            let res = await this.$post('integral/getIntegralRecord/deleteRecord', { recoredId: id })
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
    // 导出
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.timeStart = this.timeArr && this.timeArr.length ? this.timeArr[0] : ''
      req.timeEnd = this.timeArr && this.timeArr.length ? this.timeArr[1] : ''
      req.adminId = this.userInfo.id
      delete req.page
      delete req.size
      delete req.total
      // let url = `${process.env.BASE_API}/integral/getIntegralRecord/export?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('integral/getIntegralRecord/export', req)
    }
  }
}
</script>

<style scoped lang="scss" rel="stylesheet/scss">

</style>
