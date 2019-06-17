<template>
  <div class="">
    <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
      <el-form-item>
        <el-input v-model="formData.communityAdminName" placeholder="请输入管理员昵称"></el-input>
      </el-form-item>
      <areaSearch ref="areaSearch" isCommunity :level="3" :formData="formData" @change="getCommunityList"/>
      <el-form-item>
        <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
          <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-date-picker v-model="dateRange" type="daterange" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy/MM/dd"></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch">查 询</el-button>
        <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm">清 空</el-button>
      </el-form-item>
    </el-form>
    <div class="v-other-btn-list" style="justify-content: space-between">
      <div>
        <el-button v-if="btnVisible.download" class="v-button" type="primary" icon="el-icon-download" plain @click="toDownload">导出报表</el-button>
      </div>
      <div>
        <el-button type="primary" @click="curMonSearch">查看本月</el-button>
          <el-button type="primary" @click="preMonSearch">查看上月</el-button>
      </div>
    </div>
    <template v-if="type === ''">
      <allTable v-if="type === ''" :dataList="dataList" :formData="formData" @clickItem="toShowDetailDialog" v-loading="mainLoading" />
      <PageInfo :formData="formData" :pageSizes="[1,2,3,5]" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </template>
    <template v-else>
      <el-table :data="dataList" class="v-table" border v-loading="mainLoading" stripe>
        <el-table-column label="小区" prop="communityName" align="center"></el-table-column>
        <el-table-column label="姓名" prop="name" align="center"></el-table-column>
        <el-table-column label="日期" prop="signDate" align="center"></el-table-column>
        <el-table-column label="类型" prop="typeName" align="center"></el-table-column>
        <el-table-column label="时间" prop="signTime" align="center"></el-table-column>
        <el-table-column label="说明" prop="remark" align="center"></el-table-column>
        <!-- <el-table-column label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button size="mini" @click="toShowDetailDialog(scope.$index)">查看</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </template>

    <detailDialog v-model="detailInfo.visible" :infoObj="detailInfo.infoObj" />
  </div>

</template>

<script>
// import { Loading } from 'element-ui'
import allTable from './allTable'
import detailDialog from './detailDialog'
export default {
  props: {
    type: {
      type: String,
      default: () => ''
    },
    btnVisible: {
      type: Array,
      default: () => []
    }
  },
  components: { detailDialog, allTable },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        communityId: '',
        communityAdminName: '',
        type: '',
        startTime: '',
        endTime: '',
        page: 1,
        size: this.type ? 20 : 5,
        total: 0
      },
      adminList: [],
      dateRange: [],
      communityList: [],
      dataList: [],
      detailInfo: {
        visible: false,
        infoObj: {}
      }
    }
  },
  created () {
    // this.getList()
    this.curMonSearch()
    this.getCommunityList()
  },
  methods: {
    async getList () {
      let reqData = Object.assign({}, this.formData)
      this.dateRange = this.dateRange === null ? [] : this.dateRange
      reqData.startTime = this.dateRange[0]
      reqData.endTime = this.dateRange[1]
      reqData.type = this.type
      // reqData.size = this.type === '' ? 5 : 20
      delete reqData.total
      this.mainLoading = true
      // const loadingInstance = Loading.service({ fullscreen: true })
      let res = await this.$post('community/communityAdminAttendance/getAttendancePage', reqData)
      this.mainLoading = false
      // loadingInstance.close()
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      if (this.type === '') {
        this.dataList.map(ele => {
          ele.sliceArray = this.toSlice(ele.list, 7)
        })
      }

      this.formData.total = res.data.totalNum
    },
    toSlice (array, size) {
      var result = []
      for (var x = 0; x < Math.ceil(array.length / size); x++) {
        let start = x * size
        let end = start + size
        result.push(array.slice(start, end))
      }
      return result
    },
    // 获取小区列表
    async getCommunityList () { // isShow 是否是回显的
      this.communityList = []
      let req = {
        provinceId: this.formData.provinceId,
        cityId: this.formData.cityId,
        districtId: this.formData.districtId
      }
      let res = await this.$post('community/community/getCommunityList', req)
      if (res.code === 0) {
        this.communityList = res.data
      }
    },
    // 获得社区管理员列表
    async getAdminList () {
      let res = await this.$post('community/communityAdmin/getList')
      if (res.code === 0) {
        this.adminList = res.data.filter(item => {
          return item.username !== 'admin'
        })
      }
    },
    toDownload () {
      let req = Object.assign({}, this.formData)
      req.adminId = this.userInfo.id
      req.type = this.type
      req.startTime = this.dateRange[0] ? this.dateRange[0] : ''
      req.endTime = this.dateRange[1] ? this.dateRange[1] : ''
      delete req.page
      delete req.size
      delete req.total

      // let url = `${process.env.BASE_API}/community/communityAdminAttendance/exportAttendance?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      this.$utils.exportFile('community/communityAdminAttendance/exportAttendance', req)
    },
    curMonSearch () {
      var date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() + 1 < 10 ? `0${date.getMonth() + 1}` : date.getMonth() + 1
      const days = this.getCurMonthDayCounts()
      this.dateRange = [`${year}-${month}-01`, `${year}-${month}-${days}`]
      this.getList()
    },
    preMonSearch () {
      var date = new Date()
      const year = date.getFullYear()
      const month = date.getMonth() < 10 ? `0${date.getMonth()}` : date.getMonth()
      const days = this.getCurMonthDayCounts(false)
      this.dateRange = [`${year}-${month}-01`, `${year}-${month}-${days}`]
      this.getList()
    },
    // 获取月份天数
    getCurMonthDayCounts (isCur = true) {
      var date = new Date()
      var year = date.getFullYear()
      var month = isCur ? date.getMonth() + 1 : date.getMonth()
      var d = new Date(year, month, 0)
      return d.getDate()
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList(this.type)
    },
    // 清空
    toClearForm () {
      this.formData = {
        provinceId: '',
        cityId: '',
        districtId: '',
        streetId: '',
        communityId: '',
        communityAdminName: '',
        type: '',
        startTime: '',
        endTime: '',
        page: 1,
        size: this.type ? 20 : 5,
        total: 0
      }
      this.$refs.areaSearch.toResetValue()
      this.curMonSearch()
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
    toShowDetailDialog (data) {
      // alert(index)
      // let data = null
      // if (this.type !== '') {
      //   data = this.dataList[index]
      // }
      this.detailInfo.visible = true
      // this.detailInfo.infoObj = data
      // console.log(data)
      this.detailInfo.infoObj = data
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    }
  }
}
</script>

