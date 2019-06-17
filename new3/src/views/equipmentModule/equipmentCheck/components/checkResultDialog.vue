<!-- 批量设置有效范围弹窗 -->
<template>
  <v-dialog title="检测结果" class="dialogWrap" :visible.sync="value" width="700px" :before-close="beforeClose" @submit.native.prevent>
    <div style="min-height: 350px; overflow-y: auto; margin: 0 100px">
      <div class="box" v-for="(item, index) in infoObj" :key="index">
        <span>{{item.title}}</span>
        <i v-if="item.isSuccessful" class="el-icon-success"></i>
        <i v-else class="el-icon-error"></i>
      </div>
    </div>

    <div slot="footer" style="text-align: center">
      <el-button @click="beforeClose">关 闭</el-button>
    </div>
  </v-dialog>
</template>
<script>
export default {
  name: 'checkResultDialog',
  props: {
    value: Boolean,
    infoObj: { // 表单数据
      type: Array,
      default: () => []
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
    }
  }
}
</script>
<style lang="scss" scoped>
  .box{
    display: flex;
    justify-content: space-between;
    font-weight:  700;
    font-size: 20px;
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
