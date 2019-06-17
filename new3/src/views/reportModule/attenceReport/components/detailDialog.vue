<!-- 批量设置有效范围弹窗 -->
<template>
  <v-dialog title="打卡详情" class="dialogWrap" :visible.sync="value" width="700px" :before-close="beforeClose" @submit.native.prevent>
    <!-- <div class="box">
      <div class="title" v-if="infoObj.signTimeType === 0">上午上班</div>
      <div class="title" v-else-if="infoObj.signTimeType === 1">上午下班</div>
      <div class="title" v-else-if="infoObj.signTimeType === 2">下午上班</div>
      <div class="title" v-else>下午下班</div>
      <div class="content">
        <div>打卡时间：{{infoObj.signTime}}</div>
        <div>状态：{{infoObj.typeName}}</div>
        <div>打卡位置：{{infoObj.signAddress}}</div>
        <template v-if="infoObj.img">
          <div>图片:</div>
          <div style="display: flex; justify-content: space-around">
            <img alt="" v-for="(item, index) in infoObj.img.split(',')" :key="index" :src="item">
          </div>
        </template>
      </div>
    </div> -->
    <div style="height: 550px; overflow-y: auto">
      <div class="box" v-for="(item, index) in dataList" :key="index">
        <div class="title" v-if="item.signTimeType === 0">上午上班打卡</div>
        <div class="title" v-else-if="item.signTimeType === 1">上午下班打卡</div>
        <div class="title" v-else-if="item.signTimeType === 2">下午上班打卡</div>
        <div class="title" v-else>下午下班打卡</div>
        <div class="content">
          <div>打卡时间：{{item.signTime}}</div>
          <div>状态：{{item.typeName}}</div>
          <div>打卡位置：{{item.signAddress}}</div>
          <template v-if="item.img">
            <div>图片：</div>
            <div style="display: flex;">
              <img  v-for="(item2, index2) in item.img.split(',')" :key="index2" alt="" :src="item2">
            </div>
          </template>
          <div>备注：{{item.remark}}</div>
        </div>
      </div>
    </div>

    <div slot="footer" style="text-align: center">
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>
<script>
export default {
  name: 'detailDialog',
  props: {
    value: Boolean,
    infoObj: { // 表单数据
      type: Object,
      default: () => {}
    }
  },
  data () {
    return {
      formData: {},
      dataList: [],
      saveLoading: false
    }
  },
  created () {
  },
  methods: {
    beforeClose () {
      this.$emit('input', false)
    },
    // 获取用户列表
    async getDetail (signDate, communityAdminId) {
      this.mainLoading = true
      let res = await this.$post('community/communityAdminAttendance/getDetail', { signDate, communityAdminId })
      this.mainLoading = false
      if (res.code !== 0) {
        res.msg && this.$message.error(res.msg)
        return false
      }
      this.dataList = res.data
    }
  },
  watch: {
    value (newVal) {
      if (!newVal) return false
      this.getDetail(this.infoObj.signDate, this.infoObj.communityAdminId)
    }
  }
}
</script>
<style lang="scss" scoped>
  .box{
    border: 1px solid #e5e5e5;
    margin-bottom: 20px;
    box-shadow: 0 2px 4px #e5e5e5;
    border-radius: 4px;
  }
  .title{
    height: 40px;
    background: #fafafa;
    border-bottom: 1px solid #e5e5e5;
    display: flex;
    align-items: center;
    padding-left: 6px;
    font-size: 16px;
  }
  .content{
    padding: 20px;
  }
  img{
    width: 100px;
    height: 100px;
    margin: 6px;
    // margin-right: 10px;
  }
</style>
