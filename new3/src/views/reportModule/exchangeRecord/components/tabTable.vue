<template>
  <div>
    <template v-if="!outLine">
      <el-form :model="formData" class="v-form v-form-search" label-width="0" @submit.native.prevent>
        <areaSearch ref="areaSearch" isCommunity :level="3" :formData="formData" @change="getCommunityList"/>
        <el-form-item>
          <el-select filterable clearable v-model="formData.communityId" placeholder="请选择小区">
            <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="">
          <el-input type="text" :maxlength="40" placeholder="请输入商品名称" v-model="formData.productName" @keyup.enter.native="toSearch"> </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input type="text" :maxlength="40" placeholder="请输入兑换码" v-model="formData.exchangeNumber" @keyup.enter.native="toSearch"> </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input type="text" :maxlength="40" placeholder="请输入手机号" v-model="formData.phone" @keyup.enter.native="toSearch"> </el-input>
        </el-form-item>
        <el-form-item label="" v-if="exchangeChannels !== 2">
          <el-select filterable clearable v-model="formData.exchangeCode" placeholder="请选择兑换状态">
            <el-option label="兑换中" :value="0"></el-option>
            <el-option label="已兑换" :value="1"></el-option>
          </el-select>
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
        <el-table-column label="商品图" prop="memberName"  align="center">
          <template slot-scope="scope">
            <div class="imgBox">
              <img :src="scope.row.img">
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="productName"  align="center" width="140px"> </el-table-column>
        <el-table-column label="件数" prop="productCount"  align="center"> </el-table-column>
        <el-table-column label="兑换码" prop="exchangeNumber"  align="center"> </el-table-column>
        <el-table-column label="积分" prop="integral"  align="center"> </el-table-column>
        <el-table-column label="兑换状态" prop="exchangeName"  align="center" v-if="exchangeChannels !== 2"></el-table-column>
        <el-table-column label="用户名" prop="userName"  align="center"> </el-table-column>
        <el-table-column label="电话" prop="userPhone"  align="center"> </el-table-column>
        <el-table-column label="申请时间" prop="createTime"  align="center" width="100px"> </el-table-column>
        <el-table-column label="城市" align="center">
          <template slot-scope="scope">
            {{scope.row.provinceName}}{{scope.row.cityName}}{{scope.row.districtName}}
          </template>
        </el-table-column>
        <el-table-column label="小区" prop="communityName"  align="center"> </el-table-column>
        <el-table-column label="操作人" prop="adminName"  align="center" v-if="exchangeChannels !== 2"></el-table-column>
        <el-table-column label="兑换时间" prop="exchangeTime"  align="center" width="100px" v-if="exchangeChannels !== 2"></el-table-column>
      </el-table>
      <PageInfo :formData="formData" @current-change="handleCurrentChange" @size-change="handleSizeChange"/>
    </template>
    <template v-else>
      <el-form :model="formData2" class="v-form v-form-search" label-width="0" @submit.native.prevent>
        <el-form-item label="">
          <el-input type="text" :maxlength="40" placeholder="请输入用户姓名" v-model="formData2.memberName" @keyup.enter.native="toSearch2"> </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input type="text" :maxlength="40" placeholder="请输入用户手机号" v-model="formData2.memberPhone" @keyup.enter.native="toSearch2"> </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input type="text" :maxlength="40" placeholder="请输入操作人姓名" v-model="formData2.operatorName" @keyup.enter.native="toSearch2"> </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-input type="text" :maxlength="40" placeholder="请输入操作人手机号" v-model="formData2.operatorPhone" @keyup.enter.native="toSearch2"> </el-input>
        </el-form-item>
        <el-form-item label="">
          <el-select filterable clearable v-model="formData2.communityId" placeholder="请选择小区">
            <el-option v-for="(item, i) in communityList" :key="i" :label="item.name" :value="item.id"> </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" class="date-box">
          <el-date-picker v-model="timeArr" type="daterange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"> </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button class="v-button" type="primary" icon="el-icon-search" @click="toSearch2">查 询</el-button>
          <el-button class="v-button" plain icon="el-icon-delete" @click="toClearForm2">清 空</el-button>
        </el-form-item>
      </el-form>
      <div class="v-other-btn-list" v-if="btnVisible && btnVisible.download">
        <el-button class="v-button" type="success" icon="el-icon-download" plain @click="toDownload">导出列表</el-button>
      </div>
      <el-table class="v-table" border v-loading="mainLoading" :data="dataList2">
        <el-table-column label="序号" align="center" width="70px">
          <template slot-scope="scope">
            {{(formData2.page - 1) * formData2.size + scope.$index + 1}}
          </template>
        </el-table-column>
        <el-table-column label="用户姓名" prop="memberName"  align="center"> </el-table-column>
        <el-table-column label="用户手机号" prop="memberPhone"  align="center"> </el-table-column>
        <el-table-column label="地区" prop="memberAddress" align="center">
          <template slot-scope="scope">
            {{scope.row.communityName + scope.row.memberAddress}}
          </template>
        </el-table-column>
        <!-- <el-table-column label="投放类型" prop="putName"  align="center"> </el-table-column> -->
        <!-- <el-table-column label="重量/数量" prop="weight"  align="center"> </el-table-column> -->
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
        <!-- <el-table-column label="操作" width="100px" align="center">
          <template slot-scope="scope">
            <el-button plain size="mini" v-if="btnVisible.delete" type="danger" @click="toDelete(scope.row.id)">删除</el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <PageInfo :formData="formData2" @current-change="handleCurrentChange2" @size-change="handleSizeChange2"/>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    exchangeChannels: {
      type: Number,
      default: null
    },
    outLine: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      mainLoading: false,
      formData: { // 请求参数
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        productName: '',
        exchangeNumber: '',
        phone: '',
        exchangeCode: '',
        page: 1,
        size: 20,
        total: 0
      },
      formData2: { // 请求参数
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
      dataList2: [], // 主列表
      communityList: [] // 小区 列表
    }
  },
  created () {
    if (this.outLine) {
      this.getOutLineList()
    } else {
      this.getList()
    }
    this.getCommunityList()
  },
  methods: {
    // 获取积分商城、兑换机兑换记录
    async getList () {
      let reqData = Object.assign({}, this.formData)
      if (!this.outLine) {
        reqData.exchangeChannels = this.exchangeChannels
      }
      delete reqData.total
      this.mainLoading = true
      let res = await this.$post('system/exchangeRecord/getPage', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data.resultList || []
      this.formData.total = res.data.totalNum
    },
    // 获取线下兑换记录
    async getOutLineList () {
      let reqData = Object.assign({}, this.formData2)
      delete reqData.total
      reqData.timeStart = this.timeArr && this.timeArr.length ? this.$moment(this.timeArr[0]).format('YYYY-MM-DD') : ''
      reqData.timeEnd = this.timeArr && this.timeArr.length ? this.$moment(this.timeArr[1]).format('YYYY-MM-DD') : ''
      this.mainLoading = true
      let res = await this.$post('integral/getIntegralRecord/getOfflineExchangeRecord', reqData)
      this.mainLoading = false
      if (res.code !== 0) {
        this.$message.error(res.msg)
        return false
      }
      this.dataList2 = res.data.resultList || []
      this.formData2.total = res.data.totalNum
    },
    async getCommunityList () {
      this.formData.communityId = ''
      let req = {
        provinceId: this.formData.provinceId,
        cityId: this.formData.cityId,
        districtId: this.formData.districtId,
        streetId: this.formData.streetId
      }
      let res = await this.$post('community/community/getCommunityList', req)
      if (res.code === 0) {
        this.communityList = res.data
      }
    },
    // 查询
    toSearch () {
      this.formData.page = 1
      this.getList()
    },
    toSearch2 () {
      this.formData2.page = 1
      this.getOutLineList()
    },
    // 清空
    toClearForm () {
      this.formData = {
        provinceId: '',
        cityId: '',
        districtId: '',
        communityId: '',
        productName: '',
        exchangeNumber: '',
        phone: '',
        exchangeCode: '',
        exchangeChannels: this.exchangeChannels,
        page: 1,
        size: 20,
        total: 0
      }
      this.$refs.areaSearch.toResetValue()
      this.getList()
    },
    toClearForm2 () {
      this.formData2 = {
        memberName: '',
        memberPhone: '',
        operatorName: '',
        operatorPhone: '',
        communityId: '',
        page: 1,
        size: 20,
        total: 0
      }
      this.timeArr = []
      this.getOutLineList()
    },
    // 导出
    toDownload () {
      let req = this.outLine ? Object.assign({}, this.formData2) : Object.assign({}, this.formData)
      req.adminId = this.userInfo.id
      req.timeStart = this.timeArr && this.timeArr.length ? this.timeArr[0] : ''
      req.timeEnd = this.timeArr && this.timeArr.length ? this.timeArr[1] : ''
      if (!this.outLine) {
        req.exchangeChannels = this.exchangeChannels
      }
      delete req.page
      delete req.size
      delete req.total
      // let url = `${process.env.BASE_API}/system/exchangeRecord/export?`
      // for (let item in req) {
      //   url = `${url}${item}=${req[item]}&`
      // }
      // window.open(url)
      let url = this.outLine ? 'integral/getIntegralRecord/exportOffline' : 'system/exchangeRecord/export'
      this.$utils.exportFile(url, req)
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
    // 切换页面 - 页码
    handleCurrentChange2 (val) {
      this.formData2.page = val
      this.getOutLineList()
    },
    // 切换页面 - 页size
    handleSizeChange2 (val) {
      this.formData2.page = 1
      this.formData2.size = val
      this.getOutLineList()
    }
  },
  computed: {
    userInfo () {
      return this.$store.getters.userInfo
    },
    btnVisible () {
      let btnList = this.$store.getters.currentSubMenu && this.$store.getters.currentSubMenu.hasBtn ? this.$store.getters.currentSubMenu.hasBtn : null
      return btnList
    }
  }

}
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .imgBox{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 110px;
    height: 110px;
    img{
      width: 100%;
      height: auto;
      max-height: 100%;
    }
  }
</style>