<style lang="scss" scoped>
  $fa:#fafafa;
  .flex{
    display: flex;
  }
  .list-box{
    border: 1px solid #e5e5e5;
    border-bottom: 0;
    border-right: 0;
    min-height: 180px;
    color: #606266;
    font-size: 14px;
  }
  .flex-center{
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .bac{
    border-bottom: 1px solid #e5e5e5;
  }
  .title{
    width: 15%;
    border-right: 1px solid #e5e5e5;
  }
  .head-style{
    font-weight: bold;
    font-size: 14px;
    height: 36px;
    color: #909399;
  }
  .head-style div:nth-child(4) {
    border-right: 1px solid #e5e5e5;
  }
  .order{
    width: 4%;
    border-right: 1px solid #e5e5e5
  }
  .detail{
    flex: 1;
  }
  .out{
    display: flex;
    height: 300px;
    .zero{
      width: 4%;
      border-right: 1px solid #e5e5e5;
    }
    .zero {
      border-bottom: 1px solid #e5e5e5;
    }
    .first{
      width: 15%;
      display: flex;
      // border-bottom: 1px solid #e5e5e5;
      flex-flow: column nowrap;
      .content{
        flex: 1;
        border-bottom: 1px solid #e5e5e5
      }
    }
    .first content:not(:last-child) {
      border-bottom: 1px solid #e5e5e5;
    }
    .second{
      width: 15%;
      border-left: 1px solid #e5e5e5;
      display: flex;
      flex-flow: column nowrap;
      border-bottom: 1px solid #e5e5e5;
      section{
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: .3s;
      }
    }
    .second section:not(:last-child){
      border-bottom: 1px solid #e5e5e5
    }
    .third{
      flex: 1;
      // .hover:hover{
      //   font-weight: 700
      // }
    }
  }
  .empty-wrp{
    height: 144px;
  }
</style>

<style lang="scss">
.el-carousel__arrow{
  background-color: #2387D4;
  opacity: 0.8;
}
.attence-carousel{
  height: 180px;
  margin-left: 10px;
  .el-carousel__container{height: 100%!important;border: 1px solid #e5e5e5;border-top:0};
  .time-column-item{
    width: 14.28%;
    // flex: 1;
    display: flex;
    flex-flow: column nowrap;
    border-right: 1px solid #e5e5e5;
  }
  .time-column-item:nth-child(7) {
    border-right: 0;
  }
  .err-content{
    display: flex;
    flex-flow: column nowrap;
    height: calc(100% - 36px)
  }
  .time-column-item section{
    display: flex;
    flex-flow: column;
    justify-content: center;
    align-items: center;
    transition: .5s;
    font-size: 12px;
    height: 20%;
    border-bottom: 1px solid #e5e5e5;
  }
}
  .time-column-title{
    height: 20%;
    background: #FAFAFA;
    display: flex;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
  }
.time-column-item section:nth-child(5){
  border-bottom: 0
}

</style>
